import { Component, OnInit , ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
import { ChartConfiguration, ChartData, ChartEvent, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective  } from 'ng2-charts';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
@Injectable()
export class DashboardComponent{
  alertBox = "";
  daysLeft:any;
  parentData:any;
  parentMessage:any
  StaffUser = true;
  ShowLead = true;
  ShowAccount = true;
  ShowContact = true;
  ShowOpportunity = true; 
  ShowDeals = true;
  permissions:any
  message:any;
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  user:any;
  acTypes:any;
  orgazs:any;
  roles:any;
  leads = [] as  any;
  total_leads = 0;
  assign_leads = 0;
  not_assign_leads = 0;
  account= [] as  any;
  total_account = 0;
  contact= [] as  any;
  total_contact=0;
  opportunity= [] as  any;
  total_opportunity=0;
  accountP=[] as  any;
  loading = true;
  oppo=false;
  lea=false;
  leadsCalled = [] as any;
  leadsPending = [] as any;
  LeadsLabels = [] as any;
  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [ [ 'Leads Called'], [ 'Leads Pending' ]],
    datasets: [ {
      data: [ this.assign_leads, this.not_assign_leads]
    } ]
  };
  public barChartLabels: string[] = this.LeadsLabels;
  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      { data: this.leadsCalled, label: 'Leads Called' },
      { data: this.leadsPending, label: 'Leads Pending' }
    ]
  };
  receiveMessage($event:any) {
    if($event){
      function Permission(value:any,account:any) {
        if(account=='account'){
          return JSON.parse($event.permissions).account.some(function(el:any) {
            return el.value === value;
          }); 
        }else if(account=='leads'){
          return JSON.parse($event.permissions).leads.some(function(el:any) {
            return el.value === value;
          });
        }else if(account=='contacts'){
          return JSON.parse($event.permissions).contacts.some(function(el:any) {
            return el.value === value;
          });
        }else if(account=='account'){
          return JSON.parse($event.permissions).account.some(function(el:any) {
            return el.value === value;
          });
        }else if(account=='deals'){
          return JSON.parse($event.permissions).deals.some(function(el:any) {
            return el.value === value;
          });
        }else if(account=='tasks'){
          return JSON.parse($event.permissions).tasks.some(function(el:any) {
            return el.value === value;
          });
        }else if(account=='meetings'){
          return JSON.parse($event.permissions).meetings.some(function(el:any) {
            return el.value === value;
          });
        }else if(account=='calls'){
          return JSON.parse($event.permissions).calls.some(function(el:any) {
            return el.value === value;
          });
        }else if(account=='reports'){
          return JSON.parse($event.permissions).reports.some(function(el:any) {
            return el.value === value;
          });
        }else if(account=='campaigns'){
          return JSON.parse($event.permissions).campaigns.some(function(el:any) {
            return el.value === value;
          });
        }else if(account=='users'){
          if(JSON.parse($event.permissions).users !==undefined){
            return JSON.parse($event.permissions).users.some(function(el:any) {
              return el.value === value;
            });
          }else{
            return false;
          }
        }else if(account=='opportunity'){
          if(JSON.parse($event.permissions).opportunity !==undefined){
            return JSON.parse($event.permissions).opportunity.some(function(el:any) {
              return el.value === value;
            });
          }else{
            return false;
          }
        }
      }
      if(Permission('view','users')==false){
        this.StaffUser = false;
      }
      if(Permission('view','leads')==false){
        this.ShowLead = false;
      }
      if(Permission('view','account')==false){
        this.ShowAccount = false;
      }
      if(Permission('view','contacts')==false){
        this.ShowContact = false;
      }
      if(Permission('view','opportunity')==false){
        this.ShowOpportunity = false;
      }
      if(Permission('view','deals')==false){
        this.ShowDeals = false;
      }
    }
  }
  receiveUserInfo($event:any){
    
  }
  constructor(public common:CommonService,private service:AuthService) { 
    if(localStorage.getItem('acceptInvitation')!=null){
      localStorage.removeItem('acceptInvitation');
      location.reload();
    }
    this.getUserDashboard();
    this.checkPackageStatus();
  }
  getUserDashboard(){
    this.service.apiGet('getUserDashboard?uid='+this.uId+"&org_uid="+this.orgId+"&profile_id="+this.cProfile)
    .subscribe((result:any) => {
      if(result){
        if(this.ShowLead){
        this.leads = result.data.leads; this.total_leads = result.data.total_leads; this.not_assign_leads = result.data.not_assign_leads;this.assign_leads=result.data.assign_leads }
        if(this.ShowAccount){ this.account = result.data.accounts; this.total_account = result.data.total_accounts;}
        if(this.ShowContact){ this.contact = result.data.contacts; this.total_contact = result.data.total_contacts;}
        if(this.ShowOpportunity){ this.opportunity = result.data.opportunities; this.total_opportunity = result.data.total_opportunities; }
        this.loading = false;
        this.leadsCalled = result.data.leadsCalled.map((x:any) => x.cnt);
        this.leadsPending = result.data.leadsPending.map((x:any) => x.cnt);
        if(this.leadsCalled.length > this.leadsPending.length){
          this.LeadsLabels = result.data.leadsCalled.map((created_at:any) => created_at.created);
        }else{
          this.LeadsLabels = result.data.leadsPending.map((created_at:any) => created_at.created);
        }
        let leadscalled = this.leadsCalled.reduce(function (accumVariable:any, curValue:any) {
          return accumVariable + curValue
        }, 0);
        let leadspending = this.leadsPending.reduce(function (accumVariable:any, curValue:any) {
          return accumVariable + curValue
        }, 0);
        this.pieChartData = {
          labels: [ [ 'Leads Called'], [ 'Leads Pending' ]],
          datasets: [ {
            data: [ leadscalled, leadspending ] 
          } ]
        };
        this.barChartData = {
          labels: this.LeadsLabels,
            datasets: [
              { data: this.leadsCalled, label: 'Leads Called' },
              { data: this.leadsPending, label: 'Leads Pending' }
            ]
        }
        
      }
    })
  }
  checkPackageStatus(){
    this.service.apiPost('PackageInformation',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile})
    .subscribe(result => {
      if(result.status=='success'){
        let date = new Date(result.data.created_at);
        let currentDate = new Date();
        let days = Math.floor((currentDate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24);
        this.daysLeft = result.data.validity-days;
        if(this.daysLeft<10){
          this.alertBox =  
          `<div class="alert alert-warning" role="alert">
             Your Package will be Expired After ${this.daysLeft} days
          </div>`;
        }
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

  public randomize(): void {
    this.barChartType = this.barChartType === 'bar' ? 'line' : 'bar';
  }
}
