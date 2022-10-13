import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl,FormGroup, Validators} from '@angular/forms';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

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
  islogin = false;
  Scripts = [
    //"assets/assets/js/jquery.min.js",
    //"assets/assets/js/popper.min.js",
    //"assets/assets/js/bootstrap.min.js",
    //"assets/assets/js/jquery.meanmenu.js",
    //"assets/assets/js/owl.carousel.min.js",
    //"assets/assets/js/jquery.appear.js",
    //"assets/assets/js/odometer.min.js",
    //"assets/assets/js/jquery.nice-select.min.js",
    //"assets/assets/js/wow.min.js",
    "assets/assets/js/main.js"
  ];
  Css = [
    //"assets/assets/css/bootstrap.min.css",
    //"assets/assets/css/animate.min.css",
    "assets/assets/css/owl.carousel.min.css",
    "assets/assets/css/owl.theme.default.min.css",
    //"assets/assets/css/odometer.min.css",
    //"assets/assets/css/nice-select.min.css",
    //"assets/assets/css/meanmenu.css",
    "assets/assets/css/style.css",
    "assets/assets/css/responsive.css",
  ]
  constructor(private service : AuthService,public common : CommonService,private router :Router) { 
    if(document.getElementById(this.Scripts[0])){
    } else {
      this.common.loadCss(this.Css);
      this.common.loadScripts(this.Scripts);
    }
  }
  ngOnInit(): void {
    this.service.apiPost('getUserInfo',{"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile})
    .subscribe(result => {
      if(result.data){
        this.islogin = true;
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
      }
    },error =>{
      this.islogin = false;
    })
  }
  login(){
    this.router.navigate(['/login']);
  }
  logout(){
    this.service.logOut();
    this.router.navigate(['/login']);
  }
}
