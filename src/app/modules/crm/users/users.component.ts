import { Component, OnInit,ViewChild } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';
import { FormBuilder, FormControl,FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { Location } from '@angular/common';
import { MatPaginator , PageEvent} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y'; 
import { DatePipe } from '@angular/common';

declare var toastr:any;
declare var $:any;
declare var Swal:any;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent{

  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  pipe:any;
  first_name:any;
  profiles:any;
  roles:any;
  rolelist:any;
  rolename:any;
  role:any;
  user:any;
  acTypes:any;
  orgazs:any;
  orgaz:any;
  html:any
  shownocard:any;
  dataSource = [] as  any;
  leads = [] as  any;
  SearchLead = "";
  selection = '2';
  Ltype = "";
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  search = "";
  FilterRole = "";
  private timeoutTracker:any;
  SendButton=false;
  ProfileSendButton=false;
  RoleSendButton=false;
  userlists:any;
  removeSubordinate = true;
  constructor(private _liveAnnouncer: LiveAnnouncer, private location :Location,private router:Router,private common : CommonService,private fb:FormBuilder,private service : AuthService,private route:ActivatedRoute) { 
    this.pipe = new DatePipe('en-IL');
    this.getUserList();
    this.getUserinfo();
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
  @ViewChild(MatPaginator) paginator = [] as any;
  @ViewChild(MatSort) sort = [] as any;
  loading = true;
  url = CommonService.API_ENDPOINT;
  srcUrl = CommonService.SRC_API_ENDPOINT;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  Permission(value:any,account:any){}
  displayedColumns: string[] = ['name','phone', 'email','status','created_at','id'];
  getUserList() {
    this.loading = true;
    this.service.postRequest('getUserList',this.filters)
    .subscribe(result  => {
      if(result){
        this.loading = false;
        this.dataSource = new MatTableDataSource<LeadsElement>(result.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if(result.data.length>0){
          this.shownocard = false;
        }else{
          this.shownocard = true;
        }
      }
    })
  }
  getUserinfo(){
    this.service.apiPost('getUserInfo',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile})
    .subscribe(result => {
      if(result){
        this.acTypes = result.data.acTypes;
        this.orgazs = result.data.orgazs;
        this.orgaz = result.data.orgaz.name;
        this.roles = result.data.roletree;
        this.role = result.data.role;
        this.rolelist = result.data.rolelist;
      }
    })
  }
  openRoleModel(role:any,type:any){
    this.removeSubordinate = true;
    this.AddRoles.reset()
    $("#modal-default2").modal("show");
    if(type=='add'){
      this.AddRoles.patchValue({
        Subrole : role.id,
        role_description : role.description,
      })
    }else if(type=='edit'){
      if(role.parent_id=='0'){
        this.removeSubordinate = false;
      }
      this.AddRoles.patchValue({
        id : role.id,
        role_name : role.name,
        Subrole : role.parent_id,
        role_description : role.description,
      })
    }
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
  }
  FilterRoleSubmit(){
    this.filters.filters.push({ eq: this.FilterRole, key: 'designation' })
  }
  FilteCampagnSubmit(){
    //this.filters.filters.push({ eq: this.FilterCampaign, key: 'campaign' })
  }
  FilteCallSubmit(){
    //this.filters.filters.push({ eq: this.FilterCallStatus, key: 'status' })
  }
  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.filters.pageNumber = event.pageIndex;
    this.filters.pageSize = event.pageSize;
    this.getUserList();
  }
  clearFilter(){
    this.range.patchValue({
      start : "",
      end : "",
    })
    this.FilterRole = "";
    this.filters.filters = [];
    this.filters.search = "";
    this.getUserList();
  }
  applyfilter(){
    this.getUserList();
  }
  changeStatus(data:any,event:any){
    this.service.apiPost('UpdateProfileStatus',{"UpdateProfile":data,"value":event.target.value,"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile})
    .subscribe(response => {
      if(response.status=='success'){
        toastr.success(response.message);
        this.getUserList();
      }else{
        this.getUserList();
        toastr.error(response.message);
      }
    },error =>{
      toastr.error(error);
    })
  }
  receiveMessage($event:any) {
    if($event){
      function Permission(value:any,account:any) {
        if(account=='users'){
          if(JSON.parse($event.permissions).users !==undefined){
            return JSON.parse($event.permissions).users.some(function(el:any) {
              return el.value === value;
            });
          }else{
            return false;
          }
        }
      }
      if(Permission('view','users')==false){
        this.router.navigate(['/crm/dashboard']);
      }
    }
  }
  receiveUserInfo($event:any){
    if($event){
      //this.user = $event.data.user;
      //this.first_name = $event.data.user.name;
      //this.acTypes = $event.data.acTypes;
      //this.orgazs = $event.data.orgazs;
      //this.orgaz = $event.data.orgaz.name;
      //this.roles = $event.data.roletree;
      //this.role = $event.data.role;
      //this.rolelist = $event.data.rolelist;
    }
  }
  AddUserAccount=this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    role : ['',Validators.required],
    account_type : ['',Validators.required]
  })
  AddProfile=this.fb.group({
    profile_name : ['',Validators.required],
    profile_description : ['',Validators.required],
  })
  AddRoles=this.fb.group({
    id : ['',Validators.required],
    role_name : ['',Validators.required],
    Subrole : ['',Validators.required],
    role_description : ['',Validators.required],
  })
  onSubmit(data:any){
    this.SendButton=true;
    data.uid=this.uId;
    data.org_uid=this.orgId;
    data.profile_id=this.cProfile;
    this.service.apiPost('InviteUser',data).subscribe(
      response => {
        if(response.status=='success'){ 
          toastr.success(response.message);
          $("#modal-default").modal("hide");
          this.SendButton=false;
          this.AddUserAccount.reset();
            this.getUserList();
        }else{
          this.SendButton=false;
          toastr.error(response.message);
        }
      },error =>{
        toastr.error(error);
        this.SendButton=false;
      }
    )
  }
  onRoleSubmit(data:any){
    this.RoleSendButton = true;
    data.uid=this.uId;
    data.org_uid=this.orgId;
    this.service.apiPost('addRoles',data)
    .subscribe(result => {
      if(result.status=='success'){
        this.getUserinfo();
        toastr.success(result.message);
        $("#modal-default2").modal("hide");
        this.RoleSendButton = false;
        this.AddRoles.reset();
      }else{
        this.RoleSendButton = false;
        toastr.error(result.message);
      }
    },error =>{
      this.RoleSendButton = false;
      toastr.error(error);
    })
  }
  onProfileSubmit(data:any){
    this.ProfileSendButton = true;
    data.uid=this.uId;
    data.org_uid=this.orgId;
    this.service.apiPost('addProfile',data)
    .subscribe(result => {
      if(result.status=='success'){
        this.getUserinfo();
        toastr.success(result.message);
        $("#modal-default1").modal("hide");
        this.ProfileSendButton = false;
        this.AddProfile.reset();
      }else{
        this.ProfileSendButton = false;
        toastr.error(result.message);
      }
    },error =>{
      this.ProfileSendButton = false;
      toastr.error(error);
    })
  }
  Unpublish(uid:any,profile_id:any){
    this.loading = true;
    this.service.apiPost('unpublish',{"uid":uid,'profile_id':profile_id})
    .subscribe(response => {
      if(response.status=='success'){
        this.loading = false;
        toastr.success(response.message);
        this.getUserList();
      }else{
        toastr.error(response.message);
      }
    },error =>{
      toastr.error(error);
    })
  }
  ConfirmAlert = function (this:any,user_id:any,profile_id:any){
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
            this.Unpublish(user_id,profile_id)
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
  name: string;
  phone: number;
  email: string;
  status: string;
  created_at: Date;
  id: number;
}