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
  selector: 'app-edit-campaign',
  templateUrl: './edit-campaign.component.html',
  styleUrls: ['./edit-campaign.component.css']
})
export class EditCampaignComponent implements OnInit {

  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  public emaildisable=false;
  editUid:any;
  public first_name:any;
  public last_name:any;
  public designation:any;
  public data:any;
  public avatar:any;
  leadSource:any;
  SleadSource:any;
  SProfileStatus:any;
  leadStatus:any;
  SleadStatus:any;
  crmIndustry:any;
  ScrmIndustry:any;
  userlists:any;
  leads = [] as  any;
  isEdit = false;
  selectedFile:any;
  selectedFileName=null;
  CSVButton=true; 
  cStartDate = "";
  cEndsDate = "";
  Submit = true;
  url = CommonService.API_ENDPOINT;
  srcUrl = CommonService.SRC_API_ENDPOINT; 
  constructor(private http:HttpClient,private router:Router,private common : CommonService,private fb:FormBuilder,private service : AuthService,private route:ActivatedRoute) { 
  }
  loading=true;
  
  ngOnInit(): void {
    console.log(this.route.snapshot.paramMap.get('id'));
    this.service.getPermissions().subscribe(result => {
      if(result){
        function Permission(value:any,account:any) {
          if(account=='campaigns'){
            return JSON.parse(result.permissions).leads.some(function(el:any) {
              return el.value === value;
            }); 
          }
        }
        if(this.route.snapshot.paramMap.get('id')=='add'){
          if(Permission('create','campaigns')==false){
            this.router.navigate(['crm/dashboard'])
          }
        }else {
          if(Permission('edit','campaigns')==false){
            this.router.navigate(['crm/dashboard'])
          }
        }
        if(this.route.snapshot.paramMap.get('id')!=='add'){
          this.editUid = this.route.snapshot.paramMap.get('id');
        }
      }
    })
    if(this.route.snapshot.paramMap.get('id')!=='add'){
      this.editUid = this.route.snapshot.paramMap.get('id');
    }else{
      this.editUid = "";
      this.editCampaign.reset();
    }
    this.service.apiPost('getCampaign',{"uid":this.uId,"org_uid":this.orgId,'campaign_id':this.editUid})
    .subscribe(result => {
      if(result){
        this.SProfileStatus = result.lead.profile_id;
        /* this.SleadSource = result.lead.lead_source;
        this.SleadStatus = result.lead.lead_status;
        this.ScrmIndustry = result.lead.industry; */
        if(this.route.snapshot.paramMap.get('id')!=='add'){
          this.cStartDate = result.lead.start_date;
          this.cEndsDate = result.lead.end_date;
          this.editCampaign.patchValue({
            profile_id : result.lead.profile_id,
            campaign_name : result.lead.campaign_name,
            campaign_type : result.lead.campaign_type,
            campaign_status : result.lead.status,
            start_date : result.lead.start_date,
            end_date : result.lead.end_date,
            expected_revenue : result.lead.expected_revenue,
            budgeted_cost : result.lead.budgeted_cost,
            description : result.lead.description,
          })
        }
      }
    })
    this.service.apiPost('leadsControls',{"uid":this.uId,"org_uid":this.orgId,'lead_id':this.editUid})
    .subscribe(result => {
      if(result){
        this.leadSource = result.data.LeadSource;
        this.leadStatus = result.data.LeadStatus;
        this.crmIndustry = result.data.CrmIndustry;
        this.loading = false;
      }
    })
    this.service.apiPost('getUserListdrop',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile})
    .subscribe(result => {
      this.userlists = result.data;
    });
  }
  editCampaign=this.fb.group({
    profile_id : [''],
    campaign_name : ['',Validators.required],
    campaign_type : ['',Validators.required],
    campaign_status : ['',Validators.required],
    start_date : ['',Validators.required],
    end_date : ['',Validators.required],
    expected_revenue : [''],
    budgeted_cost : [''],
    description : [''],
  })

  startDate(event:any){
    if(this.route.snapshot.paramMap.get('id') =='add'){
      this.cStartDate = event.target.value;
      if (formatDate(event.target.value, 'yyyy-MM-dd', 'en') < formatDate(new Date(), 'yyyy-MM-dd', 'en')) {
        toastr.error('Start Date Should be Greater than Current Date.');
        this.editCampaign.patchValue({
          start_date : "",
        })
        this.cStartDate = "";
      }
    }else if(formatDate(event.target.value, 'yyyy-MM-dd', 'en') < formatDate(this.cStartDate, 'yyyy-MM-dd', 'en')){
      toastr.error('Start Date Should not be less than Previous Date.');
    }
    if(this.cEndsDate != "" && formatDate(event.target.value, 'yyyy-MM-dd', 'en') > formatDate(this.cEndsDate, 'yyyy-MM-dd', 'en')){
      toastr.error('Start Date Should not be Greater than End Date.');
    } 
  }

  endDate(event:any){
    if(this.cStartDate === ""){
      toastr.error('Please Select Start Date First.');
    }else if(new Date(event.target.value).getTime() <= new Date(this.cStartDate).getTime()){
      toastr.error('End Date should be Greater than Start Date.');
    }
  }
  onSubmit(data:any){
    console.log(typeof data.start_date);
    //if (data.start_date !== "null" && data.end_date !== "null" && formatDate(data.start_date, 'yyyy-MM-dd', 'en') < formatDate(data.end_date, 'yyyy-MM-dd', 'en')) {
      data.uid=this.uId;
      data.campaign_id=this.editUid;
      data.org_uid=this.orgId;
      if(data.profile_id==undefined){
        data.profile_id=this.cProfile;
      }
      data.created_by=this.cProfile;
      data.modified_by =this.cProfile;
      this.service.apiPost('campaignAddEdit',data).subscribe(
        response => {
          if(response.status=='success'){
            this.router.navigate(['crm/campaigns']);
            toastr.success(response.message);
          }else{
            toastr.error(response.message);
          }
        },error =>{
          toastr.error(error);
        }
      )
    //}else{
      //toastr.error('Start Date Should not be Greater than End Date.');
      //this.cStartDate = "";
      //this.cEndsDate = "";
    //}
  }
  downloadsample(){
    this.service.apiPost('exportCsvLeadSample',{"uid":this.uId,"org_uid":this.orgId,"profile_id":this.cProfile})
    .subscribe(result  => {
      if(result){
        this.common.downloadFile(result.data,result.columns);
      }
    })
  }
  onfileselected(event:any){
    this.selectedFile = event.target.files[0];
    this.selectedFileName = event.target.files[0].name;
    if(this.selectedFile.type!=='text/csv'){
      toastr.error("Please Select Only CSV Type File");
      this.CSVButton = true;
    }else{
      this.CSVButton = false;
    }
  }
  importCSV=this.fb.group({
    importLead:[''],
  })
  onImport(data:any){
    var formData=new FormData();
    formData.append('uid',this.uId)
    formData.append('profile_id',this.cProfile)
    formData.append('org_uid',this.orgId)
    formData.append('CSVFILE',this.selectedFile)
    this.http.post<any>(this.url + '/crm/ImportLeads', formData,this.service.getUploadMulitpleImages()).subscribe(
      response => {
        if(response.status=='success'){
          toastr.success(response.message);
          $("#modal-lg").modal("hide");
          this.importCSV.reset();
          this.router.navigate(['crm/leads']);
        }else{
          toastr.error(response.message);
        }
      },error =>{
        toastr.error(error);
      }
    )
  }
}
