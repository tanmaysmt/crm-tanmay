import { Component, OnInit ,Input} from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { CommonService } from 'src/app/service/common.service';
@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {
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
  constructor(private service :AuthService,private common :CommonService) { 
    this.common.removeCSS(this.Css);
    this.common.removeScripts(this.Scripts);
  }
  StaffUser = true;
  ShowLead = true;
  ShowAccount = true;
  ShowContact = true;
  ShowOpportunity = true;
  ShowDeals = true;
  ShowCampaign = true;
  @Input() data:any;
  ngOnInit(): void {
    this.service.getPermissions().subscribe(result => {
      if(result){
        function Permission(value:any,account:any) {
          if(account=='account'){
            return JSON.parse(result.permissions).account.some(function(el:any) {
              return el.value === value;
            }); 
          }else if(account=='leads'){
            return JSON.parse(result.permissions).leads.some(function(el:any) {
              return el.value === value;
            });
          }else if(account=='contacts'){
            return JSON.parse(result.permissions).contacts.some(function(el:any) {
              return el.value === value;
            });
          }else if(account=='account'){
            return JSON.parse(result.permissions).account.some(function(el:any) {
              return el.value === value;
            });
          }else if(account=='deals'){
            return JSON.parse(result.permissions).deals.some(function(el:any) {
              return el.value === value;
            });
          }else if(account=='tasks'){
            return JSON.parse(result.permissions).tasks.some(function(el:any) {
              return el.value === value;
            });
          }else if(account=='meetings'){
            return JSON.parse(result.permissions).meetings.some(function(el:any) {
              return el.value === value;
            });
          }else if(account=='calls'){
            return JSON.parse(result.permissions).calls.some(function(el:any) {
              return el.value === value;
            });
          }else if(account=='reports'){
            return JSON.parse(result.permissions).reports.some(function(el:any) {
              return el.value === value;
            });
          }else if(account=='campaigns'){
            return JSON.parse(result.permissions).campaigns.some(function(el:any) {
              return el.value === value;
            });
          }else if(account=='users'){
            if(JSON.parse(result.permissions).users !==undefined){
              return JSON.parse(result.permissions).users.some(function(el:any) {
                return el.value === value;
              });
            }else{
              return false;
            }
          }else if(account=='opportunity'){
            if(JSON.parse(result.permissions).opportunity !==undefined){
              return JSON.parse(result.permissions).opportunity.some(function(el:any) {
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
        if(Permission('view','campaigns')==false){
          this.ShowCampaign = false;
        }
      } 
    })
  } 
}
