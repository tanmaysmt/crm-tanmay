import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModulesModule } from './modules/modules.module';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoDataComponent } from './no-data/no-data.component';
import { LoaderComponent } from './loader/loader.component'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule, SwRegistrationOptions} from '@angular/service-worker';
import { AngularFireModule} from '@angular/fire/compat';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { FirebasePushNotificationService } from './firebase-push-notification.service';
import { NgChartsModule } from 'ng2-charts';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    AppComponent,
    NoDataComponent,
    LoaderComponent,
  ],
  imports: [
    BrowserModule,ServiceWorkerModule,AngularFireModule.initializeApp({apiKey: "AIzaSyBOXqcOruaJENc6P4JldTaT4sxhd_OXLLY",
    authDomain: "flylight-85129.firebaseapp.com",
    
    databaseURL: "https://flylight-85129-default-rtdb.firebaseio.com",
    projectId: "flylight-85129",
    storageBucket: "flylight-85129.appspot.com",
    messagingSenderId: "1747067040",
    appId: "1:1747067040:web:008bb38a9aa3b3870529c5",
    measurementId: "G-2E68BBTK1S"}),
    AngularFireMessagingModule,
    RouterModule,
    AppRoutingModule,ModulesModule,HttpClientModule,FormsModule,ReactiveFormsModule,NgMultiSelectDropDownModule,BrowserAnimationsModule, NgChartsModule

  ],
  providers: [
    {
      provide: SwRegistrationOptions,
      useFactory: () => ({enabled: location.search.includes('sw=true')}),
    },FirebasePushNotificationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
