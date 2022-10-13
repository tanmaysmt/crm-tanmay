import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent{
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  privacy = "";
  constructor(private http:HttpClient,private router:Router,private common : CommonService,private service : AuthService,private route:ActivatedRoute) { 
    window.scroll({
      top: 0,
      left: 100,
      behavior: 'smooth'
    });
    this.getPrivacyPolicies();
  }
  getPrivacyPolicies(){
    this.service.apiPost('getPrivacyPolicies',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile})
      .subscribe(result => {
        console.log(result);
        this.privacy = result.privacy;
      },error =>{
        this.router.navigate(['/login'])
      })
  }
}
