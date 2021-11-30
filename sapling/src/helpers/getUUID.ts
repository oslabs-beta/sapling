const VALID_CHARACTERS: string = 'abcdefghijklmnopqrstuvwxyz0123456789';
const UUID_LENGTH: number = 36;
const SEPARATOR_POSITIONS: number[] = [8, 13, 18, 23];

export function getUUID(): string {
  const uuid = new Array(UUID_LENGTH).fill('0');
  uuid.map(() => VALID_CHARACTERS.charAt(Math.floor(Math.random() * VALID_CHARACTERS.length)));
  SEPARATOR_POSITIONS.forEach((i) => (uuid[i] = '-'));
  return uuid.join('');
}
