// src/app/whitelabel.interceptor.ts
import { inject } from '@angular/core';
import {HttpInterceptorFn, HttpRequest, HttpHandlerFn} from '@angular/common/http';
import {WhitelabelService} from '../../services/whitelabel/whitelabel.service';

export const whitelabelInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  console.log('interceptor', req.url);
  const whitelabelService = inject(WhitelabelService);
  const whitelabelId = whitelabelService.whitelabelId;

  // console.log(whitelabelService, whitelabelId);

  // If the whitelabelId is available, clone the request and add the header.
  const modifiedReq = whitelabelId
    ? req.clone({ headers: req.headers.set('X-Whitelabel-Id', whitelabelId) })
    : req;

  console.log(req.headers);

  return next(modifiedReq);
};
