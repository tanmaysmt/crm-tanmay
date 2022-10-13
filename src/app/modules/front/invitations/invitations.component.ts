import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { toBase64String } from '@angular/compiler/src/output/source_map';
declare var toastr:any;
declare var $:any;
@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.css']
})
export class InvitationsComponent implements OnInit {
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  constructor(private http:HttpClient,private router:Router,private common : CommonService,private fb:FormBuilder,private service : AuthService,private route:ActivatedRoute) { }
  loading=true;
  showregister = false;
  showlogin = false;
  organization:any;
  id=this.route.snapshot.paramMap.get('id');
  ngOnInit(): void {
    this.service.checkinvitation({"invitationuid":this.route.snapshot.paramMap.get('id')})
    .subscribe(result  => {
      if(result.status=="success"){
        this.loading=false;
        if(result.data.is_already_account=='0'){
          if (this.service.isAuthenticated()) {
              this.service.logOut();
          }
          this.showregister = true;
          this.organization = result.data.profile.organization.name;
          this.registrationform.patchValue({
            email:result.data.email,
            organization:result.data.profile.organization.name
          })
        }else{
          if (this.service.isAuthenticated()) {
            this.service.apiPost('acceptInvitation',{"is_accept":'1',"is_reject":'0',"invitation_id":this.id,"uid":this.uId,"org_uid":this.orgId,"profile_id":this.cProfile})
            .subscribe(result  => {
              if(result){
                if(result.status=='success'){
                  localStorage.setItem('acceptInvitation',"yes");
                  this.router.navigate(['/crm/dashboard']);
                }
              }
            })
          }else{
            this.showlogin=true;
            localStorage.removeItem('invited_email');
            localStorage.removeItem('invitation_id');
            localStorage.setItem('invited_email',result.data.email);
            localStorage.setItem('invitation_id',result.data.invitation_unique_id);
            this.router.navigate(['/login']);
          }
        }
      }else if(result.status=="failed"){
        localStorage.removeItem('invited_email');
        this.router.navigate(['/link-expired']);
      }else{
        localStorage.removeItem('invited_email');
        this.router.navigate(['/link-expired']);
      }
    })
  }
  registrationform = new FormGroup({
    name : new FormControl(''),
    email : new FormControl(''),
    phone : new FormControl(''),
    organization : new FormControl(''),
    password : new FormControl(''),
    c_password : new FormControl(''),
  })
  onRegisterSubmit(data:any){
    data.invitationuid = this.id;
    this.service.register(data).subscribe(
      response => {
        if(response.success){
          localStorage.removeItem('invited_email');
          this.service.storeWebToken(response.success)
          this.router.navigate(['/crm/dashboard']);
        }
      },error =>{
        toastr.error(error.error.error);
      }
    )
  }
}
