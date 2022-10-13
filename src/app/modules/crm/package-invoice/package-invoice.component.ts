import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
declare var toastr:any;
declare var $:any;
@Component({
  selector: 'app-package-invoice',
  templateUrl: './package-invoice.component.html',
  styleUrls: ['./package-invoice.component.css']
})
export class PackageInvoiceComponent implements OnInit {
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  url = CommonService.API_ENDPOINT;
  srcUrl = CommonService.SRC_API_ENDPOINT;
  transaction = [] as any;
  ppackage = [] as any;
  razor = [] as any;
  user = [] as any;
  constructor(private http:HttpClient,private router:Router,private common : CommonService,private service : AuthService,private route:ActivatedRoute) { 
    this.getPackageDetails();
  }
  getPackageDetails(){
    this.service.apiGet('PackageInvoice?uid='+this.uId+"&org_uid="+this.orgId+"&profile_id="+this.cProfile+"&order_id="+this.route.snapshot.paramMap.get('id'))
    .subscribe((result:any) => {
      console.log(result);
      this.transaction = result.transaction;
      this.user = result.transaction.user;
      this.ppackage = result.ppackage;
      this.razor = result.razor;
    })
  }
  ngOnInit(): void {
    setTimeout(function(){
      window.print()
    }, 800);
  }
}
