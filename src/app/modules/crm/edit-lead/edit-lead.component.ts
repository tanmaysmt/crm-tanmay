import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl,FormGroup, Validators} from '@angular/forms';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
import { DatePipe } from '@angular/common';
declare var toastr:any;
declare var $:any;
@Component({
  selector: 'app-edit-lead',
  templateUrl: './edit-lead.component.html',
  styleUrls: ['./edit-lead.component.css']
})
export class EditLeadComponent {
  pipe:any;
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
  states = [] as  any;
  campaigns = [] as  any;
  dataSource = [] as  any;
  isEdit = false;
  selectedFile:any;
  selectedFileName=null;
  CSVButton=true; 
  isAccess = true;
  FileErrors = "";
  url = CommonService.API_ENDPOINT;
  srcUrl = CommonService.SRC_API_ENDPOINT; 
  receiveMessage($event:any) {
    if($event){
      function Permission(value:any,account:any) {
        if(account=='leads'){
          return JSON.parse($event.permissions).leads.some(function(el:any) {
            return el.value === value;
          }); 
        }
      }
      if(this.route.snapshot.paramMap.get('id')!=='add'){
        if(Permission('edit','leads')==false){
          this.isAccess=false;
          //this.router.navigate(['/crm/dashboard'])
        }
      }else if(Permission('create','leads')==false){
        this.isAccess=false;
        //this.router.navigate(['/crm/dashboard'])
      }
      if(this.route.snapshot.paramMap.get('id')!=='add'){
        this.editUid = this.route.snapshot.paramMap.get('id');
      }
    }
  }
  constructor(private http:HttpClient,private router:Router,private common : CommonService,private fb:FormBuilder,private service : AuthService,private route:ActivatedRoute) { 
    if(this.route.snapshot.paramMap.get('id')!=='add'){
      this.editUid = this.route.snapshot.paramMap.get('id');
    }else{
      this.editUid = "";
      this.editleads.reset();
    }
    this.getleads();
    this.leadsControls();
    this.getUserListdrop();
    this.getCampaignList();
    this.getAddresslist();
  }
  loading=true;
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
            this.editleads.patchValue({
              city : this.dataSource.address.City,
              state : this.dataSource.address.State,
              zip : this.dataSource.address.Pincode
            })
          }
        }
      })
    }
  }
  getleads(){
    this.service.apiPost('getleads',{"uid":this.uId,"org_uid":this.orgId,'lead_id':this.editUid})
    .subscribe(result => {
      this.loading = false;
      if(result){
        this.SProfileStatus = result.lead.profile_id;
        this.SleadSource = result.lead.lead_source;
        this.SleadStatus = result.lead.lead_status;
        this.ScrmIndustry = result.lead.industry;
        this.editleads.patchValue({
          country : 'India'
        })
        if(this.route.snapshot.paramMap.get('id')!=='add'){
          this.editleads.patchValue({
            first_name : result.lead.first_name,
            title : result.lead.title,
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
      }
    })
  }
  leadsControls(){
    this.service.apiPost('leadsControls',{"uid":this.uId,"org_uid":this.orgId,'lead_id':this.editUid})
    .subscribe(result => {
      if(result){
        this.leadStatus = result.data.LeadStatus;
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

  editleads=this.fb.group({
    title : ['',Validators.required],
    first_name : ['',Validators.required],
    last_name : ['',Validators.required],
    email: ["", [Validators.required, Validators.email]],
    gender : ['',Validators.required],
    company : [''],
    phone: ["", [Validators.required,Validators.minLength(10),Validators.maxLength(12)]],
    dob : [''],
    secondary_phone : [''],
    secondary_email : [''],
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
    country : ['India',Validators.required],
    zip : [''],
    campaign : [''],
    description : [''],
  })
  onSubmit(data:any){
    data.uid=this.uId;
    data.lead_id=this.editUid;
    data.org_uid=this.orgId;
    data.profile_id=this.cProfile;
    data.created_by=this.cProfile;
    data.modified_by =this.cProfile;
    this.service.apiPost('leadsAddEdit',data).subscribe(
      response => {
        if(response.status=='success'){
          this.router.navigate(['crm/leads']);
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
    this.FileErrors = "";
    if(event.target.files.length>0){
      this.selectedFile = event.target.files[0];
      this.selectedFileName = event.target.files[0].name;
      let extension = event.target.files[0].name.split('.').pop();
      if (['csv', 'xls', 'xlsx'].includes(extension)) {
        this.CSVButton = false;
      }else{
        toastr.error("Please Select Only CSV , xls and xlsx Type File");
        this.CSVButton = true;
      }
    }else{
      this.CSVButton = true;
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
          if(typeof(response.message)=='object'){
            this.FileErrors="";
            response.message.map((err:any)=>{
              this.FileErrors += 
              `<div class="alert alert-warning alert-dismissible">
                <p>${err}<p>
              </div>`
            });
          }else{
            toastr.error(response.message);
          } 
        }
      },error =>{
        toastr.error(error);
      }
    )
  }
}
