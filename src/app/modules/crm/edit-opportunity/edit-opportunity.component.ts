import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl,FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
declare var toastr:any;
declare var $:any;
@Component({
  selector: 'app-edit-opportunity',
  templateUrl: './edit-opportunity.component.html',
  styleUrls: ['./edit-opportunity.component.css']
})
export class EditOpportunityComponent  {

  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  url = CommonService.API_ENDPOINT;
  srcUrl = CommonService.SRC_API_ENDPOINT;
  selectedFile:any;
  selectedFileName=null;
  CSVButton=true; 
  editUid:any;
  leads = [] as  any;
  campaigns = [] as  any;
  states = [] as  any;
  dataSource = [] as  any;
  isEdit = false;
  leadSource:any;
  SleadSource:any;
  leadStatus:any;
  SleadStatus:any;
  crmIndustry:any;
  ScrmIndustry:any;
  userlists:any;
  SProfileStatus:any;
  isAccess=true;
  receiveMessage($event:any) {
    if($event){
      function Permission(value:any,account:any) {
        if(account=='opportunity'){
          return JSON.parse($event.permissions).opportunity.some(function(el:any) {
            return el.value === value;
          }); 
        }
      }
      if(this.route.snapshot.paramMap.get('id')!=='add'){
        this.isAccess = Permission('edit','opportunity');
      }else{
        this.isAccess = Permission('create','opportunity')
      }
    }
  }
  constructor(private http:HttpClient,private router:Router,private common : CommonService,private fb:FormBuilder,private service : AuthService,private route:ActivatedRoute) { 
    if(this.route.snapshot.paramMap.get('id')!=='add'){
      this.editUid = this.route.snapshot.paramMap.get('id');
    }else{
      this.editUid = "";
    }
    this.getOpportunity();
    this.leadsControls();
    this.getUserListdrop();
    this.getCampaignList();
    this.getAddresslist();
  }
  loading=true;
  getOpportunity(){
    this.service.apiPost('getOpportunity',{"uid":this.uId,"org_uid":this.orgId,'opportunity_id':this.editUid})
    .subscribe(result => {
      if(result){
        this.SProfileStatus = result.lead.profile_id;
        this.editOpportunity.patchValue({
          country : 'India'
        })
        this.editOpportunity.patchValue({
          profile_id : result.lead.profile_id,
          title : result.lead.title,
          first_name : result.lead.first_name,
          last_name : result.lead.last_name,
          email: result.lead.email,
          gender : result.lead.gender,
          company : result.lead.company,
          phone: result.lead.phone,
          dob : result.lead.dob,
          secondary_phone : result.lead.phone2,
          secondary_email : result.lead.email2,
          fax : result.lead.fax,
          website : result.lead.website,
          lead_source : result.lead.lead_source,
          lead_status : result.lead.lead_status,
          industry : result.lead.industry,
          number_of_employee : result.lead.number_of_employee,
          annual_revenue : result.lead.annual_revenue,
          address : result.lead.address,
          city : result.lead.city,
          state : result.lead.state,
          zip : result.lead.zip,
          campaign : result.lead.campaign,
          description : result.lead.description,
        })
      }
    });
  }
  leadsControls(){
    this.service.apiPost('leadsControls',{"uid":this.uId,"org_uid":this.orgId,'lead_id':this.editUid})
    .subscribe(result => {
      if(result){
         this.leadSource = result.data.LeadSource;
         this.leadStatus = result.data.LeadStatus;
         this.crmIndustry = result.data.CrmIndustry;
         this.loading = false;
      }
    })
  }
  getUserListdrop(){
    this.service.apiPost('getUserListdrop',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile})
    .subscribe(result => {
      this.userlists = result.data;
    });
  }
  getCampaignList(){
    this.service.apiPost('getCampaignList',{"uid":this.uId,"org_uid":this.orgId,"profile_id":this.cProfile})
    .subscribe(result  => {
      if(result){
        this.campaigns = result.data;
      }
    })
  }
  getAddresslist(){
    this.service.apiGet('states').subscribe(result => {
      if(result){
        this.states = result;
      }
    })
  }
  getZipcode(zipcode:any){
    if(zipcode.length=='6'){
      this.service.apiGet('CityStateZip?zipcode='+zipcode).subscribe(result => {
        if(result){
          this.dataSource = result;
          if(this.dataSource.address!=null){
            this.editOpportunity.patchValue({
              city : this.dataSource.address.City,
              state : this.dataSource.address.State,
              zip : this.dataSource.address.Pincode
            })
          }
        }
      })
    }
  }
  editOpportunity=this.fb.group({
    profile_id : [''],
    title : ['',Validators.required],
    first_name : ['',Validators.required],
    last_name : ['',Validators.required],
    email: ["", [Validators.required, Validators.email]],
    gender : ['',Validators.required],
    company : ['',Validators.required],
    phone: ["", [Validators.required,Validators.minLength(10),Validators.maxLength(12)]],
    dob : [''],
    secondary_email : [''],
    secondary_phone : [''],
    fax : [''],
    website : [''],
    lead_source : ['',Validators.required],
    lead_status : ['',Validators.required],
    industry : ['',Validators.required],
    number_of_employee : ['',Validators.required],
    annual_revenue : ['',Validators.required],
    address : ['',Validators.required],
    city : [''],
    state : ['',Validators.required],
    country : ['',Validators.required],
    zip : [''],
    campaign : [''],
    description : [''],
  })
  onSubmit(data:any){
    data.uid=this.uId;
    data.opportunity_id=this.editUid;
    data.org_uid=this.orgId;
    data.created_by=this.cProfile;
    data.modified_by=this.cProfile;
    if(data.profile_id==undefined){
      data.profile_id=this.cProfile;
    }
    this.service.apiPost('opportunityAddEdit',data).subscribe(
      response => {
        if(response.status=='success'){
          this.router.navigate(['crm/opportunities']);
          toastr.success(response.message);
        }else{
          toastr.error(response.message);
        }
      },error =>{
        toastr.error(error);
      }
    )
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
    this.http.post<any>(this.url + '/crm/ImportOpportunities', formData,this.service.getUploadMulitpleImages()).subscribe(
      response => {
        if(response.status=='success'){
          toastr.success(response.message);
          $("#modal-lg").modal("hide");
          this.importCSV.reset();
          this.router.navigate(['crm/opportunities']);
        }else{
          toastr.error(response.message);
        }
      },error =>{
        toastr.error(error);
      }
    )
  }
}
