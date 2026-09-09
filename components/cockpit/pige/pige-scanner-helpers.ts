import { computePigeDvfGap } from './pige-import';

export interface ScannerPitchParams {
  sellerName: string;
  surface: string;
  city: string;
  numPrice: number;
  gap: ReturnType<typeof computePigeDvfGap>;
}

export function generatePigePitch({ sellerName, surface, city, numPrice, gap }: ScannerPitchParams): string {
  const gapPct = gap?.gapPct ?? 0;
  const askingM2 = gap?.askingM2 ?? Math.round(numPrice / (parseInt(surface, 10) || 1));
  const gapText = gapPct > 5 ? `, soit +${gapPct}% au-dessus des repères DVF` : '';

  return (
    `« Bonjour ${sellerName}, je vous appelle au sujet de votre maison de ${surface} m² à ${city}.\n\n` +
    `Je ne vous appelle pas pour un démarchage classique : j’ai 2 acquéreurs avec financement validé en banque qui recherchent activement sur votre secteur.\n\n` +
    `Votre bien est affiché à ${numPrice.toLocaleString('fr-FR')} € (${askingM2.toLocaleString('fr-FR')} €/m²${gapText}).\n\n` +
    `Seriez-vous ouvert(e) à une visite de 15 minutes sans engagement pour valider la correspondance avec mes acheteurs ? »`
  );
}
