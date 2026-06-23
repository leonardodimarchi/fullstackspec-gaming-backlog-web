import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../services/notification.service';

function getErrorMessage(error: HttpErrorResponse): string {
  const body = error.error as { message?: string | string[] } | null;
  if (body?.message) {
    return Array.isArray(body.message) ? body.message.join(', ') : body.message;
  }

  switch (error.status) {
    case 403:
      return 'Você não tem permissão para esta ação.';
    case 404:
      return 'Recurso não encontrado.';
    case 409:
      return 'Conflito: o recurso já existe ou está em uso.';
    case 503:
      return 'Serviço IGDB indisponível. Tente novamente mais tarde.';
    default:
      return 'Ocorreu um erro inesperado.';
  }
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const isAuthRoute =
          req.url.includes('/auth/login') || req.url.includes('/auth/register');
        if (!isAuthRoute) {
          auth.handleUnauthorized();
        }
      } else if (
        !req.url.includes('/auth/login') &&
        !req.url.includes('/auth/register')
      ) {
        notification.show(getErrorMessage(error), 'error');
      }
      return throwError(() => error);
    }),
  );
};
