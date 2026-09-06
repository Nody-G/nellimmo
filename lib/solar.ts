/**
 * Module Astronomique de Calcul Solaire Haute Précision (Algorithme NOAA)
 * Similaire aux fonctionnalités de SunLocator / SunSurveyor pour l'expertise immobilière.
 */

export interface SolarPosition {
  elevationDeg: number;     // Hauteur au-dessus de l'horizon (-90 à +90°)
  azimuthDeg: number;       // 0° = Nord, 90° = Est, 180° = Sud, 270° = Ouest
  isDaylight: boolean;
  shadowRatio: number;      // Longueur de l'ombre = Hauteur objet * shadowRatio
  cardinalLabel: string;
}

export interface DaySolarSummary {
  season: 'summer' | 'winter' | 'equinox' | 'today';
  seasonLabel: string;
  date: Date;
  sunriseTime: string;
  sunsetTime: string;
  solarNoonTime: string;
  maxElevationDeg: number;
  daylightDuration: string;
  sunriseAzimuthDeg: number;
  sunsetAzimuthDeg: number;
  hourlyArc: { hour: number; azimuthDeg: number; elevationDeg: number }[];
}

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

/**
 * Calcule la position exacte du soleil (Azimut, Élévation, Ombre)
 * pour des coordonnées GPS, une date et une heure locale.
 */
export function getSolarPosition(
  lat: number,
  lon: number,
  date: Date,
  hourDecimal: number
): SolarPosition {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const gamma = (2 * Math.PI / 365) * (dayOfYear - 1 + (hourDecimal - 12) / 24);

  const eqtime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  // Fuseau horaire de la France : UTC+2 en été, UTC+1 en hiver
  const isDST = date.getMonth() >= 2 && date.getMonth() <= 9;
  const tzOffsetHours = isDST ? 2 : 1;
  const timeOffset = eqtime + 4 * lon - 60 * tzOffsetHours;
  const tst = hourDecimal * 60 + timeOffset;
  const ha = tst / 4 - 180;

  const latRad = lat * RAD;
  const cza =
    Math.sin(latRad) * Math.sin(decl) +
    Math.cos(latRad) * Math.cos(decl) * Math.cos(ha * RAD);
  const zenithRad = Math.acos(Math.max(-1, Math.min(1, cza)));
  const elevationDeg = 90 - zenithRad * DEG;

  const sza = Math.sin(zenithRad);
  let azimuthDeg = 180;
  if (sza > 0.0001) {
    const cosAz =
      (Math.sin(latRad) * Math.cos(zenithRad) - Math.sin(decl)) /
      (Math.cos(latRad) * sza);
    const azRad = Math.acos(Math.max(-1, Math.min(1, cosAz)));
    azimuthDeg = ha > 0 ? 360 - azRad * DEG : azRad * DEG;
    azimuthDeg = (azimuthDeg + 180) % 360;
  }

  const isDaylight = elevationDeg > -0.833;
  // Facteur d'ombre portée (si élévation > 2°)
  const shadowRatio =
    elevationDeg > 2 ? Math.round((1 / Math.tan(elevationDeg * RAD)) * 10) / 10 : 15;

  let cardinalLabel = 'Sud';
  if (azimuthDeg >= 337.5 || azimuthDeg < 22.5) cardinalLabel = 'Nord';
  else if (azimuthDeg < 67.5) cardinalLabel = 'Nord-Est';
  else if (azimuthDeg < 112.5) cardinalLabel = 'Est';
  else if (azimuthDeg < 157.5) cardinalLabel = 'Sud-Est';
  else if (azimuthDeg < 202.5) cardinalLabel = 'Sud';
  else if (azimuthDeg < 247.5) cardinalLabel = 'Sud-Ouest';
  else if (azimuthDeg < 292.5) cardinalLabel = 'Ouest';
  else cardinalLabel = 'Nord-Ouest';

  return {
    elevationDeg: Math.round(elevationDeg * 10) / 10,
    azimuthDeg: Math.round(azimuthDeg * 10) / 10,
    isDaylight,
    shadowRatio,
    cardinalLabel,
  };
}

/**
 * Calcule l'éphéméride journalière pour une saison donnée.
 */
export function getDaySolarSummary(
  lat: number,
  lon: number,
  season: 'summer' | 'winter' | 'equinox' | 'today'
): DaySolarSummary {
  const currentYear = new Date().getFullYear();
  let date: Date;
  let seasonLabel: string;

  if (season === 'summer') {
    date = new Date(currentYear, 5, 21, 12, 0, 0); // 21 Juin
    seasonLabel = "Solstice d'Été (21 Juin)";
  } else if (season === 'winter') {
    date = new Date(currentYear, 11, 21, 12, 0, 0); // 21 Décembre
    seasonLabel = "Solstice d'Hiver (21 Décembre)";
  } else if (season === 'equinox') {
    date = new Date(currentYear, 2, 21, 12, 0, 0); // 21 Mars
    seasonLabel = 'Équinoxe (21 Mars / 21 Sept)';
  } else {
    date = new Date();
    seasonLabel = "Aujourd'hui";
  }

  // Calcul des heures de lever et coucher
  const hourlyArc: { hour: number; azimuthDeg: number; elevationDeg: number }[] = [];
  let maxElevationDeg = -90;
  let sunriseHour = 6;
  let sunsetHour = 20;
  let hasFoundSunrise = false;

  for (let h = 4; h <= 22; h += 0.25) {
    const pos = getSolarPosition(lat, lon, date, h);
    if (pos.elevationDeg > maxElevationDeg) {
      maxElevationDeg = pos.elevationDeg;
    }
    if (pos.elevationDeg > 0 && !hasFoundSunrise) {
      sunriseHour = h;
      hasFoundSunrise = true;
    }
    if (pos.elevationDeg > 0) {
      sunsetHour = h;
    }
    if (Number.isInteger(h) && pos.isDaylight) {
      hourlyArc.push({
        hour: h,
        azimuthDeg: pos.azimuthDeg,
        elevationDeg: pos.elevationDeg,
      });
    }
  }

  const formatH = (dec: number) => {
    const h = Math.floor(dec);
    const m = Math.round((dec - h) * 60);
    return `${String(h).padStart(2, '0')}h${String(m).padStart(2, '0')}`;
  };

  const dayLen = sunsetHour - sunriseHour;
  const dayLenH = Math.floor(dayLen);
  const dayLenM = Math.round((dayLen - dayLenH) * 60);

  const sunrisePos = getSolarPosition(lat, lon, date, sunriseHour);
  const sunsetPos = getSolarPosition(lat, lon, date, sunsetHour);

  return {
    season,
    seasonLabel,
    date,
    sunriseTime: formatH(sunriseHour),
    sunsetTime: formatH(sunsetHour),
    solarNoonTime: formatH((sunriseHour + sunsetHour) / 2),
    maxElevationDeg: Math.round(maxElevationDeg * 10) / 10,
    daylightDuration: `${dayLenH}h ${dayLenM}min`,
    sunriseAzimuthDeg: sunrisePos.azimuthDeg,
    sunsetAzimuthDeg: sunsetPos.azimuthDeg,
    hourlyArc,
  };
}
