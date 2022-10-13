import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
declare var $:any
@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent{
  transaction:any;
  user:any;
  ppackage:any;
  ptopup:any;
  razor:any;
  PackageDetails=false;
  TopupDetails=false;
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  pTransactions = [] as any;
  TTransactions = [] as any;
  loading = true;
  currentDate = new Date();
  oppo=false;
  lea=false;
  constructor(public common:CommonService,private service:AuthService) {
    this.getOrderHistory();
  }
  getOrderHistory(){
    this.service.apiGet('OrderHistory?uid='+this.uId+"&org_uid="+this.orgId+"&profile_id="+this.cProfile)
    .subscribe((result:any) => {
      this.loading = false;
      this.pTransactions = result.data.packageTransactions;
      this.TTransactions = result.data.topupTransactions;
    })
  }
  
  getPackageDetails(id:any){
    this.service.apiGet('PackageInvoice?uid='+this.uId+"&org_uid="+this.orgId+"&profile_id="+this.cProfile+"&order_id="+id)
    .subscribe((result:any) => {
      this.PackageDetails = true;
      $("#modal-PackageDetails").modal("show");
      this.transaction = result.transaction;
      this.user = result.transaction.user;
      this.ppackage = result.ppackage;
      this.razor = result.razor;
    })
  }
  getTopupDatails(id:any){
    this.service.apiGet('TopupInvoice?uid='+this.uId+"&org_uid="+this.orgId+"&profile_id="+this.cProfile+"&order_id="+id)
    .subscribe((result:any) => {
      this.TopupDetails = true;
      $("#modal-TopupDetails").modal("show");
      this.transaction = result.transaction;
      this.user = result.transaction.user;
      this.ptopup = result.ptopup;
      this.razor = result.razor;
    })
  }
  calculateDiff(data:any){
    let date = new Date(data);
    let currentDate = new Date();
    let days = Math.floor((currentDate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24);
    return days;
  }
  calculatExpiry(data:any,days:any){
    let date = new Date(data);
    return date.setDate(date.getDate() + days );
  }
}
