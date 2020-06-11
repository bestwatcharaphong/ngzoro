import * as CryptoJS from 'crypto-js';

/**
 * AES encrypt text with key
 * @param text: string
 * @param key: string
 */
export const encryptSecret = (text: string, key: string): string =>
  CryptoJS.AES.encrypt(text, key).toString();

/**
 * AES decrypt cipher with key
 * @param cipher: string
 * @param key: string
 */
export const decryptCipher = (cipher: string, key: string): string =>
  CryptoJS.AES.encrypt(cipher, key).toString();

/**
 * Generate random charactor
 * @param len: number
 * Cr: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
 */
export const generateSalt = (len: number): string => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < len; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
