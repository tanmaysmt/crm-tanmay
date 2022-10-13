import { Component, OnInit,Injectable,Inject} from '@angular/core';
import { FormBuilder, FormControl,FormGroup, Validators} from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
declare var toastr:any;
declare var $:any;

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit {
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  cProfile:any = localStorage.getItem('cProfile');
  dynamicCss = [
    "assets/plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css"
  ];
  dynamicScripts = [
    "assets/plugins/select2/js/select2.full.min.js",
    "assets/js/create_account.js",
  ];
  loading:any;
  AddProfile:any;
  first_name:any;
  AddRoles:any;
  profiles:any;
  roles:any;
  user:any;
  acTypes:any;
  orgazs:any;
  rolelist:any;
  rolename:any;
  role=[]as any;
  orgaz:any;
  permissions=[] as  any;
  ispermitted:any;
  public userId = localStorage.getItem('Id');
  public session_uid = localStorage.getItem('uId');
  selectedItems = [] as  any;
  leads = [] as  any;
  users = [] as  any;
  contacts = [] as  any;
  opportunity = [] as  any;
  account = [] as  any;
  deals = [] as  any;
  tasks = [] as  any;
  meetings = [] as  any;
  calls = [] as  any;
  reports = [] as  any;
  campaigns = [] as  any;
  account_id = this.route.snapshot.paramMap.get('id');
  constructor(private fb:FormBuilder,private service :AuthService,private router:Router,private common:CommonService,private route :ActivatedRoute) {
    this.common.loadCss(this.dynamicCss);
    this.common.loadScripts(this.dynamicScripts);
    
  }
  dropdownSettings = {};
  
  ngOnInit(): void {
    this.loading=true;
    this.permissions = [
      { value: 'view', item_text: 'View' },
      { value: 'create', item_text: 'Create' },
      { value: 'edit', item_text: 'Edit' },
      { value: 'delete', item_text: 'Delete' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'value',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
    };
    this.service.apiPost('getUserInfo',{"uid":this.session_uid,"org_uid":this.orgId,'acId':this.account_id,'profile_id':this.cProfile})
    .subscribe(result => {
      if(result){
        this.loading=false;
        if(result.data.acType!=null){
          this.ispermitted = JSON.parse(result.data.acType.permissions);
        }else{
          this.ispermitted = [];
        }
        this.leads = this.ispermitted.leads;
        this.contacts = this.ispermitted.contacts;
        this.opportunity = this.ispermitted.opportunity;
        this.account =  this.ispermitted.account;
        this.deals =  this.ispermitted.deals;
        this.tasks =  this.ispermitted.tasks;
        this.meetings =  this.ispermitted.meetings;
        this.calls =  this.ispermitted.calls;
        this.reports =  this.ispermitted.reports;
        this.campaigns =  this.ispermitted.campaigns;
        this.users = this.ispermitted.users;
        this.user = result.data.user;
        this.first_name = result.data.user.name;
        this.acTypes = result.data.acTypes;
        this.orgazs = result.data.orgazs;
        this.orgaz = result.data.orgaz.name;
        this.roles = result.data.roletree;
        this.role = result.data.role;
        if(this.role.name!=='CEO'){
          this.router.navigate(['/crm/dashboard']);
        }
        this.rolelist = result.data.rolelist;
      }
    })
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  ChangePermissions=this.fb.group({
    leads : [''],
    contacts : [''],
    account : [''],
    opportunity : [''],
    deals : [''],
    tasks : [''],
    meetings : [''],
    calls : [''],
    reports : [''],
    campaigns : [''],
    users : ['']
  })
  onSubmit(data:any){
    var request = {"uid":this.session_uid,"org_uid":this.orgId,'data':data,'acId':this.account_id,'profile_id':this.cProfile}
    this.service.apiPost('setPermission',request)
    .subscribe(result => {
      if(result.status=='success'){
        this.service.apiPost('getUserInfo',{"uid":this.session_uid,"org_uid":this.orgId,'acId':this.account_id,'profile_id':this.cProfile})
        .subscribe(result => {
          if(result){
            console.log(result);
            this.ispermitted = JSON.parse(result.data.acType.permissions);
            this.leads = this.ispermitted.leads;
            this.contacts = this.ispermitted.contacts;
            this.opportunity = this.ispermitted.opportunity;
            this.account =  this.ispermitted.account;
            this.deals =  this.ispermitted.deals;
            this.tasks =  this.ispermitted.tasks;
            this.meetings =  this.ispermitted.meetings;
            this.calls =  this.ispermitted.calls;
            this.reports =  this.ispermitted.reports;
            this.campaigns =  this.ispermitted.campaigns;
            this.users = this.ispermitted.users;
            this.user = result.data.user;
            this.first_name = result.data.user.name;
            this.acTypes = result.data.acTypes;
            this.orgazs = result.data.orgazs;
            this.orgaz = result.data.orgaz.name;
            this.roles = result.data.roletree;
            this.role = result.data.role;
            this.rolelist = result.data.rolelist;
          }
        })
        toastr.success(result.message);
      }else{
        toastr.error(result.message);
      }
    },error =>{
      toastr.error(error);
    })
  }
  back(){
    this.router.navigate(['/crm/members']);
  }

}
