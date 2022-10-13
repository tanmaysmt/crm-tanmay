import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl,FormGroup, Validators} from '@angular/forms';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
import {formatDate} from '@angular/common';
declare var toastr:any;
declare var $:any;
@Component({
  selector: 'app-campaign-report',
  templateUrl: './campaign-report.component.html',
  styleUrls: ['./campaign-report.component.css']
})
export class CampaignReportComponent {
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  url = CommonService.API_ENDPOINT;
  srcUrl = CommonService.SRC_API_ENDPOINT;
  campaign = {} as any;
  leadsCalled = [] as any;
  leadsPending = [] as any;
  newLeads = [] as any;
  totalleads = 0;
  leads = {};
  filters = {
    org_uid: this.orgId,
    profile_id: this.cProfile,
    uid: this.uId,
    campaign_id:this.route.snapshot.paramMap.get('cid'),
  }  
  constructor(private http:HttpClient,private router:Router,private common : CommonService,private fb:FormBuilder,private service : AuthService,private route:ActivatedRoute) {
    this.getCampaignReport();
  }
  getCampaignReport(){
    this.service.postRequest('getCampaignReport',this.filters)
    .subscribe(result  => {
      if(result){
        this.campaign = result.data.campaigns;
        this.leadsCalled = result.data.leadsCalled;
        this.leadsPending = result.data.leadsPending;
        this.newLeads = result.data.newLeads;
        this.totalleads = (this.leadsCalled.count+this.leadsPending.count);
      }
    })
  }
}
