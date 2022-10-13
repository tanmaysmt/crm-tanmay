import { Component, OnInit, ViewChild } from '@angular/core';
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
declare var toastr:any;
declare var $:any;
@Component({
  selector: 'app-edit-meeting',
  templateUrl: './edit-meeting.component.html',
  styleUrls: ['./edit-meeting.component.css']
})
export class EditMeetingComponent {
  @ViewChild(MatPaginator) paginator = [] as any;
  @ViewChild(MatSort) sort = [] as any;
  pipe:any;
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  isAccess=true;
  loading=true;
  editUid:any;
  lead_type:any
  dataSource = [] as any;
  userlists = [] as any;
  receiveMessage($event:any) {
    if($event){
      function Permission(value:any,account:any) {
        if(account=='meetings'){
          return JSON.parse($event.permissions).meetings.some(function(el:any) {
            return el.value === value;
          }); 
        }
      }
      if(this.route.snapshot.paramMap.get('id')!=='add'){
        if(Permission('edit','meetings')==false){
          this.isAccess=false;
          //this.router.navigate(['/crm/dashboard'])
        }
      }else if(Permission('create','meetings')==false){
        this.isAccess=false;
        //this.router.navigate(['/crm/dashboard'])
      }
      if(this.route.snapshot.paramMap.get('id')!=='add'){
        this.editUid = this.route.snapshot.paramMap.get('id');
      }
    }
  }
  constructor(private _liveAnnouncer: LiveAnnouncer,private http:HttpClient,private router:Router,private common : CommonService,private fb:FormBuilder,private service : AuthService,private route:ActivatedRoute) { 
    this.pipe = new DatePipe('en-IL');
    this.getUserList();
    if(this.route.snapshot.paramMap.get('id')!=='add'){
      this.editUid = this.route.snapshot.paramMap.get('id');
      this.getMeeting();
    }else{
      this.editUid = "";
      this.editMeeting.reset();
    }
  }
  getMeeting(){
    this.service.apiPost('getMeeting',{"uid":this.uId,"org_uid":this.orgId,'meeting_id':this.editUid})
    .subscribe(result => {
      if(result){
        this.loading = false;
        this.editMeeting.patchValue({
          profile_id : result.meeting.profile_id,
          title : result.meeting.title,
          location : result.meeting.location,
          from : this.pipe.transform(result.meeting.from,'yyyy-MM-ddTHH:mm'),
          to : this.pipe.transform(result.meeting.to,'yyyy-MM-ddTHH:mm'),
          meeting_for : result.meeting.meeting_for,
          related_to : result.meeting.related_to,
          related_to_id : result.meeting.related_to_id,
          link : result.meeting.link,
          description : result.meeting.description,
        })
      }
    })
  }
  displayedColumns: string[] = ['id','title','first_name','email', 'phone','name'];
  getUserList(){
    this.service.apiPost('getUserListdrop',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile})
    .subscribe(result => {
      this.loading = false;
      this.userlists = result.data;
    });
  }
  SelectLeads(event:any){
    $("#modal-Selectlead").modal("show");
    this.lead_type = event.target.value;
    this.editMeeting.patchValue({
      related_to : "",
      related_to_id : "",
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
        this.editMeeting.patchValue({
          related_to : result.data.title,
          related_to_id : result.data.id,
        });
        $("#modal-Selectlead").modal("hide");
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
  editMeeting=this.fb.group({
    profile_id : [''],
    title : ['',Validators.required],
    location : ['',Validators.required],
    from : ['',Validators.required],
    to : ['',Validators.required],
    meeting_for : ['',Validators.required],
    related_to : ['',Validators.required],
    related_to_id : ['',Validators.required],
    link : [''],
    description : [''],
  })
  onSubmit(data:any){
    data.uid=this.uId;
    data.meeting_id=this.editUid;
    data.org_uid=this.orgId;
    data.created_by=this.cProfile;
    data.modified_by=this.cProfile;
    if(data.profile_id==undefined || data.profile_id==""){
      data.profile_id=this.cProfile;
    }
    this.service.apiPost('addEditMeeting',data).subscribe(
      response => {
        if(response.status=='success'){
          this.router.navigate(['crm/meetings']);
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
export interface LeadsElement {
  id:string;
  title:string;
  first_name: string;
  company: string;
  email: string;
  name: string;
  phone: number;
}