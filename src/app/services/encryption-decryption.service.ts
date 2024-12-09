import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionDecryptionService {
  private key: CryptoJS.lib.WordArray;

  constructor() {
    this.key = CryptoJS.enc.Utf8.parse('pradeepsahanitestingvalue001@@@#');
  }

  encrypt(text: string): string {
    if (typeof text !== 'string') {
      console.log(text);
      throw new Error(`Input must be a string. Received: ${typeof text}`);
    }

    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const encrypted = CryptoJS.AES.encrypt(text, this.key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return `${iv.toString(CryptoJS.enc.Hex)}:${encrypted.toString()}`;
  }

 decrypt(encryptedString:any) {
        const [ivHex, encryptedData] = encryptedString.split(':');

        if (!ivHex || !encryptedData) {
            throw new Error('Invalid encrypted string format');
        }

        const decrypted = CryptoJS.AES.decrypt(encryptedData, this.key, {
            iv: CryptoJS.enc.Hex.parse(ivHex),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
       
        if (!decryptedText) {
            throw new Error('Decryption failed, possibly due to incorrect key or IV');
        }

        return decryptedText; 
    }
}
