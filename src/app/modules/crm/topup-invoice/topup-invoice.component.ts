import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-topup-invoice',
  templateUrl: './topup-invoice.component.html',
  styleUrls: ['./topup-invoice.component.css']
})
export class TopupInvoiceComponent implements OnInit {
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  url = CommonService.API_ENDPOINT;
  srcUrl = CommonService.SRC_API_ENDPOINT;
  transaction = [] as any;
  ptopup = [] as any;
  razor = [] as any;
  user = [] as any;
  constructor(private http:HttpClient,private router:Router,private common : CommonService,private service : AuthService,private route:ActivatedRoute) {
     this.getTopupDetails();
  }
  getTopupDetails(){
    this.service.apiGet('TopupInvoice?uid='+this.uId+"&org_uid="+this.orgId+"&profile_id="+this.cProfile+"&order_id="+this.route.snapshot.paramMap.get('id'))
    .subscribe((result:any) => {
      console.log(result);
      this.transaction = result.transaction;
      this.user = result.transaction.user;
      this.ptopup = result.ptopup;
      this.razor = result.razor;
    })
  }
  ngOnInit(): void {
    setTimeout(function(){
      window.print()
    }, 800);
  }

}
