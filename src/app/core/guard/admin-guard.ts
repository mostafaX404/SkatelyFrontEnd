import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { SnackbarService } from '../services/snackbar.service';

export const adminGuard: CanActivateFn = (route, state) => {

  const accountService= inject(AccountService)
  const snackService= inject(SnackbarService)
  const router = inject(Router);

  if(accountService.isAdmin()){
    return true
  }
  snackService.error("Nope");
  router.navigateByUrl("/shop")
  return false;
};
