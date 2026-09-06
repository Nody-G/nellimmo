import { NextRequest, NextResponse } from 'next/server';
import { fetchCadastreByCoordinates, fetchCadastreByAddress } from '@/lib/cadastre';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const latStr = searchParams.get('lat');
    const lonStr = searchParams.get('lon');
    const address = searchParams.get('address');
    const postalCode = searchParams.get('postal_code') || '';
    const city = searchParams.get('city') || '';

    let parcel = null;
    const propLat = latStr ? parseFloat(latStr) : NaN;
    const propLon = lonStr ? parseFloat(lonStr) : NaN;

    if (!isNaN(propLat) && !isNaN(propLon) && propLat !== 0 && propLon !== 0) {
      parcel = await fetchCadastreByCoordinates(propLat, propLon);
    }

    if (!parcel && address && city) {
      parcel = await fetchCadastreByAddress(address, postalCode, city);
    }

    if (!parcel) {
      // Aucune parcelle cadastrale réelle n'a pu être retrouvée.
      // On ne fabrique PAS de parcelle fictive : une référence cadastrale inventée
      // pourrait être reprise dans des documents juridiques (mandats, compromis).
      return NextResponse.json(
        {
          success: false,
          error: 'Parcelle cadastrale introuvable pour cette adresse / ces coordonnées.',
          parcel: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      parcel,
    });
  } catch (error) {
    console.error('API Cadastre Route Error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération cadastrale' },
      { status: 500 }
    );
  }
}
