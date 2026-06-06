import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { routes } from '../../app.routes';
import { NavigationExtras, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router)
  const snackbar = inject(SnackbarService)

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {

      if (err.status === 0) {
        snackbar.error('Unable to reach the server. Please check your network connection.');
        return throwError(() => new Error('Network error or server unavailable.'));

      }

      if (err.status == 400) {
        if (err.error.errors) {
          const modelStateErrors = [];
          for (const key in err.error.errors) {
            if (err.error.errors[key]) {
              modelStateErrors.push(err.error.errors[key])
            }
          }
          throw modelStateErrors.flat();
        } else {
          snackbar.error(err.error?.title || err.error || 'Invalid request');
        }
      }

      if (err.status == 401) {
        snackbar.error(err.error?.title || err.error || 'Unauthorized');
      } 
      
      if (err.status == 403) {
        snackbar.error("Forbidden");
      }

      if (err.status == 404) {
        router.navigateByUrl('/not-found')
      }

      if (err.status == 500) {
        const errorDetails = err.error || { message: 'Internal Server Error', details: 'No additional details provided' };
        const navigationExtras: NavigationExtras = { state: { error: errorDetails } };
        router.navigateByUrl('/server-error', navigationExtras);
      }
      return throwError(() => err)
    })

  );
};

