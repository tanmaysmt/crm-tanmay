import { Component, OnInit ,Input ,Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormControl,FormGroup, Validators} from '@angular/forms';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() permissions = new EventEmitter<string>();
  @Output() userinfo = new EventEmitter<string>();
  constructor(private service:AuthService,private fb:FormBuilder,private route:ActivatedRoute,private router :Router) { }
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  first_name:any;
  user:any;
  acTypes:any;
  orgazs:any;
  roles:any;
  role:any;
  imageSrc:any;
  profiles = [] as any;
  invitations = [] as any;
  selectedorg:any;
  selectedorgid:any;
  url = CommonService.API_ENDPOINT;
  srcUrl = CommonService.SRC_API_ENDPOINT;
  Rloading = true;
  ngOnInit(): void {
    this.service.getPermissions().subscribe(result => {
      if(result){
        this.permissions.emit(result)
      } 
    }) 
    this.Rloading = true;
    this.service.apiPost('getUserInfo',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile})
    .subscribe(result => {
      if(result.data){
        this.userinfo.emit(result)
        this.Rloading = false;
        this.role = result.data.role.name;
        this.profiles = result.data.profiles;
        this.selectedorg = result.data.orgaz.name;
        this.selectedorgid = result.data.orgaz.org_unique_id;
        this.first_name = result.data.user.first_name;
        this.orgazs = result.data.orgazs;
        this.imageSrc = this.srcUrl+'avatar/'+result.data.user.avatar;
        if(result.data.user.avatar===null){
          this.imageSrc = this.srcUrl+'avatar/avatar.png';
        }
        this.changeOrganization.patchValue({
          profile_id : result.data.orgaz.org_unique_id+","+this.cProfile+","+this.account_id,
        });
      }
    },error =>{
      this.service.logOut();
      this.router.navigate(['/']);
    })
  }
  changeOrganization=this.fb.group({
    profile_id : ['']
  })
  logout(){
    this.service.logOut();
    this.router.navigate(['/']);
  }
  ChangeOrganization(data:any){
    localStorage.removeItem('org_uid');
    localStorage.removeItem('cProfile');
    localStorage.removeItem('acId');
    localStorage.setItem('org_uid',data.profile_id.split(',')[0]);
    localStorage.setItem('cProfile',data.profile_id.split(',')[1]);
    localStorage.setItem('acId',data.profile_id.split(',')[2]);
    location.reload();
  }
}
