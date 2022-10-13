import { Component ,OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging/sw';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'CRMPLUS';
  constructor() { 
  }
  ngOnInit(): void {
    Notification.requestPermission().then(function(result) {
      console.log(result);
    });
  }
}
