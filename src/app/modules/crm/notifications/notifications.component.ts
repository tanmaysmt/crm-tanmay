import { Component, OnInit } from '@angular/core';
import { retry } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { Router, ActivatedRoute, NavigationEnd, Params, Route } from '@angular/router';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  uId: any = localStorage.getItem('uId');
  orgId: any = localStorage.getItem('org_uid');
  account_id: any = localStorage.getItem('acId');
  cProfile: any = localStorage.getItem('cProfile');
  notification = [] as any;
  html = "";
  shtml = "";
  constructor(private service: AuthService, private router: Router) {
    this.getNotification();
  }
  getNotification() {
    this.service.apiPost('getNotificationList', { "uid": this.uId })
      .subscribe(result => {
        if (result) {
          this.notification = result.data;
        }
      });
  }
  navigate(data: any) {
    console.log(data);
    switch (data.type) {
      case 'lead': {
        this.router.navigate(['/crm/leads/' + data.id]);
        break;
      }
      case 'account': {
        this.router.navigate(['/crm/accounts/' + data.id]);
        break;
      }
      case 'contact': {
        this.router.navigate(['/crm/contacts/' + data.id]);
        break;
      }
      case 'opportunity': {
        this.router.navigate(['/crm/opportunities/' + data.id]);
        break;
      }
      case 'task': {
        this.router.navigate(['/crm/task']);
        break;
      }
      default: {
        break;
      }
    }
  }
}
