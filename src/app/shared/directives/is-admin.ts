import { Directive, effect, inject, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AccountService } from '../../core/services/account.service';

@Directive({
  selector: '[appIsAdmin]',
})
export class IsAdmin  {
  
private accountService = inject(AccountService);
private templateRef = inject(TemplateRef);
private viewCOntainerRef = inject(ViewContainerRef);
  

constructor() {
 effect(()=>{
  if(this.accountService.isAdmin()){
      this.viewCOntainerRef.createEmbeddedView(this.templateRef);
    }else{
      this.viewCOntainerRef.clear();
    }
 })  
}



  }

 


