import { Component, OnInit ,ViewChild} from '@angular/core';
import { FormBuilder, FormControl,FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort, Sort} from '@angular/material/sort';
import { LiveAnnouncer} from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import {formatDate} from '@angular/common';
declare var toastr:any;
declare var $:any;
@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  @ViewChild(MatPaginator) paginator = [] as any;
  @ViewChild(MatSort) sort = [] as any;
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  url = CommonService.API_ENDPOINT;
  srcUrl = CommonService.SRC_API_ENDPOINT;
  dataSource = [] as  any;
  selectedFile:any;
  selectedFileName=null;
  CSVButton=true; 
  editUid:any;
  leads = [] as  any;
  campaigns = [] as  any;
  isEdit = false;
  leadSource:any;
  userlists:any;
  SleadSource:any;
  leadStatus:any;
  SleadStatus:any;
  crmIndustry:any;
  ScrmIndustry:any;
  SProfileStatus:any;
  lead_id:any;
  lead_type:any;
  selectedlead ="";
  cStartDate ="";
  pipe:any;
  constructor(private _liveAnnouncer: LiveAnnouncer,private http:HttpClient,private router:Router,private common : CommonService,private fb:FormBuilder,private service : AuthService,private route:ActivatedRoute) { }
  loading=true;
  displayedColumns: string[] = ['id','title','first_name','email', 'phone','name'];
  ngOnInit(): void {
    this.service.getPermissions().subscribe(result => {
      if(result){
        function Permission(value:any,account:any) {
          if(account=='tasks'){
            return JSON.parse(result.permissions).tasks.some(function(el:any) {
              return el.value === value;
            }); 
          }
        }
        if(this.route.snapshot.paramMap.get('id')!=='add'){
          if(Permission('edit','tasks')==false){
            this.router.navigate(['/crm/dashboard'])
          }
        }else if(Permission('create','tasks')==false){
          this.router.navigate(['/crm/dashboard'])
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
    }
    if(this.editUid!=""){
      this.service.apiPost('getTask',{"uid":this.uId,"org_uid":this.orgId,'task_id':this.editUid})
      .subscribe(result => {
        if(result){
          this.edittask.patchValue({
            profile_id : result.task.profile_id,
            title : result.task.title,
            task_for : result.task.task_for,
            task_related_to : result.task.related_to,
            task_related_to_id : result.task.what_id,
            due_date : result.task.due_date,
            status : result.task.status,
            priority : result.task.priority,
            description : result.task.description,
          })
        }
      });
    }
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
  edittask=this.fb.group({
    profile_id : [''],
    title : ['',Validators.required],
    task_for : ['',Validators.required],
    task_related_to : ['',Validators.required],
    task_related_to_id : ['',Validators.required],
    due_date : ['',Validators.required],
    status : ['',Validators.required],
    priority : ['',Validators.required],
    description : [''],
  })

  startDate(event:any){
    var ToDate = new Date();
    this.cStartDate = event.target.value;
    if (formatDate(event.target.value, 'yyyy-MM-dd', 'en') < formatDate(new Date(), 'yyyy-MM-dd', 'en')) {
      toastr.error('Due Date Should be Greater than Current Date.');
      this.edittask.patchValue({
        due_date : "",
      })
      this.cStartDate = "";
    }
  }
  SelectLeads(event:any){
    $("#modal-Selectlead").modal("show");
    this.lead_type = event.target.value;
    this.edittask.patchValue({
      task_for : event.target.value,
      task_related_to : "",
      task_related_to_id : "",
    });
    this.service.apiPost('SelectLeads',{"uid":this.uId,"org_uid":this.orgId,"profile_id":this.cProfile,'lead_type':event.target.value})
    .subscribe(result  => {
      if(result){
        this.dataSource = new MatTableDataSource<LeadsElement>(result.leads);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }
  selectLead(event:any){
    this.service.apiPost('getselectleads',{"uid":this.uId,"org_uid":this.orgId,'lead_type':this.lead_type,'lead_id':event.target.id})
    .subscribe(result => {
      if(result){
        this.edittask.patchValue({
          task_related_to : result.data.title,
          task_related_to_id : result.data.id,
        });
        $("#modal-Selectlead").modal("hide");
      }
    })
  }
  onSubmit(data:any){
    data.uid=this.uId;
    data.task_id=this.editUid;
    data.org_uid=this.orgId;
    data.created_by=this.cProfile;
    data.modified_by=this.cProfile;
    if(data.profile_id==undefined || data.profile_id==""){
      data.profile_id=this.cProfile;
    }
    this.service.apiPost('TaskAddEdit',data).subscribe(
      response => {
        if(response.status=='success'){
          this.router.navigate(['crm/tasks']);
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
  announceSortChange(sortState:any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
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
    this.http.post<any>(this.url + '/crm/ImportAccounts', formData,this.service.getUploadMulitpleImages()).subscribe(
      response => {
        if(response.status=='success'){
          toastr.success(response.message);
          $("#modal-lg").modal("hide");
          this.importCSV.reset();
          this.router.navigate(['crm/account-list']);
        }else{
          toastr.error(response.message);
        }
      },error =>{
        toastr.error(error);
      }
    )
  }
}
export interface LeadsElement {
  id:string;
  title:string;
  first_name: string;
  company: string;
  email: string;
  name: string;
  phone: number;
}
