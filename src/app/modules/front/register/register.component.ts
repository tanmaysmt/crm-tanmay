import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
declare var toastr:any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
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
  loading = false;
  registrationform = new FormGroup({
    name : new FormControl(''),
    email : new FormControl(''),
    phone : new FormControl(''),
    organization : new FormControl(''),
    password : new FormControl(''),
    c_password : new FormControl(''),
  })
  constructor(private router:Router,private service : AuthService,private common:CommonService) { }
  ngOnInit(): void {
    if(localStorage.getItem('invited_email')!='undefined'){
      this.registrationform.patchValue({
        email:localStorage.getItem('invited_email')
      });
    }
    if (this.service.isAuthenticated()) {
			this.router.navigate(['/crm/dashboard']);
		}
  }
  onSubmit(data:any){
    this.loading = true;
    this.service.register(data).subscribe(
      response => {
        if(response.success){
          localStorage.removeItem('invited_email');
          localStorage.removeItem('verificationemail');
          localStorage.removeItem('varificationuid');
          localStorage.setItem('verificationemail',response.success.email);
          localStorage.setItem('varificationuid',response.success.uid);
          this.loading = false;
          this.router.navigate(['/verify-otp']);
        }
      },error =>{
        this.loading = false;
        toastr.error(error.error.error);
        
      }
    )
  }
}
