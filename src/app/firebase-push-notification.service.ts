import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject } from 'rxjs'
import { AuthService } from './service/auth.service';
@Injectable({
  providedIn: 'root'
})
export class FirebasePushNotificationService {
  constructor(private angularFireMessaging: AngularFireMessaging,private service: AuthService) { }
  requestPermission(uid:any){
    this.angularFireMessaging.requestToken.subscribe(
    (token) => {
      this.service.apiPost('updatefcmToken',{"uid":uid,"fcm":token}).subscribe(
        response => {
          if(response.status=='success'){
            console.log(response)
          }
        }
      );
    },
    (err) => {
      console.log(err);
    }
    );
  }
}
