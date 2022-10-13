import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { FormBuilder, FormControl,FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';
declare var toastr:any;
declare var $:any;
declare var Swal:any;
@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.css']
})
export class OrganizationsComponent implements OnInit {

  constructor(private fb : FormBuilder ,private service:AuthService,private route:ActivatedRoute,private router :Router) { }
  loading = true;
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  profiles = [] as any;
  ngOnInit(): void {
    this.service.apiPost('getUserInfo',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile})
    .subscribe(result => {
      if(result.data){
        this.loading = false;
        this.profiles = result.data.profiles;
      }
    })
  }
  AddOrganization = this.fb.group({
    company_name : ['',Validators.required],
    company_description : ['',Validators.required],
  })
  orgSubmit(data:any){
    data.uid = this.uId;
    data.org_uid = this.orgId;
    data.profile_id = this.cProfile;
    this.loading = true;
    this.service.apiPost('addOrganization',data)
    .subscribe(result => {
      if(result.status=='success'){
        console.log(result.data);
        localStorage.removeItem('org_uid');
        localStorage.removeItem('cProfile');
        localStorage.removeItem('acId');
        localStorage.setItem('org_uid',result.data.org_uid);
        localStorage.setItem('cProfile',result.data.cProfile);
        localStorage.setItem('acId',result.data.acId);
        this.service.apiPost('getUserInfo',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile})
        .subscribe(result => {
          if(result.data){
            this.loading = false;
            this.profiles = result.data.profiles;
            location.reload();
          }
        })
        toastr.success(result.message);
        $("#modal-defaultorganization").modal("hide");
        this.AddOrganization.reset();
      }else{
        toastr.error(result.message);
      }
    },error =>{
      toastr.error(error);
    })
  }
  change(data:any){
    localStorage.removeItem('org_uid');
    localStorage.removeItem('cProfile');
    localStorage.removeItem('acId');
    localStorage.setItem('org_uid',data.split(',')[0]);
    localStorage.setItem('cProfile',data.split(',')[1]);
    localStorage.setItem('acId',data.split(',')[2]);
    location.reload();
  }
}