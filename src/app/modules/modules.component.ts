import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';
import { mergeMapTo } from 'rxjs/operators';
@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent {
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
      "assets/assets/js/jquery.min.js",
      "assets/assets/js/popper.min.js",
      "assets/assets/js/bootstrap.min.js",
      "assets/assets/js/jquery.meanmenu.js",
      "assets/assets/js/owl.carousel.min.js",
      "assets/assets/js/jquery.appear.js",
      "assets/assets/js/odometer.min.js",
      "assets/assets/js/jquery.nice-select.min.js",
      "assets/assets/js/wow.min.js",
      "assets/assets/js/main.js"
  ];
  Css = [
    "assets/assets/css/bootstrap.min.css",
    "assets/assets/css/animate.min.css",
    "assets/assets/css/owl.carousel.min.css",
    "assets/assets/css/owl.theme.default.min.css",
    "assets/assets/css/odometer.min.css",
    "assets/assets/css/nice-select.min.css",
    "assets/assets/css/meanmenu.css",
    "assets/assets/css/style.css",
    "assets/assets/css/responsive.css",
  ]
  constructor(private service : AuthService,public common : CommonService,private router :Router) { 
    this.common.removeCSS(this.Css);
    this.common.removeScripts(this.Scripts);
    if (!this.service.isAuthenticated()) {
      this.service.logOut();
      this.router.navigate(['']);
    }
  }
  
  logout(){
    this.service.logOut();
    this.router.navigate(['/login']);
  }
  
}
