import { enableProdMode, NgModuleRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BookDataManipulation } from 'data/book/book-data-manipulation';
import { LocalStorage } from 'data/local-storage';
import { UserDataManipulation } from 'data/users/input.data';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Init all data  
LocalStorage.initData();

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).then(async (value: NgModuleRef<AppModule>) => {  
})
  .catch(err => console.error(err));
