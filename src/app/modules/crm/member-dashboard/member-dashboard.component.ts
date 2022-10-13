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
import { ChartConfiguration, ChartData, ChartEvent, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective  } from 'ng2-charts';
declare var toastr:any;
declare var $:any;
export interface TaskElement {
  title:string;
  task_for: string;
  what_id: string;
  status: string;
  priority: string;
  name: string;
  created_at: Date;
  id: number;
}
export interface LeadsElement {
  checkbox: number;
  title:string;
  first_name: string;
  company: string;
  email: string;
  lead_source: string;
  lead_status: string;
  name: string;
  campaign: string;
  created_at: Date;
  phone: number;
  id: number;
}

@Component({
  selector: 'app-member-dashboard',
  templateUrl: './member-dashboard.component.html',
  styleUrls: ['./member-dashboard.component.css']
})

export class MemberDashboardComponent {
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
  leadsCalled =  [] as any;
  assign_leads = 0;
  not_assign_leads = 0;
  LeadsLabels = 0;
  leadsPending = [] as any;
  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [ [ 'Leads Called'], [ 'Leads Pending' ]],
    datasets: [ {
      data: [ this.assign_leads, this.not_assign_leads]
    } ]
  };
  @ViewChild(MatPaginator) paginator = [] as any;
  @ViewChild(MatSort) sort = [] as any;
  filters = {
    org_uid: this.orgId,
    profile_id: this.Profileid,
    uid: this.Profileuid,
    search: "",
    filters: [] as any,
    pageSize: this.pageSize,
    pageNumber: this.currentPage,
  }  
  constructor(private http:HttpClient,private _liveAnnouncer: LiveAnnouncer,private router:Router,private common : CommonService,private fb:FormBuilder,private service : AuthService,private route:ActivatedRoute) {
    this.getTasklist();
    this. getleadsList();
    this. getMeetingList();
    this. getFeedbackList();
    this. getUserDashboard();
  }
  TaskdisplayedColumns: string[] = ['title','task_for', 'what_id', 'status', 'priority','name','created_at'];
  LeaddisplayedColumns: string[] = ['checkbox','title','lead_status','first_name', 'company', 'email', 'phone','lead_source','name','campaign','created_at','id'];
  getTasklist() {
    //this.loading = true;
    this.service.postRequest('postTaskList',this.filters)
    .subscribe(result  => {
      if(result){
        //this.loading = false;
        //console.log('Tasklist',result.data);
        //this.leads = result.data;
        this.totalTask = result.data.length
        this.TaskdataSource = result.data;
        //this.TaskdataSource.paginator = this.paginator;
        //this.TaskdataSource.sort = this.sort;
        if(this.leads.length>0){
          //this.shownocard = false;
        }else{
          //this.shownocard = true;
        }
      }
    })
  }
  getleadsList(){
    //this.loading = true;
    //this.filters.search = this.SearchLead;
    this.service.postRequest('getLeadList',this.filters)
    .subscribe(result  => {
      if(result){
        //this.loading = false;
        this.totalLead = result.total_rows;
        this.LeaddataSource = result.data;
        //this.dataSource.paginator = this.paginator;
        //this.LeaddataSource.sort = this.sort;
        if(this.leads.length>0){
          //this.LeaddataSource = false;
        }else{
          //this.LeaddataSource = true;
        }
      }
    })
  }
  getMeetingList() {
    //this.loading = true;
    this.service.apiPost('getmeetingList',{"uid":this.uId,"org_uid":this.orgId,"profile_id":this.cProfile})
    .subscribe(result  => {
      if(result){
        //this.loading = false;
        this.totalMeetings = result.data.length;
        this.MeetingDataSource = result.data;
        if(this.leads.length>0){
          //this.shownocard = false;
        }else{
          //this.shownocard = true;
        }
      }
    })
  }
  getFeedbackList(){
    //this.loading = true;
    //this.filters.search = this.SearchLead;
    this.service.postRequest('getFeedbackList',this.filters)
    .subscribe(result  => {
      if(result){
        //this.loading = false;
        this.totalFeedback = result.total_rows;
        this.FeedbackdataSource = result.data;
        //this.dataSource.paginator = this.paginator;
        //this.FeedbackdataSource.sort = this.sort;
        if(this.leads.length>0){
          //this.shownocard = false;
        }else{
          //this.shownocard = true;
        }
      }
    })
  }
  
  getUserDashboard(){
    this.service.apiGet('getUserDashboard?uid='+this.Profileuid+"&org_uid="+this.orgId+"&profile_id="+this.Profileid)
    .subscribe((result:any) => {
      if(result){
        this.leadsCalled = result.data.leadsCalled.map((x:any) => x.cnt);
        this.leadsPending = result.data.leadsPending.map((x:any) => x.cnt);
        if(this.leadsCalled.length > this.leadsPending.length){
          this.LeadsLabels = result.data.leadsCalled.map((created_at:any) => created_at.created);
        }else{
          this.LeadsLabels = result.data.leadsPending.map((created_at:any) => created_at.created);
        }
        this.pieChartData = {
          labels: [ [ 'Leads Called'], [ 'Leads Pending' ]],
          datasets: [ {
            data: [ this.leadsCalled, this.leadsPending]
          } ]
        };
      }
    })
  }
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    }
  };
  
  pieChartType: ChartType = 'pie';
  public barChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.4
      }
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10
      }
    },
    plugins: {
      legend: { display: true },
    }
  };
  

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    //console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    //console.log(event, active);
  }
}
