const CODE_TO_FLAG: Record<string, string> = {
  // Caribbean & Central America
  ANT: 'ag', // Antigua and Barbuda (Football-Data.org code)
  ATG: 'ag', // Antigua and Barbuda (FIFA/ISO alpha-3)
  BAH: 'bs', // Bahamas
  BRB: 'bb', // Barbados
  BLZ: 'bz', // Belize
  CAY: 'ky', // Cayman Islands
  DOM: 'do', // Dominican Republic
  GRN: 'gd', // Grenada
  GUY: 'gy', // Guyana
  HAI: 'ht', // Haiti
  SKN: 'kn', // Saint Kitts and Nevis
  LCA: 'lc', // Saint Lucia
  VIN: 'vc', // Saint Vincent and the Grenadines
  SUR: 'sr', // Suriname
  TCA: 'tc', // Turks and Caicos Islands
  // Africa
  ALG: 'dz',
  ANG: 'ao',
  CMR: 'cm',
  CIV: 'ci',
  EGY: 'eg',
  GHA: 'gh',
  KEN: 'ke',
  MAR: 'ma',
  MOZ: 'mz',
  NGA: 'ng',
  SEN: 'sn',
  RSA: 'za',
  TUN: 'tn',
  // Americas
  ARG: 'ar',
  BOL: 'bo',
  BRA: 'br',
  CAN: 'ca',
  CHI: 'cl',
  COL: 'co',
  CRC: 'cr',
  CUB: 'cu',
  ECU: 'ec',
  SLV: 'sv',
  GUA: 'gt',
  HON: 'hn',
  JAM: 'jm',
  MEX: 'mx',
  PAN: 'pa',
  PAR: 'py',
  PER: 'pe',
  TRI: 'tt',
  URU: 'uy',
  USA: 'us',
  VEN: 've',
  // Asia / Middle East
  AUS: 'au',
  CHN: 'cn',
  IND: 'in',
  IRI: 'ir',
  IRQ: 'iq',
  ISR: 'il',
  JPN: 'jp',
  JOR: 'jo',
  KOR: 'kr',
  KWT: 'kw',
  LBN: 'lb',
  MAS: 'my',
  OMA: 'om',
  PAK: 'pk',
  KSA: 'sa',
  SYR: 'sy',
  THA: 'th',
  UAE: 'ae',
  UZB: 'uz',
  VIE: 'vn',
  // Europe
  ALB: 'al',
  AND: 'ad',
  ARM: 'am',
  AUT: 'at',
  AZE: 'az',
  BLR: 'by',
  BEL: 'be',
  BIH: 'ba',
  BUL: 'bg',
  HRV: 'hr',
  CYP: 'cy',
  CZE: 'cz',
  DEN: 'dk',
  EST: 'ee',
  FIN: 'fi',
  FRA: 'fr',
  GEO: 'ge',
  DEU: 'de',
  GRE: 'gr',
  HUN: 'hu',
  ISL: 'is',
  IRL: 'ie',
  ITA: 'it',
  KAZ: 'kz',
  LVA: 'lv',
  LIE: 'li',
  LTU: 'lt',
  LUX: 'lu',
  MLT: 'mt',
  MDA: 'md',
  MNE: 'me',
  NED: 'nl',
  MKD: 'mk',
  NOR: 'no',
  POL: 'pl',
  POR: 'pt',
  ROU: 'ro',
  RUS: 'ru',
  SMR: 'sm',
  SRB: 'rs',
  SVK: 'sk',
  SVN: 'si',
  ESP: 'es',
  SWE: 'se',
  SUI: 'ch',
  TUR: 'tr',
  UKR: 'ua',
  // UK constituent nations (subdivision codes)
  ENG: 'gb-eng',
  NIR: 'gb-nir',
  SCO: 'gb-sct',
  WAL: 'gb-wls',
  GBR: 'gb',
};

const FLAG_BASE = 'https://flagcdn.com/w40';

export function getFlagUrl(countryCode: string | undefined): string | null {
  if (!countryCode) return null;
  const code = CODE_TO_FLAG[countryCode.toUpperCase()];
  return code ? `${FLAG_BASE}/${code}.png` : null;
}
