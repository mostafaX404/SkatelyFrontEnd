import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { SnackbarService } from '../services/snackbar.service';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {

  const accountService = inject(AccountService);
  const snackService = inject(SnackbarService);
  const router = inject(Router);

  const denyAccess = () => {
    snackService.error('Nope');
    router.navigateByUrl('/shop');
    return false;
  };

  if (accountService.currentUser()) {
    return accountService.isAdmin() ? true : denyAccess();
  }

  return accountService.getUserInfo().pipe(
    map(user => (user && accountService.isAdmin()) ? true : denyAccess())
  );
};
