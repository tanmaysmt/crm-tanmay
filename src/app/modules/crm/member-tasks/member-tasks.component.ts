import { Component, OnInit , ViewChild} from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort, Sort} from '@angular/material/sort';
import { LiveAnnouncer} from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { Location } from '@angular/common';
declare var toastr:any;
declare var $:any;
declare var Swal:any;

@Component({
  selector: 'app-member-tasks',
  templateUrl: './member-tasks.component.html',
  styleUrls: ['./member-tasks.component.css']
})
export class MemberTasksComponent {

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
  public userId = localStorage.getItem('Id');
  public emaildisable=false;
  public editUid:any=null;
  public first_name:any;
  public last_name:any;
  public designation:any;
  public data:any;
  public avatar:any;
  SearchLead = "";
  FilterLead = "";
  FilterCampaign = "";
  dataSource = [] as  any;
  shownocard :any;
  isEdit = false;
  receiveMessage($event:any) {
    if($event){
      function Permission(value:any,account:any) {
        if(account=='leads'){
          return JSON.parse($event.permissions).leads.some(function(el:any) {
            return el.value === value;
          }); 
        }
      }
      if(Permission('view','tasks')==false){
        this.router.navigate(['/crm/dashboard']);
      }
      if(Permission('edit','tasks')==false){
        this.editAccount = false;
      }
      if(Permission('create','tasks')==false){
        this.AddAccount = false;
      }
      if(Permission('delete','tasks')==false){
        this.DeleteAccount = false;
      }
    }
  }
  
  receiveUserInfo($event:any){
    this.designation = $event.data.role.name
  }
  constructor(private http:HttpClient,private _liveAnnouncer: LiveAnnouncer,private location :Location,private router:Router,private common : CommonService,private fb:FormBuilder,private service : AuthService,private route:ActivatedRoute) { 
    this.getTasklist()
    this.pipe = new DatePipe('en-IL');
    const defaultPredicate=this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data:any, filter:any) =>{
      const formatted=this.pipe.transform(data.created_at,'MM/dd/yyyy');
      return formatted.indexOf(filter) >= 0 || defaultPredicate(data,filter) ;
    }
  }
  @ViewChild(MatPaginator) paginator = [] as any;
  @ViewChild(MatSort) sort = [] as any;
  loading = true;
  selectedFile:any;
  selectedFileName=null;
  CSVButton=true; 
  editAccount = true;
  AddAccount = true;
  DeleteAccount = true;
  filters = {
    org_uid: this.ProfileorgId,
    profile_id: this.Profileid,
    uid: this.Profileuid,
    search: this.SearchLead,
    filters: [] as any,
    pageSize: this.pageSize,
    pageNumber: this.currentPage,
  }  
  displayedColumns: string[] = ['title','task_for', 'what_id', 'status', 'priority','name','created_at','id'];
  getTasklist() {
    this.loading = true;
    this.service.postRequest('postTaskList',this.filters)
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
    this.getTasklist();
  }
  applyfilter(){
    this.getTasklist();
  }
  FilterTaskStatus(){
    this.filters.filters.push({ eq: this.FilterLead, key: 'status' })
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
      this.filters.filters = [
        { gte: fromDate, key: 'created_at' },
        { lte: toDate, key: 'created_at' },
      ]
    }
    this.getTasklist();
  }
  Unpublish(id:any){
    this.service.apiPost('unpublishAccount',{'id':id}).subscribe(
      response => {
        if(response.status=='success'){
          toastr.success(response.message);
          this.getTasklist();
        }else{
          toastr.error(response.message);
        }
      },error =>{
        toastr.error(error);
      }
    )
  }
  ConfirmAlert = function (this:any,lead_id:any){
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success m-2',
            cancelButton: 'btn btn-danger m-2'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result:any) => {
        if (result.value == true) {
            swalWithBootstrapButtons.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )    
            this.Unpublish(lead_id)
        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire(
                'Cancelled',
                'Your imaginary file is safe :)',
                'error'
            )
        }
    })
  }
}
export interface LeadsElement {
  title:string;
  task_for: string;
  what_id: string;
  status: string;
  priority: string;
  name: string;
  created_at: Date;
  id: number;
}