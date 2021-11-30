const VALID_CHARACTERS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const NONCE_LENGTH: number = 32;

export function getNonce(): string {
  const nonce = new Array(NONCE_LENGTH).fill('0');
  nonce.map(() => VALID_CHARACTERS.charAt(Math.floor(Math.random() * VALID_CHARACTERS.length)));
  return nonce.join('');
}
