import { TestBed } from '@angular/core/testing';

import { EncryptInterceptorInterceptor } from './encrypt-interceptor.interceptor';

describe('EncryptInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      EncryptInterceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: EncryptInterceptorInterceptor = TestBed.inject(EncryptInterceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
