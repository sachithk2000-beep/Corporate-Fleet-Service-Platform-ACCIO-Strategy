import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { location, selectedVehicles, serviceType, date, notes } = body;

        if (!location || !selectedVehicles?.length || !serviceType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('bookings')
            .insert([{ 
                location,
                vehicles: selectedVehicles,
                service_type: serviceType,
                booking_date: date || new Date().toISOString().split('T')[0],
                notes,
                status: 'pending',
                created_at: new Date().toISOString(),
            }])
            .select();

        if (error) throw error;

        return NextResponse.json({
            id: data[0].id,
            message: 'Booking created successfully',
            booking: data[0],
        }, { status: 201 });
    } catch (error: any) {
        console.error('Booking error:', error);
        return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { data, error } = await supabase.from('bookings').select('*');

        if (error) throw error;

        return NextResponse.json({ bookings: data }, { status: 200 });
    } catch (error: any) {
        console.error('Fetch bookings error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch bookings' }, { status: 500 });
    }
}