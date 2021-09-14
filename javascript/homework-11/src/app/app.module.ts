import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Router, RouterModule } from '@angular/router'
import { AppRoutingModule } from './app-routing.module'
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms'


import { ContextService } from './context.service';
import { LanguageService } from './language.service';
import { AppComponent } from './app.component'
import { DictionaryComponent } from './pages/dictionary/dictionary.component'
import { VerificationComponent } from './pages/verification/verification.component'
import { SettingsComponent } from './pages/settings/settings.component'
import { ListComponent } from './lib/list/list.component'
import { WordComponent } from './lib/word/word.component'

@NgModule({
  declarations: [
    AppComponent,
    DictionaryComponent,
    VerificationComponent,
    SettingsComponent,
    ListComponent,
    WordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [ContextService, LanguageService],
  bootstrap: [AppComponent]
})
export class AppModule {
    constructor(router: Router) {}
}
