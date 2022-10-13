import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl,FormGroup, Validators} from '@angular/forms';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
declare var toastr:any;
declare var $:any;
@Component({
  selector: 'app-edit-deal',
  templateUrl: './edit-deal.component.html',
  styleUrls: ['./edit-deal.component.css']
})
export class EditDealComponent implements OnInit {

  uId:any = localStorage.getItem('uId');
  orgId = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  public emaildisable=false;
  editUid:any;
  public first_name:any;
  public last_name:any;
  public designation:any;
  public data:any;
  public avatar:any;
  public HeaderText:any = 'Create Account';
  accounts = [] as  any;
  contacts = [] as  any;
  isEdit = false;
  leadSource:any;
  SleadSource:any;
  DealStatus:any;
  SDealStatus:any;
  SAccount:any;
  SContact:any;
  editDeal = true;
  AddDeal = true;
  DeleteDeal = true;
  constructor(private router:Router,private common : CommonService,private fb:FormBuilder,private service : AuthService,private route:ActivatedRoute) { 
    this.common.loadScripts(this.dynamicScripts);
    this.common.loadCss(this.dynamicCss);
  }
  loading=true;
  dynamicScripts = [
    "assets/plugins/flatpickr/flatpickr.min.js",
    "assets/js/datetime.js",
  ];
  dynamicCss = [
    "assets/plugins/flatpickr/flatpickr.min.css"
  ]
  ngOnInit(): void {
    this.service.getPermissions().subscribe(result => {
      if(result){
        function Permission(value:any,account:any) {
          if(account=='deals'){
            return JSON.parse(result.permissions).deals.some(function(el:any) {
              return el.value === value;
            }); 
          }
        }
        if(Permission('edit','deals')==false){
          this.router.navigate(['/crm/dashboard']);
        }
        if(Permission('add','deals')==false){
          this.AddDeal = false;
        }
        if(Permission('delete','deals')==false){
          this.DeleteDeal = false;
        }
      }
    })
    if(this.route.snapshot.paramMap.get('id')!=='add'){
      this.editUid = this.route.snapshot.paramMap.get('id');
    }else{
      this.editUid = "";
    }
    this.service.apiPost('getdeal',{"uid":this.uId,"org_uid":this.orgId,'deal_id':this.editUid,'profile_id':this.cProfile})
    .subscribe(result => {
      if(result){
        this.editleads.patchValue({
          DealName : result.deal.deal_name,
          AccountName : result.deal.account_id,
          LeadSource: result.deal.lead_source,
          ContactName : result.deal.contact_id,
          Amount : result.deal.amount,
          ClosingDate: result.deal.closing_date,
          Stage : result.deal.stage,
          Probability : result.deal.possibility,
          ExpectedRevenue : result.deal.expected_revenue,
          CampaignSource : result.deal.dob,
          Description : result.deal.description,
        })
      }
    })
    this.service.apiPost('dealStatusList',{"uid":this.uId,"org_uid":this.orgId,'deal_id':this.editUid})
    .subscribe(result => {
      if(result){
         this.leadSource = result.data.LeadSource;
         this.DealStatus = result.data.DealStatus;
      }
    })
    this.service.apiPost('getAccountList',{"uid":this.uId,"org_uid":this.orgId,"profile_id":this.cProfile})
    .subscribe(result  => {
      if(result){
        this.accounts = result.data;
      }
    })
    this.service.apiPost('getContactList',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile})
    .subscribe(result  => {
      if(result){
        this.loading = false;
        this.contacts = result.data;
        this.loading = false;
      }
    })
  }
  editleads=this.fb.group({
    DealName : ['',Validators.required],
    AccountName : ['',Validators.required],
    LeadSource: ["", Validators.required],
    ContactName : ['',Validators.required],
    Amount : ['',Validators.required],
    ClosingDate: [""],
    Stage : [''],
    Probability : [''],
    ExpectedRevenue : [''],
    CampaignSource : [''],
    Description : [''],
  })
  onSubmit(data:any){
    data.uid=this.uId;
    data.deal_id=this.editUid;
    data.org_uid=this.orgId;
    data.profile_id=this.cProfile;
    this.service.apiPost('dealsAddEdit',data).subscribe(
      response => {
        if(response.status=='success'){
          this.router.navigate(['crm/deals']);
          toastr.success(response.message);
        }else{
          toastr.error(response.message);
        }
      },error =>{
        toastr.error(error);
      }
    )
  }

}
