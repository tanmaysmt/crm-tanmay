import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { FormBuilder, FormControl,FormGroup, Validators} from '@angular/forms';
import { Location } from '@angular/common';

declare var toastr:any;
declare var $:any;
@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent{
  cardloading = false;
  showOrganization=false;
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  packages=[] as any;
  first_name:any;
  showtopup=false;
  showtopups=true;
  user:any;
  AcceptTerms=false;
  acTypes:any;
  orgazs:any;
  roles:any;
  role:any;
  imageSrc:any;
  profiles = [] as any;
  Uprofiles = [] as any;
  invitations = [] as any;
  selectedorg:any;
  selectedorgid:any;
  topup:any;
  url = CommonService.API_ENDPOINT;
  srcUrl = CommonService.SRC_API_ENDPOINT;
  Rloading = true;
  islogin = false;
  loading = true;
  currentExpire="";
  selectedPackage="";
  ErrorMessage = "";
  constructor(private http:HttpClient,private location :Location,private router:Router,private common : CommonService,private fb:FormBuilder,private service : AuthService,private route:ActivatedRoute) { 
     this.PackageInformation();
     this.getUserInfo();
  }
  acceptTerms(){
    $("#modal-Confirmation").modal("hide");
    this.router.navigate(['/terms&conditions'])
  }
  PackageInformation(){
    this.service.apiPost('PackageInformation',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile})
    .subscribe(result => {
      if(result.status=='success'){
        this.currentExpire = result.message;
        if(result.data.paid_amount!=0.00){
          this.showtopup= true;
        }
      }else if(result.status=='failed'){
        this.currentExpire = result.message;
      }
    })
  }
  getUserInfo(){
    this.service.apiPost('getUserInfo',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile})
    .subscribe(result => {
      if(result.data){
        this.islogin = true;
        this.Rloading = false;
        this.role = result.data.role.name;
        this.profiles = result.data.profiles;
        this.selectedorg = result.data.orgaz.name;
        this.selectedorgid = result.data.orgaz.org_unique_id;
        this.first_name = result.data.user.first_name;
        this.orgazs = result.data.orgazs;
        this.imageSrc = this.srcUrl+'avatar/'+result.data.user.avatar;
        if(result.data.user.avatar===null){
          this.imageSrc = this.srcUrl+'avatar/avatar.png';
        }
      }
    },error =>{
      this.islogin = false;
    })
    this.service.packages('Package')
    .subscribe(resultP => {
      if(resultP){
        this.loading = false;
        this.packages = resultP;
      }
    },error =>{
      this.service.logOut();
      this.router.navigate(['']);
    })
  }
  CheckPackage(package_id:any){
    if(this.currentExpire=="PackageNotFound"){
      this.PurchasePackage(package_id);
    }else if(this.currentExpire=="PackageFound"){
      $("#modal-Confirmation").modal("show");
      this.selectedPackage = package_id;
    }
  }
  AcceptTermsandCondition(){
    if(this.selectedPackage!="" && this.AcceptTerms){
      $("#modal-Confirmation").modal("hide");
      this.PurchasePackage(this.selectedPackage)
    }else{
      toastr.error("Please Accept Our Terms and Conditions");
    }
  }
  PurchasePackage(package_id:any){
    this.cardloading=true;
    if (!this.service.isAuthenticated()) {
			this.router.navigate(['/login']);
		}else{
      this.service.apiPost('CheckPackage',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile,'package_id':package_id})
      .subscribe(result => {
        this.cardloading=false;
        if(result.status == "success"){
          var newThis=this;
          let options = {
            "key": "rzp_test_iijGgC2DfISWDR",
            "amount": result.data.amount, 
            "currency": "INR",
            "name": "Flylight",
            "description": "Package Transaction",
            "image": "assets/images/logo.png",
            "order_id": result.data.ordid, 
            "handler":(response:any)=>{
              newThis.VerifyPackagePayment(response)
            },
            "prefill": {
                "name": result.data.user.name,
                "email": result.data.user.email,
                "contact": result.data.user.phone
            },
            "notes": {
                "address": "Flylight CRM indore"
            },
            "theme": {
                "color": "#3399cc"
            }
          }; 
          let rzp1 = new this.common.nativeWindow.Razorpay(options);
          rzp1.open();
          rzp1.on('payment.failed', function (response:any){
            /* alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id); */
          });
        }else if(result.status=='warning'){
          toastr.warning(result.message);
        }else{
          toastr.error(result.message);
        }
      },error =>{
        this.islogin = false;
      })
    }
  }
  VerifyPackagePayment(response:any){
    this.cardloading=true;
    this.service.apiPost('VerifyPackagePayment',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile,'razorpay_payment_id':response.razorpay_payment_id,'razorpay_order_id':response.razorpay_order_id,'razorpay_signature':response.razorpay_signature})
      .subscribe(result => {
        if(result.status=='success'){
          this.cardloading=false;
          window.location.href=`${document.location.origin}/crm/order-history`;
        }
    })
  }
  VerifyTopupPayment(response:any){
    this.cardloading=true;
    this.service.apiPost('VerifyTopupPayment',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile,'razorpay_payment_id':response.razorpay_payment_id,'razorpay_order_id':response.razorpay_order_id,'razorpay_signature':response.razorpay_signature})
      .subscribe(result => {
        if(result.status=='success'){
          this.cardloading=false;
          window.location.href=`${document.location.origin}/crm/order-history`;
        }
    })
  }
  purchaseTopup(topup_id:any){
    this.cardloading=true;
    this.topup = topup_id;
    if (!this.service.isAuthenticated()) {
			this.router.navigate(['/login']);
		}else{
      this.service.apiPost('CheckTopup',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile,'topup_id':topup_id})
      .subscribe(result => {
        this.cardloading=false;
        if(result.status == "success"){
          toastr.success(result.message);
          var newThis=this;
          let options = {
            "key": "rzp_test_iijGgC2DfISWDR",
            "amount": result.data.amount, 
            "currency": "INR",
            "name": "Flylight",
            "description": "Topup Transaction",
            "image": "assets/images/logo.png",
            "order_id": result.data.ordid, 
            "handler":(response:any)=>{
              newThis.VerifyTopupPayment(response)
            },
            "prefill": {
                "name": result.data.user.name,
                "email": result.data.user.email,
                "contact": result.data.user.phone
            },
            "notes": {
                "address": "Flylight CRM indore"
            },
            "theme": {
                "color": "#3399cc"
            }
          }; 
          let rzp1 = new this.common.nativeWindow.Razorpay(options);
          rzp1.open();
          rzp1.on('payment.failed', function (response:any){
          });
        }else if(result.status=='warning'){
          toastr.warning(result.message);
        }else{
          toastr.error(result.message);
        }
      },error =>{
        this.islogin = false;
      })
    }
  }
  /* purchaseTopup(topup_id:any){
    this.cardloading=true;
    this.topup = topup_id;
    if (!this.service.isAuthenticated()) {
			this.router.navigate(['/login']);
		}else{
      this.service.apiPost('userProfilelist',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile})
      .subscribe(result => {
        if(result.data){
          if(result.data.length>1){
            window.scroll({
              top: 0,
              left: 100,
              behavior: 'smooth'
            });
            this.showtopups = false;
            this.cardloading=false;
            this.showOrganization=true;
            this.Uprofiles = result.data;
          }else{
            this.service.apiPost('CheckTopup',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile,'topup_id':topup_id})
            .subscribe(result => {
              this.cardloading=false;
              if(result.status == "success"){
                toastr.success(result.message);
                var newThis=this;
                let options = {
                  "key": "rzp_test_iijGgC2DfISWDR",
                  "amount": result.data.amount, 
                  "currency": "INR",
                  "name": "Flylight",
                  "description": "Topup Transaction",
                  "image": "assets/images/logo.png",
                  "order_id": result.data.ordid, 
                  "handler":(response:any)=>{
                    newThis.VerifyTopupPayment(response)
                  },
                  "prefill": {
                      "name": result.data.user.name,
                      "email": result.data.user.email,
                      "contact": result.data.user.phone
                  },
                  "notes": {
                      "address": "Flylight CRM indore"
                  },
                  "theme": {
                      "color": "#3399cc"
                  }
                }; 
                let rzp1 = new this.common.nativeWindow.Razorpay(options);
                rzp1.open();
                rzp1.on('payment.failed', function (response:any){
                });
              }else if(result.status=='warning'){
                toastr.warning(result.message);
              }else{
                toastr.error(result.message);
              }
            },error =>{
              this.islogin = false;
            })
          }
        }
      })
    }
  } */
  selectOrg(profile_id:any,orgId:any){
    this.service.apiPost('CheckTopup',{"uid":this.uId,"org_uid":orgId,'profile_id':profile_id,'topup_id':this.topup})
    .subscribe(result => {
      this.cardloading=false;
      if(result.status == "success"){
        var newThis=this;
          let options = {
            "key": "rzp_test_iijGgC2DfISWDR",
            "amount": result.data.amount, 
            "currency": "INR",
            "name": "Flylight",
            "description": "Topup Transaction",
            "image": "assets/images/logo.png",
            "order_id": result.data.ordid, 
            "handler":(response:any)=>{
              newThis.VerifyTopupPayment(response)
            },
            "prefill": {
                "name": result.data.user.name,
                "email": result.data.user.email,
                "contact": result.data.user.phone
            },
            "notes": {
                "address": "Flylight CRM indore"
            },
            "theme": {
                "color": "#3399cc"
            }
          }; 
          let rzp1 = new this.common.nativeWindow.Razorpay(options);
          rzp1.open();
          rzp1.on('payment.failed', function (response:any){
            /* alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id); */
          });
      }else if(result.status=='warning'){
        toastr.warning(result.message);
      }else{
        toastr.error(result.message);
      }
    },error =>{
      this.islogin = false;
    })
  }
  logout(){
    this.service.logOut();
    this.router.navigate(['/login']);
  }
}
