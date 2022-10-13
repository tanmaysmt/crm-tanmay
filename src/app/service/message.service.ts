import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private angularFireMessaging: AngularFireMessaging) { 
  }
  requestPermission(){
    this.angularFireMessaging.requestToken.subscribe(
    (token) => {
    return token;
    },
    (err) => {
      return 'Unable to get permission to notify';
    }
    );
  }
}
