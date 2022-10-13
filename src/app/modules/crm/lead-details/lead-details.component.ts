import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { FormBuilder, FormControl,FormGroup, Validators} from '@angular/forms';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
import { Location } from '@angular/common';
declare var toastr:any;
declare var $:any;
@Component({
  selector: 'app-lead-details',
  templateUrl: './lead-details.component.html',
  styleUrls: ['./lead-details.component.css']
})
export class LeadDetailsComponent {

  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  lead_id = this.route.snapshot.paramMap.get('id');
  lead_details=[] as any;
  deal_status=[] as any;
  lead_owner=[] as any;
  deal_contact=[] as any;
  userlists=[] as any;
  tasklist=[] as any;
  feedbacks = [] as any;
  loading = true;
  editLead = true;
  AddLead = true;
  DeleteLead = true;
  totalRows = 0;
  pageSize = 50;
  currentPage = 0;
  filters = {
    org_uid: this.orgId,
    profile_id: this.cProfile,
    uid: this.uId,
    filters: [] as any,
    pageSize: 50,
    pageNumber: 0,
  } 
  receiveMessage($event:any) {
    if($event){
      function Permission(value:any,account:any) {
        if(account=='leads'){
          return JSON.parse($event.permissions).leads.some(function(el:any) {
            return el.value === value;
          }); 
        }
      }
      if(Permission('view','leads')==false){
        this.router.navigate(['/crm/dashboard']);
      }
      if(Permission('edit','leads')==false){
        this.editLead = false;
      }
      if(Permission('create','leads')==false){
        this.AddLead = false;
      }
      if(Permission('delete','leads')==false){
        this.DeleteLead = false;
      }
    }
  }
  receiveUserInfo($event:any){
    //this.designation = $event.data.role.name
  }
  constructor(private location :Location,private router:Router,private common : CommonService,private service : AuthService,private route:ActivatedRoute,private fb:FormBuilder) { 
    this.getTasklist();
    this.getFeedbackList();
    this.getleadDetails();
    this.getUserListdrop();
  }
  getTasklist(){
    this.service.apiPost('getLeadTasklist',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile,'lead_id':this.lead_id})
    .subscribe(result => {
      console.log(result);
      this.tasklist = result.data;
    });
  }
 
  getleadDetails(){
    this.service.postRequest('getleadDetails',{"profile_id":this.cProfile,"uid":this.uId,"org_uid":this.orgId,'lead_id':this.lead_id})
    .subscribe(result => {
      if(result){
        this.lead_details = result.data;
        this.lead_owner = result.data.profile.user;
        this.loading = false;
      }
    })
  }
  getUserListdrop(){
    this.service.postRequest('getUserList',{org_uid: this.orgId,
      profile_id: this.cProfile,
      uid: this.uId,
      filters: [] as any,
      pageSize: 50,
      pageNumber: 0,})
    .subscribe(result  => {
      if(result){
        this.userlists = result.data;
      }
    })
  }
  getFeedbackList(){
    this.filters.filters = [
      { eq: this.lead_id, key: 'lead_id' },
    ]
    this.service.postRequest('getLeadFeedbacks',this.filters)
    .subscribe(result  => {
      if(result){
        this.loading = false;
        this.feedbacks = result.data;
        console.log(this.feedbacks);
      }
    })
  }
  convertlead=this.fb.group({
    profile_id : [''],
  })
  onSubmit(data:any){
    data.uid=this.uId;
    data.lead_id=this.lead_id;
    data.org_uid=this.orgId;
    if(data.profile_id==""){
      data.profile_id=this.cProfile;
    }
    data.created_by=this.cProfile;
    data.modified_by =this.cProfile;
    this.service.apiPost('convertLead',data).subscribe(
      response => {
        if(response.status=='success'){
          $("#modal-lg").modal("hide");
          toastr.success(response.message);
          this.router.navigate(['crm/leads']);
        }else{
          toastr.error(response.message);
        }
      },error =>{
        toastr.error(error);
      }
    )
  }
  edittask=this.fb.group({
    profile_id : [''],
    title : ['',Validators.required],
    task_for : ['',Validators.required],
    task_related_to : ['',Validators.required],
    due_date : ['',Validators.required],
    status : ['',Validators.required],
    priority : ['',Validators.required],
    description : [''],
  })
  TaskSubmit(data:any){
    data.uid=this.uId;
    data.org_uid=this.orgId;
    data.task_for='lead';
    data.task_related_to=this.lead_details.title;
    data.task_related_to_id=this.lead_details.id;
    if(data.profile_id==undefined || data.profile_id==""){
      data.profile_id=this.cProfile;
    }
    data.created_by = this.cProfile
    data.modified_by = this.cProfile
    this.service.apiPost('TaskAddEdit',data).subscribe(
      response => {
        if(response.status=='success'){
          this.getTasklist();
          $("#addTasks").modal("hide");
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
