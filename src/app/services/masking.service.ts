import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MaskingService {

  constructor() { }

  maskPhone(phone: string): string {
    if (!phone) return '';
    const maskedPart = phone.slice(0, -4).replace(/\d/g, '*'); 
    return maskedPart + phone.slice(-4); 
  }


  maskEmail(email: string): string {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) return '***@' + domain; 
    const maskedLocalPart = localPart.slice(0, 2) + '***';
    return `${maskedLocalPart}@${domain}`; 
  }
}
