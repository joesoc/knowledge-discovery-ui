import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from '../../services/login.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const loginService = inject(LoginService);
  const token = loginService.token;

  return next(req);

  // TODO
  // if (token) {
  //   const cloned = req.clone({
  //     setParams: {
  //       'Security-Info': token,
  //     },
  //   });
  //   return next(cloned);
  // } else {
  //   return next(req);
  // }
};
