import { ModuleWithProviders, NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Route[] = [  
  { 
      path: 'user', 
      loadChildren: async () => {          
        AppComponent.MODULE_NAME_LOADED = "USER_MODULE";      
        const mod = await import('./user/user.module');                        
        return mod.UserModule;      
      }
  },
  {
      path: 'admin',
      loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule)
  },
  { 
    path: '', 
    loadChildren: () => import('./core/core.module').then(mod => mod.CoreModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled' // Add options right here
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
