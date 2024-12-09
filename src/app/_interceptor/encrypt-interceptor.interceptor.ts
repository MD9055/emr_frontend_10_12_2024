import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncryptInterceptorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const encryptedBody = this.encryptData(request.body);
    const encryptedRequest = request.clone({
      body: { payload: encryptedBody }
    });
    return next.handle(encryptedRequest);
  }

  encryptData(data: any): string {
    const secretKey = 'emr_2024'; // Replace with your secret key
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey);
    return encrypted.toString();
  }
}