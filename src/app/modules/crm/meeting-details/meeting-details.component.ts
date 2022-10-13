import { Component, OnInit , ViewChild} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { FormBuilder, FormControl,FormGroup, Validators} from '@angular/forms';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
import { Location } from '@angular/common';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort, Sort} from '@angular/material/sort';
import { LiveAnnouncer} from '@angular/cdk/a11y';
declare var toastr:any;
declare var $:any;
@Component({
  selector: 'app-meeting-details',
  templateUrl: './meeting-details.component.html',
  styleUrls: ['./meeting-details.component.css']
})
export class MeetingDetailsComponent {
  @ViewChild(MatPaginator) paginator = [] as any;
  @ViewChild(MatSort) sort = [] as any;
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  meeting_id = this.route.snapshot.paramMap.get('id');
  meeting = [] as any; 
  participants = [] as any; 
  dataSource = [] as any; 
  user = [] as any; 
  lead_type:any;
  participantDocument = "";
  name = "";
  selected_data = [] as any;
  tobedata:any
  this = this;
  loading = true;
  displayedColumns: string[] = ['id','name'];
  constructor(private _liveAnnouncer: LiveAnnouncer,private location :Location,private router:Router,private common : CommonService,private service : AuthService,private route:ActivatedRoute,private fb:FormBuilder) { 
    this.getMeetingDetail();
    this.meetingParticipants();
  }
  openDialogBox(){
    this.selected_data = [];
    $('input:checkbox').removeAttr('checked');
  }
  getMeetingDetail(){
    this.service.apiPost('getMeetingDetails',{"uid":this.uId,"org_uid":this.orgId,'meeting_id':this.meeting_id})
    .subscribe(result => {
      if(result){
        this.loading = false;
        this.meeting = result.meeting;
        this.user = result.meeting.profile.user;
      }
    })
  }
  meetingParticipants(){
    this.service.apiPost('meetingParticipants',{"profile_id":this.cProfile,"uid":this.uId,"org_uid":this.orgId,'meeting_id':this.meeting_id})
    .subscribe(result => {
      if(result){
        this.participants = result.data;
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
  SelectParticipants(event:any){
    this.lead_type = event.target.value;
    this.service.apiPost('selectParticipants',{"uid":this.uId,"org_uid":this.orgId,"profile_id":this.cProfile,'lead_type':event.target.value})
    .subscribe(result  => {
      if(result){
        this.dataSource = new MatTableDataSource<LeadsElement>(result.leads);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }
  selectLead(event:any){
    this.selected_data.push([event.target.id,this.lead_type]);
  }
  addParticipants(){
    if(this.selected_data.length>0){
      this.service.apiPost('addParticipants',{"profile_id":this.cProfile,"uid":this.uId,'org_uid':this.orgId,"created_by":this.cProfile,"modified_by":this.cProfile,"participants":this.selected_data,"meeting_id":this.meeting_id}).subscribe(
        response => {
          if(response.status=='success'){
            $("#addParticipants").modal("hide");
            this.meetingParticipants();
            toastr.success(response.message);
          }else{
            toastr.error(response.message);
          }
        },error =>{
          toastr.error(error);
        }
      )
    }else{
      toastr.warning("Please Select Another Participants");
    }
  }
  removeParticipants(id:any){
    this.service.apiPost('removeParticipants',{"profile_id":this.cProfile,"uid":this.uId,'org_uid':this.orgId,"created_by":this.cProfile,"modified_by":this.cProfile,"participants_id":id}).subscribe(
      response => {
        if(response.status=='success'){
          this.meetingParticipants();
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
  name: string;
}