import { Component, OnInit , ViewChild} from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { MatPaginator , PageEvent} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort, Sort} from '@angular/material/sort';
import { LiveAnnouncer} from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { Location , Time} from '@angular/common';
import {SelectionModel} from '@angular/cdk/collections';
declare var toastr:any;
declare var $:any;
declare var Swal:any;

@Component({
  selector: 'app-member-feedbacks',
  templateUrl: './member-feedbacks.component.html',
  styleUrls: ['./member-feedbacks.component.css']
})
export class MemberFeedbacksComponent {
  pipe:any;
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  Profileuid = this.route.snapshot.paramMap.get('id');
  Profileid = this.route.snapshot.paramMap.get('profile_id');
  ProfileorgId = this.route.snapshot.paramMap.get('orgId');
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  search = "";
  leads = [] as  any;
  TaskdataSource = [] as  any;
  LeaddataSource = [] as  any;
  MeetingDataSource = [] as  any;
  FeedbackdataSource = [] as  any;
  totalTask = 0;
  totalLead = 0;
  totalMeetings = 0;
  totalFeedback = 0;
  loading:any;
  public avatar:any;
  public HeaderText:any = 'Create Account';
  dataSource = [] as  any;
  userlists = [] as  any;
  campaignlist = [] as  any;
  shownocard :any;
  isEdit = false;
  routerLink='/crm/leads'; 
  selectedFile:any;
  selectedFileName=null;
  CSVButton=true; 
  editLead = true;
  AddLead = true;
  assignLead = false;
  DeleteLead = true;
  FileErrors = "";
  FilterLead = "";
  FilterCampaign = "";
  SearchLead = "";
  selection = '2';
  Ltype = "";
  CustomFilter = [];
  checkboxStates = {} as any;
  allChecked = false;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild(MatPaginator) paginator = [] as any;
  @ViewChild(MatSort) sort = [] as any;
  url = CommonService.API_ENDPOINT;
  srcUrl = CommonService.SRC_API_ENDPOINT;
  displayedColumns: string[] = ['checkbox','call_action','feedback_status','title','first_name', 'phone','date','time','id','company','created_at','note'];
  Selection = new SelectionModel<LeadsElement>(true, []);
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
  constructor(private http:HttpClient,private _liveAnnouncer: LiveAnnouncer,private location :Location,private router:Router,private common : CommonService,private fb:FormBuilder,private service : AuthService,private route:ActivatedRoute) { 
    let uid = this.route.snapshot.paramMap.get('id');
    if(uid!==null){
      this.isEdit = true;
    }
    this.getleadsList();
    this.pipe = new DatePipe('en-IL');
    const defaultPredicate=this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data:any, filter:any) =>{
      const formatted=this.pipe.transform(data.created_at,'MM/dd/yyyy');
      return formatted.indexOf(filter) >= 0 || defaultPredicate(data,filter) ;
    }
  }
  filters = {
    org_uid: this.orgId,
    profile_id: this.cProfile,
    uid: this.uId,
    search: this.SearchLead,
    filters: [] as any,
    pageSize: this.pageSize,
    pageNumber: this.currentPage,
  }  
  getleadsList(){
    this.loading = true;
    this.filters.search = this.SearchLead;
    this.service.postRequest('getFeedbackList',this.filters)
    .subscribe(result  => {
      if(result){
        this.loading = false;
        this.totalRows = result.total_rows;
        this.leads = result.data;
        this.dataSource = new MatTableDataSource<LeadsElement>(result.data);
        this.dataSource.data.forEach((item:any) => {
          this.checkboxStates[item.id] = false;
        });
        //this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if(this.leads.length>0){
          this.shownocard = false;
        }else{
          this.shownocard = true;
        }
      }
    })
  }
  masterToggle(e:any) {
    if(this.dataSource.data.length>0){
      if (e.checked) {
        Object.keys(this.checkboxStates).forEach(key => {
          this.checkboxStates[key] = true;
        })
        this.allChecked = true;
      } else {
        Object.keys(this.checkboxStates).forEach(key => {
          this.checkboxStates[key] = false;
        })
        this.allChecked = false;
      }
      if(Object.values(this.checkboxStates).includes(true)){
        this.assignLead = true;
      }else{
        this.assignLead = false;
      }
    }
  }
  pageChanged(event: PageEvent) {
    this.selection = '2';
    this.allChecked = false;
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.filters.pageNumber = event.pageIndex;
    this.filters.pageSize = event.pageSize;
    this.getleadsList();
    this.checkboxStates = {};
  }
  SelectLead(event:any,id:any){
    if(event.checked==true){
      this.checkboxStates[id] = true;
    }else{
      this.checkboxStates[id] = false;
    }
    if(Object.values(this.checkboxStates).includes(true)){
      this.assignLead = true;
    }else{
      this.assignLead = false;
    }
  } 
  getUserListdrop(){
    this.service.apiPost('getUserListdrop',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile})
    .subscribe(result => {
      this.userlists = result.data;
      $("#modal-campaign").modal("hide");
      $("#modal-members").modal("show");
    });
  }
  showCampaignList(){
    $("#modal-members").modal("hide");
    $("#modal-campaign").modal("show");
  }
  clearFilter(){
    this.range.patchValue({
      start : "",
      end : "",
    })
    this.SearchLead = "";
    this.FilterLead = "";
    this.FilterCampaign = "";
    this.filters.filters = [];
    this.filters.search = "";
    this.getleadsList();
  }
  applyfilter(){
    this.getleadsList();
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
  dateFil() {
    this.dataSource.filter = ''+Math.random();
  }
  getDateRange(value:any) {
    const fromDate = this.pipe.transform(value.start,'yyyy/MM/dd');
    const toDate = this.pipe.transform(value.end,'yyyy/MM/dd/');
    if(fromDate !== '' && toDate !== '') {
      this.filters.filters = [
        { gte: fromDate, key: 'created_at' },
        { lte: toDate, key: 'created_at' },
      ]
    }
  }
}

export interface LeadsElement {
  checkbox: number;
  title:string;
  first_name: string;
  date:Date,
  time:Time,
  company: string;
  created_at: Date;
  phone: number;
  description: number;
  note: number;
  call_action: string;
  feedback_status: string;
  id: number;
}