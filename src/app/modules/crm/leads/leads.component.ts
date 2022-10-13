import { Component, OnInit,ViewChild,ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl} from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
import { Location } from '@angular/common';
import { MatPaginator ,PageEvent } from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort, Sort} from '@angular/material/sort';
import { LiveAnnouncer} from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import {SelectionModel} from '@angular/cdk/collections';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import { LeadTransferComponent } from '../dialogBox/lead-transfer/lead-transfer.component';
declare var toastr:any;
declare var Swal:any;
declare var $:any;
export interface States {
  name: string;
}

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LeadsComponent {
  loading:any;
  public emaildisable=false;
  public editUid:any=null;
  public first_name:any;
  public last_name:any;
  public designation:any;
  public data:any;
  public avatar:any;
  public HeaderText:any = 'Create Account';
  stateHtml = "";
  leads = [] as  any;
  dataSource = [] as  any;
  selected_lead = [] as  any;
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
  FilterCallStatus = "";
  SearchLead = "";
  selection = '2';
  Ltype = "";
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  search = "";
  CustomFilter = [];
  checkboxStates = {} as any;
  allChecked = false;
  pipe:any;
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  url = CommonService.API_ENDPOINT;
  srcUrl = CommonService.SRC_API_ENDPOINT;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild(MatPaginator) paginator = [] as any;
  @ViewChild(MatSort) sort = [] as any;
  
  displayedColumns: string[] = ['checkbox','status','title','lead_status','first_name', 'company', 'email', 'phone','lead_source','name','campaign','created_at','id'];
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
  receiveUserInfo($event:any){
    this.designation = $event.data.role.name
  }
  myControl = new FormControl();
  states = [] as any;
  campaignList(){
    this.service.apiPost('getCampaignList',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile})
    .subscribe(result => {
      this.campaignlist = result.data;
    });
  }
  constructor(public dialog: MatDialog,private http:HttpClient,private _liveAnnouncer: LiveAnnouncer,private location :Location,private router:Router,private common : CommonService,private fb:FormBuilder,private service : AuthService,private route:ActivatedRoute) { 
    let uid = this.route.snapshot.paramMap.get('id');
    if(uid!==null){
      this.isEdit = true;
    }
    this.getleadsList();
    this.campaignList();
    this.pipe = new DatePipe('en-IL');
    const defaultPredicate=this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data:any, filter:any) =>{
      const formatted=this.pipe.transform(data.created_at,'MM/dd/yyyy');
      return formatted.indexOf(filter) >= 0 || defaultPredicate(data,filter) ;
    }
    
  }
  openDialog() {
    const dialogRef = this.dialog.open(LeadTransferComponent,{
      data: {
        animal: 'panda',
      },
    });

    dialogRef.afterClosed().subscribe(result => {});
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
    if(this.router.url=='/crm/lead/success'){
      this.filters.filters = [
        { eq: 9, key: 'status' },
      ]
    }
    this.service.postRequest('getLeadList',this.filters)
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
    this.assignLead = false;
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
  LeadAssign(event:any){
    Object.keys(this.checkboxStates).forEach(key => {
      if(this.checkboxStates[key] == true){
        this.selected_lead.push(key);
      }
    })
    this.selected_lead = [...new Set(this.selected_lead)];
    this.service.postRequest('assignLead',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile,'lead_ids':this.selected_lead,'assignee':event.value})
    .subscribe(response => {
      this.selected_lead = [];
      this.assignLead = false;
      this.allChecked = false;
      if(response.status=='success'){
        $("#modal-members").modal("hide");
        this.getleadsList();
        toastr.success(response.message);
      }else{
        toastr.error(response.message);
      }
    },error =>{
      toastr.error(error);
    })
  }
  leadTransfer(){
    this.filters.filters.push({ eq: '1', key: 'is_assign' })
    this.getleadsList();
    $("#modal-transfer").modal("show");
  }
  CampaignAssign(event:any){
    Object.keys(this.checkboxStates).forEach(key => {
      if(this.checkboxStates[key] == true){
        this.selected_lead.push(key);
      }
    })
    this.selected_lead = [...new Set(this.selected_lead)];
    this.service.postRequest('assignCampaign',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile,'lead_ids':this.selected_lead,'assignee':event.value})
    .subscribe(response => {
      this.selected_lead = [];
      this.assignLead = false;
      this.allChecked = false;
      if(response.status=='success'){
        $("#modal-campaign").modal("hide");
        this.getleadsList();
        toastr.success(response.message);
      }else{
        toastr.error(response.message);
      }
    },error =>{
      toastr.error(error);
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
  FilterLeadSubmit(){
    this.filters.filters.push({ eq: this.FilterLead, key: 'is_assign' })
  }
  FilteCampagnSubmit(){
    this.filters.filters.push({ eq: this.FilterCampaign, key: 'campaign' })
  }
  FilteCallSubmit(){
    this.filters.filters.push({ eq: this.FilterCallStatus, key: 'status' })
  }
  Unpublish(id:any){
    this.service.apiPost('unpublishLead',{'id':id}).subscribe(
      response => {
        if(response.status=='success'){
          toastr.success(response.message);
          this.getleadsList();
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
          this.CSVButton = true;
          toastr.success(response.message);
          $("#modal-lg").modal("hide");
          this.importCSV.reset();
          this.getleadsList();
        }else{
          if(typeof(response.message)=='object'){
            this.FileErrors="";
            response.message.map((err:any)=>{
              this.FileErrors += 
              `<div class="alert alert-warning alert-dismissible">
                <p class="leaderrors">${err}</p>
              </div>`
            });
          }else{
            toastr.error(response.message);
          } 
        }
      },error =>{
        toastr.error(error);
        this.CSVButton = true;
      }
    )
  }
}
export interface LeadsElement {
  checkbox: number;
  status: number;
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