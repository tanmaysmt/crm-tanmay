import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators, FormControl } from '@angular/forms';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { AuthService } from 'src/app/service/auth.service';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
declare var toastr:any;
@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOtpComponent implements OnInit {

  constructor(private fb :FormBuilder,private router:Router ,private service : AuthService) { }
  email = localStorage.getItem('verificationemail');
  uid  = localStorage.getItem('varificationuid');
  loading=false;
  ngOnInit(): void {
    if(this.email==null && this.uid==null || this.email=="undefined" && this.uid=="undefined"){
      this.router.navigate(['/register']);
    }
  }
  OTPform = this.fb.group({
    otp:['',[Validators.required,Validators.minLength(6),Validators.maxLength(6)]]
  })
  onSubmitOtp(data:any){
    this.loading=true;
    data.uid = this.uid;
    this.service.verifyotp(data).subscribe(
      response => {
        if(response.success){
          localStorage.removeItem('verificationemail');
          localStorage.removeItem('varificationuid');
          this.service.storeWebToken(response.success);
          this.loading=false;
          this.router.navigate(['/crm/dashboard']);
        }
      },(error:any) =>{
        this.loading=false;
        toastr.error(error.error.error);
      }
    )
  }
  resendOtp(){
    this.loading=true;
    this.service.resendotp({'uid':this.uid}).subscribe(
      response => {
        if(response.status=='success'){
          this.loading=false;
          toastr.success(response.message);
        }else{
          this.loading=false;
          toastr.error(response.message);
        }
      },(error:any) =>{
        this.loading=false;
        toastr.error(error.error.error);
      }
    )
  }
}
