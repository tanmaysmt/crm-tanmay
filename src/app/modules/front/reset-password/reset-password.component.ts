import { Component, OnInit } from '@angular/core';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { AuthService } from 'src/app/service/auth.service';
import { FormBuilder,FormGroup, FormControl ,Validators} from '@angular/forms';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
declare var toastr:any;
declare var $:any;
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  loading=false;
  RequestButton:any;
  constructor(private router:Router,private service : AuthService,private fb :FormBuilder,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.loading=true;
    if (this.service.isAuthenticated()) {
      this.service.logOut();
		}
    this.service.checkPasswordToken({'token':this.route.snapshot.paramMap.get('id')})
      .subscribe(result => {
        if(result.status!="success"){
          this.router.navigate(['/link-expired']);
        }else{
          this.loading=false;
        }
      });
  }
  resetpassword = this.fb.group({
    password: ["", [Validators.required]],
    confirmpassword: ["", [Validators.required]],
  })
  onSubmit(data:any){
    this.RequestButton=true;
    data.token = this.route.snapshot.paramMap.get('id');
    if(data.password!="" && data.confirmpassword!="" && data.password==data.confirmpassword){
      this.loading=true;
      this.service.resetPassword(data)
      .subscribe(result => {
          if(result.status=="success"){
            this.loading=false;
            this.RequestButton=true;
            toastr.success(result.message);
            this.router.navigate(['/login']);
          }else{
            this.loading=false;
            this.RequestButton=false;
            toastr.error(result.message);
          }
      });
    }else{
      this.loading=false;
      this.RequestButton=false;
      toastr.error('Both Password must be required and same.');
    }
  }
}
