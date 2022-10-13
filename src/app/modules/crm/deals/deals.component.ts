import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.css']
})
export class DealsComponent implements OnInit {
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  leadLists=[] as any;
  constructor(private location :Location,private router:Router,private common : CommonService,private service : AuthService,private route:ActivatedRoute) { }
  loading = true;
  editDeal = true;
  AddDeal = true;
  DeleteDeal = true;
  ngOnInit(): void {
    this.service.getPermissions().subscribe(result => {
      if(result){
        function Permission(value:any,account:any) {
          if(account=='deals'){
            return JSON.parse(result.permissions).deals.some(function(el:any) {
              return el.value === value;
            }); 
          }
        }
        if(Permission('view','deals')==false){
          this.router.navigate(['/crm/dashboard']);
        }
        if(Permission('edit','deals')==false){
          this.editDeal = false;
        }
        if(Permission('create','deals')==false){
          this.AddDeal = false;
        }
        if(Permission('delete','deals')==false){
          this.DeleteDeal = false;
        }
      }
    })
    this.service.apiPost('getDealsList',{"uid":this.uId,"org_uid":this.orgId,"profile_id":this.cProfile})
    .subscribe(result  => {
      if(result){
        this.leadLists = result.data;
        this.loading = false;
      }
    })
  }
}