import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { salesforceReducer } from './store/salesforce.reducer';
import { SalesforceEffects } from './store/salesforce.effects';
import { DisplaydataComponent } from './displaydata/displaydata.component';
import { ResultComponent } from './result/result.component';
import { EditComponent } from './edit/edit.component';
@NgModule({
  declarations: [
    AppComponent,
    DisplaydataComponent,
    ResultComponent,
    EditComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot({ salesforce: salesforceReducer }),
    EffectsModule.forRoot([SalesforceEffects,])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
