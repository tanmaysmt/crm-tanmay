import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { FormBuilder, FormControl,FormGroup, Validators} from '@angular/forms';
import { Location } from '@angular/common';
declare var toastr:any;
@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  showloader=false;
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  constructor(private http:HttpClient,private location :Location,private router:Router,private common : CommonService,private fb:FormBuilder,private service : AuthService,private route:ActivatedRoute) { }
  ngOnInit(): void {
    this.showloader= true;
    this.service.apiPost('ValidateUserPackage',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile})
    .subscribe(result => {
      if(result.status=='success'){
        if(result.data.role=='CEO'){
          if(result.data.is_package=='yes'){
            if(result.data.is_expired=='no'){
              this.showloader=false;
            }else{
              this.router.navigate(['/packages'])
            }
          }else{
            this.router.navigate(['/packages'])
          }
        }else{
          this.router.navigate(['/crm/dashboard'])
        }
      }
    },error =>{
      this.service.logOut();
      this.router.navigate(['/login'])
    })
  }
}
