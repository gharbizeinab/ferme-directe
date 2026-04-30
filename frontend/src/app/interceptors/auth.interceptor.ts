// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
          this.snackBar.open('Session expirée. Veuillez vous reconnecter.', 'Fermer', {
            duration: 4000,
            panelClass: ['error-snack']
          });
        } else if (error.status === 403) {
          this.snackBar.open('Accès refusé.', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snack']
          });
        } else if (error.status === 0) {
          this.snackBar.open('Impossible de contacter le serveur.', 'Fermer', {
            duration: 4000,
            panelClass: ['error-snack']
          });
        }
        return throwError(() => error);
      })
    );
  }
}
