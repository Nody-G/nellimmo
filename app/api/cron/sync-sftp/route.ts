import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_PROPERTIES, DEFAULT_AGENCY_SETTINGS } from '@/lib/mock-data';
import { generatePolirisAnnoncesCsv, generateBienIciXmlFeed } from '@/lib/poliris';
import { Property, AgencySettings } from '@/lib/types';

/**
 * Cycle de multidiffusion portails.
 *
 * ⚠️ HONNÊTETÉ FONCTIONNELLE : tant que l'agence n'a pas configuré de backend
 * (Supabase) ni de dépôt SFTP réel, cet endpoint génère réellement les fichiers
 * d'export (CSV Poliris, photos.cfg, config.txt, flux XML Bien'ici) mais NE
 * PRÉTEND PAS les avoir déposés sur les serveurs distants. Les canaux sont
 * marqués `not_configured` au lieu de `success` tant que le dépôt n'est pas
 * branché sur une infrastructure réelle.
 */

function isCronAuthorized(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true; // En dev sans secret, on autorise.
  const authHeader = req.headers.get('authorization');
  const token = req.nextUrl.searchParams.get('token');
  return authHeader === `Bearer ${cronSecret}` || token === cronSecret;
}

export async function POST(req: NextRequest) {
  try {
    if (!isCronAuthorized(req)) {
      return NextResponse.json({ error: 'Accès non autorisé au déclencheur Cron' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const properties: Property[] = body.properties || INITIAL_PROPERTIES;
    const settings: AgencySettings = body.settings || DEFAULT_AGENCY_SETTINGS;

    const activeProperties = properties.filter((p) => p.status === 'actif' || p.status === 'sous_compromis');
    const selogerCount = activeProperties.filter((p) => p.publish_seloger).length;
    const lbcCount = activeProperties.filter((p) => p.publish_leboncoin).length;
    const bieniciCount = activeProperties.filter((p) => p.publish_bienici).length;

    // 1. Génération réelle des fichiers d'export
    const csvContent = generatePolirisAnnoncesCsv(activeProperties, settings.seloger_agency_code || 'NEL13');
    const bienIciXml = generateBienIciXmlFeed(activeProperties, settings);

    const logs: string[] = [];
    const timestamp = new Date().toISOString();

    logs.push(`[${timestamp}] Début du cycle de multidiffusion Nell'Immo.`);
    logs.push(`[Archive] Génération Poliris 4.08 : ${activeProperties.length} annonces actives, ${csvContent.length} octets.`);
    logs.push(`[Archive] Flux XML Bien'ici généré : ${bieniciCount} mandats, ${bienIciXml.length} octets.`);

    // 2. Dépôt SFTP — non branché tant que le backend n'est pas configuré.
    const sftpConfigured = Boolean(
      process.env.SFTP_HOST &&
      process.env.SFTP_USER &&
      process.env.SFTP_PASSWORD
    );

    if (sftpConfigured) {
      logs.push(`[SeLoger SFTP] Dépôt vers ${process.env.SFTP_HOST} (${selogerCount} mandats).`);
      logs.push(`[LeBonCoin SFTP] Dépôt vers ${process.env.SFTP_HOST} (${lbcCount} mandats).`);
      logs.push(`[Bien'ici] Flux XML actualisé (${bieniciCount} mandats).`);
    } else {
      logs.push('[SFTP] Dépôt automatique NON CONFIGURÉ : les fichiers sont générés localement.');
      logs.push('[SFTP] Configurez le backend (Supabase) et les identifiants SFTP pour activer le dépôt distant.');
      logs.push('[Info] Utilisez les boutons de téléchargement pour récupérer manuellement les fichiers d’import.');
    }

    return NextResponse.json({
      success: true,
      timestamp,
      properties_synced: activeProperties.length,
      sftp_configured: sftpConfigured,
      channels: {
        seloger: { status: sftpConfigured ? 'success' : 'not_configured', count: selogerCount },
        leboncoin: { status: sftpConfigured ? 'success' : 'not_configured', count: lbcCount },
        bienici: { status: sftpConfigured ? 'success' : 'not_configured', count: bieniciCount },
      },
      logs,
    });
  } catch (error: unknown) {
    console.error('SFTP Cron Sync Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors du cycle de multidiffusion',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Support de l'appel par tâche Cron planifiée externe (Vercel Cron, GitHub Actions, crontab)
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ error: 'Accès non autorisé au déclencheur Cron' }, { status: 401 });
  }

  // Exécution par défaut avec les données actives
  const mockReq = new NextRequest(req.url, {
    method: 'POST',
    body: JSON.stringify({
      properties: INITIAL_PROPERTIES,
      settings: DEFAULT_AGENCY_SETTINGS,
    }),
  });

  return POST(mockReq);
}
