import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl,FormGroup, Validators} from '@angular/forms';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';
@Component({
  selector: 'app-select-org',
  templateUrl: './select-org.component.html',
  styleUrls: ['./select-org.component.css']
})
export class SelectOrgComponent implements OnInit {
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  profiles = [] as any;
  constructor(private fb : FormBuilder ,private service:AuthService,private route:ActivatedRoute,private router :Router) { }

  ngOnInit(): void {
    this.service.apiPost('userProfilelist',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile})
    .subscribe(result => {
      if(result.data){
        console.log(result.data);
        //this.profiles = result.data.profiles;
      }
    })
  }

}
