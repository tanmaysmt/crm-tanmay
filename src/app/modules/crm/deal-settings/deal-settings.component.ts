import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { FormBuilder,FormArray, FormControl,FormGroup, Validators} from '@angular/forms';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
import {NgForm} from '@angular/forms';
declare var toastr:any;
declare var $:any;
@Component({
  selector: 'app-deal-settings',
  templateUrl: './deal-settings.component.html',
  styleUrls: ['./deal-settings.component.css']
})
export class DealSettingsComponent implements OnInit {

  uId:any = localStorage.getItem('uId');
  orgId = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  constructor(private fb:FormBuilder,private router:Router,private common : CommonService,private service : AuthService,private route:ActivatedRoute) {
  }
  DealStatus = [] as any;
  DealStatusGroup = [] as any;
  selectedItemsList = new Array();
  checkedIDs = [];
  loading = true;
  submit = false;
  ngOnInit(): void {
    this.service.apiPost('dealStatusList',{"uid":this.uId,"org_uid":this.orgId})
    .subscribe(result => {
      if(result){
        this.DealStatus = result.data.DealStatus;
      }
    })
    this.service.apiPost('dealStatusGroup',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile})
    .subscribe(result => {
      if(result){
        if(result.dealstatus!=null){
          this.DealStatusGroup = JSON.parse(result.dealstatus.status_ids);
          this.submit = true;
        }
        this.loading = false;
      }
    })
  }
  changeCheckbox(event:any, index:any){
    this.DealStatusGroup[index].is_checked = event.target.checked;
  }
  onSubmit(data:NgForm){
    this.service.apiPost('dealsStatusAddEdit',{'statusIds':this.DealStatusGroup,'uid':this.uId,"org_uid":this.orgId,'profile_id':this.cProfile}).subscribe(
      response => {
        if(response.status=='success'){
          this.router.navigate(['crm/deals']);
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
