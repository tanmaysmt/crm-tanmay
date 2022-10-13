import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public common:CommonService,private service:AuthService) { }
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  products = [] as any;
  categories = [] as any;
  brands = [] as any;
  total_product :any;
  total_categories :any;
  total_brands :any;
  ngOnInit(): void {
    this.service.apiGet('ShoppingDashboard?uid='+this.uId+"&org_uid="+this.orgId+"&profile_id="+this.cProfile)
    .subscribe((result:any) => {
      if(result){
        this.products = result.data.products;
        this.categories = result.data.categories;
        this.brands = result.data.brands;
        this.total_product = result.data.total_product;
        this.total_categories = result.data.total_categories;
        this.total_brands = result.data.total_brands;
      }
    })
  }

}
