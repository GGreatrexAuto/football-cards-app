import { getFlagUrl } from './flags';

describe('getFlagUrl', () => {
  it('returns a flagcdn URL for a known standard code', () => {
    expect(getFlagUrl('FRA')).toBe('https://flagcdn.com/w40/fr.png');
  });

  it('returns a flagcdn URL for Germany', () => {
    expect(getFlagUrl('DEU')).toBe('https://flagcdn.com/w40/de.png');
  });

  it('returns a subdivision URL for England', () => {
    expect(getFlagUrl('ENG')).toBe('https://flagcdn.com/w40/gb-eng.png');
  });

  it('returns a subdivision URL for Scotland', () => {
    expect(getFlagUrl('SCO')).toBe('https://flagcdn.com/w40/gb-sct.png');
  });

  it('returns a subdivision URL for Wales', () => {
    expect(getFlagUrl('WAL')).toBe('https://flagcdn.com/w40/gb-wls.png');
  });

  it('is case-insensitive', () => {
    expect(getFlagUrl('esp')).toBe('https://flagcdn.com/w40/es.png');
  });

  it('returns null for an unknown code', () => {
    expect(getFlagUrl('XYZ')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(getFlagUrl('')).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(getFlagUrl(undefined)).toBeNull();
  });
});
