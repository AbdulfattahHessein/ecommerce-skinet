import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackbar = inject(SnackbarService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 400) {
        if (err.error.errors) {
          const modalStateErrors: string[] = [];
          for (const key in err.error.errors) {
            if (err.error.errors[key]) {
              modalStateErrors.push(err.error.errors[key]);
            }
          }
          // throw modalStateErrors.flat();
          return throwError(() => modalStateErrors.flat());
        } else {
          snackbar.error(err.error.title || err.error);
        }
      }
      if (err.status === 401) {
        snackbar.error(err.error.title || err.error);
      }
      if (err.status === 404) {
        router.navigate(['not-found']);
      }
      if (err.status === 500) {
        router.navigate(['server-error'], { state: { error: err } });
      }

      return throwError(() => err);
    })
  );
};
