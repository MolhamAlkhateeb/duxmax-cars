import { NextRequest, NextResponse } from 'next/server';
import { ListingsRepository } from '@/db/repositories/listings.repository';
import { db } from '@/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get('make');

    if (!make) {
      return NextResponse.json({ models: [] });
    }

    const listingsRepo = new ListingsRepository(db);
    const models = await listingsRepo.getModelsForMake(make);

    return NextResponse.json({ models });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}
