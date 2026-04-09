import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

function parseBookingRequest(input: string) {
    const lowerInput = input.toLowerCase();
    const vehicleMatch = input.match(/(\d+)\s*vans?/i);
    const vehicleCount = vehicleMatch ? parseInt(vehicleMatch[1]) : 1;

    let location = 'Irving Hub';
    if (lowerInput.includes('dallas')) location = 'Dallas Hub';

    let serviceType = 'wash';
    if (lowerInput.includes('detail')) serviceType = 'detailing';
    if (lowerInput.includes('maintenance')) serviceType = 'maintenance';
    if (lowerInput.includes('inspect')) serviceType = 'inspection';

    let date = new Date().toISOString().split('T')[0];
    if (lowerInput.includes('tomorrow')) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        date = tomorrow.toISOString().split('T')[0];
    }

    return { vehicleCount, location, serviceType, date };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userInput } = body;

        if (!userInput?.trim()) {
            return NextResponse.json({ error: 'Please provide a booking request' }, { status: 400 });
        }

        const { vehicleCount, location, serviceType, date } = parseBookingRequest(userInput);

        const { data: vehicles, error: vehicleError } = await supabase
            .from('vehicles')
            .select('id, name')
            .eq('location', location)
            .limit(vehicleCount);

        if (vehicleError) throw vehicleError;

        if (!vehicles || vehicles.length < vehicleCount) {
            return NextResponse.json({ error: `Only ${vehicles?.length || 0} vehicles available at ${location}` }, { status: 400 });
        }

        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert([{
                location,
                vehicles: vehicles.slice(0, vehicleCount).map(v => v.id),
                service_type: serviceType,
                booking_date: date,
                notes: `Agent-created booking from: "${userInput}"`,
                status: 'confirmed',
                created_at: new Date().toISOString(),
            }])
            .select();

        if (bookingError) throw bookingError;

        return NextResponse.json({
            bookingId: booking[0].id,
            message: `✅ Booking confirmed! ${vehicleCount} vans at ${location} for ${serviceType} on ${date}`,
            details: booking[0],
        }, { status: 201 });
    } catch (error: any) {
        console.error('Agent booking error:', error);
        return NextResponse.json({ error: error.message || 'Failed to process booking request' }, { status: 500 });
    }
}