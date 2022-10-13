import { Component, OnInit } from '@angular/core';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { AuthService } from 'src/app/service/auth.service';
import { FormBuilder,FormGroup, FormControl ,Validators} from '@angular/forms';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
declare var toastr:any;
declare var $:any;
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  loading=false;
  RequestButton:any;
  constructor(private service : AuthService,private fb :FormBuilder) { }

  ngOnInit(): void {
    if (this.service.isAuthenticated()) {
      this.service.logOut();
		}
  }
  forgotpassword = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
  })
  onSubmit(data:any){
    this.RequestButton=true;
    if(data.email!=""){
      this.loading=true;
      this.service.forgotPassword(data)
      .subscribe(result => {
          if(result.status=="success"){
            this.loading=false;
            this.RequestButton=true;
            toastr.success(result.message);
          }else{
            this.loading=false;
            this.RequestButton=false;
            toastr.error(result.message);
          }
      });
    }else{
      this.loading=false;
      this.RequestButton=false;
      toastr.error('Email must be Required.');
    } 
  }
}
//