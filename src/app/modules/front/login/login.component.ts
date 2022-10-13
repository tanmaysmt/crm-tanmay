import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/service/common.service';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { AuthService } from 'src/app/service/auth.service';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { FirebasePushNotificationService } from 'src/app/firebase-push-notification.service';
declare var toastr:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  token:any;
  Css = [
    "assets/assets/css/bootstrap.min.css",
    "assets/assets/css/animate.min.css",
    "assets/assets/css/owl.carousel.min.css",
    "assets/assets/css/owl.theme.default.min.css",
    "assets/assets/css/odometer.min.css",
    "assets/assets/css/nice-select.min.css",
    "assets/assets/css/meanmenu.css",
    "assets/assets/css/style.css",
    "assets/assets/css/responsive.css",
  ]
  Scripts = [
    "assets/assets/js/jquery.min.js",
    "assets/assets/js/popper.min.js",
    "assets/assets/js/bootstrap.min.js",
    "assets/assets/js/jquery.meanmenu.js",
    "assets/assets/js/owl.carousel.min.js",
    "assets/assets/js/jquery.appear.js",
    "assets/assets/js/odometer.min.js",
    "assets/assets/js/jquery.nice-select.min.js",
    "assets/assets/js/wow.min.js",
    "assets/assets/js/main.js"
  ];
  constructor(private notification : FirebasePushNotificationService,private router:Router,private service : AuthService,private common:CommonService) {
    this.common.removeCSS(this.Css);
    this.common.removeScripts(this.Scripts);
  }
  invitation_id = localStorage.getItem('invitation_id');
  ngOnInit(): void {
    if(localStorage.getItem('invited_email')!='undefined'){
      this.loginform.patchValue({
        username:localStorage.getItem('invited_email')
      });
    }
    if (this.service.isAuthenticated()) {
			this.router.navigate(['/services']);
		}
  }
  loginform = new FormGroup({
    username : new FormControl(''),
    password : new FormControl(''),
  })
  onSubmit(data:any){
    data.invitation_id = this.invitation_id;
    this.service.login(data).subscribe(
      response => {
        if(response.success){
          localStorage.removeItem('invited_email');
          localStorage.removeItem('invitation_id');
          this.service.storeWebToken(response.success);
          this.notification.requestPermission(response.success.uid);
          this.router.navigate(['/services']);
        }
      },error =>{
        toastr.error(error.error.error);
      }
    )
  }
}
