import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DictionaryComponent } from './pages/dictionary/dictionary.component';
import { VerificationComponent } from './pages/verification/verification.component';
import { SettingsComponent } from './pages/settings/settings.component';

//import { SelectivePreloadingStrategyService } from './selective-preloading-strategy.service';

const appRoutes: Routes = [
  {
    path: 'dictionary',
    component: DictionaryComponent,
  },
  {
    path: 'verification',
    component: VerificationComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  //{ path: '',   redirectTo: '/superheroes', pathMatch: 'full' },
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      //{
      //  enableTracing: false, // <-- debugging purposes only
      //  preloadingStrategy: SelectivePreloadingStrategyService,
      //}
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/