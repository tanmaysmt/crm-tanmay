import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { Location } from '@angular/common';
import { FormBuilder, FormControl,FormGroup, Validators} from '@angular/forms';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort, Sort} from '@angular/material/sort';
import { LiveAnnouncer} from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
declare var toastr:any;
declare var Swal:any;
declare var $:any;
@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent {

  url = CommonService.API_ENDPOINT;
  srcUrl = CommonService.SRC_API_ENDPOINT;

  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  userlists:any;
  leads = [] as  any;
  dataSource = [] as  any;
  shownocard :any;
  isEdit = false;
  pipe:any;
  @ViewChild(MatPaginator) paginator = [] as any;
  @ViewChild(MatSort) sort = [] as any;
  loading = true;
  selectedFile:any;
  selectedFileName=null;
  CSVButton=true; 
  editAccount = true;
  AddAccount = true;
  DeleteAccount = true;
  displayedColumns: string[] = ['title', 'from', 'to', 'related_to','id'];
  receiveMessage($event:any) {
    if($event){
      function Permission(value:any,account:any) {
        if(account=='meetings'){
          return JSON.parse($event.permissions).meetings.some(function(el:any) {
            return el.value === value;
          }); 
        }
      }
      if(Permission('view','meetings')==false){
        this.router.navigate(['/crm/dashboard']);
      }
      if(Permission('edit','meetings')==false){
        //this.editLead = false;
      }
      if(Permission('create','meetings')==false){
        //this.AddLead = false;
      }
      if(Permission('delete','meetings')==false){
        //this.DeleteLead = false;
      }
    }
  }
  constructor(private http:HttpClient,private _liveAnnouncer: LiveAnnouncer,private location :Location,private router:Router,private common : CommonService,private fb:FormBuilder,private service : AuthService,private route:ActivatedRoute) { 
    this.pipe = new DatePipe('en-IL');
    const defaultPredicate=this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data:any, filter:any) =>{
      const formatted=this.pipe.transform(data.created_at,'MM/dd/yyyy');
      return formatted.indexOf(filter) >= 0 || defaultPredicate(data,filter) ;
    }
    this.getMeetingList();
  }
  getMeetingList() {
    this.loading = true;
    this.service.apiPost('getmeetingList',{"uid":this.uId,"org_uid":this.orgId,"profile_id":this.cProfile})
    .subscribe(result  => {
      if(result){
        this.loading = false;
        this.leads = result.data;
        this.dataSource = new MatTableDataSource<LeadsElement>(result.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if(this.leads.length>0){
          this.shownocard = false;
        }else{
          this.shownocard = true;
        }
      }
    })
  }
  range=this.fb.group({
    start: [''],
    end: ['']
  });
  announceSortChange(sortState:any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  applyFilter(filterValue:any) {
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
  }
  dateFil() {
    this.dataSource.filter = ''+Math.random();
  }
  getDateRange(value:any) {
    const fromDate = this.pipe.transform(value.start,'yyyy/MM/dd');
    const toDate = this.pipe.transform(value.end,'yyyy/MM/dd/');
    if(fromDate !== '' && toDate !== '') {
      this.loading = true;
      this.service.apiPost('getmeetingList',{"uid":this.uId,"org_uid":this.orgId,"profile_id":this.cProfile,"start":fromDate,"end":toDate})
      .subscribe(result  => {
        if(result){
          this.loading = false;
          this.leads = result.data;
          this.dataSource = new MatTableDataSource<LeadsElement>(result.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if(this.leads.length>0){
            this.shownocard = false;
          }else{
            this.shownocard = true;
          }
        }
      })
    }
  }
}
export interface LeadsElement {
  title : string,
  from : string,
  to : string,
  related_to : string,
  id : number,
}