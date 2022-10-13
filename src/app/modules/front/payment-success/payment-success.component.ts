import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd,Params, Route } from '@angular/router';
import { HttpClient, HttpHeaders,HttpHeaderResponse,} from '@angular/common/http';
import { CommonService } from 'src/app/service/common.service';
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  amount=0.00;
  uId:any = localStorage.getItem('uId');
  orgId:any = localStorage.getItem('org_uid');
  account_id:any = localStorage.getItem('acId');
  cProfile:any = localStorage.getItem('cProfile');
  constructor(private http:HttpClient,private router:Router,private common : CommonService,private service : AuthService,private route:ActivatedRoute) { }
  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('id')){
      this.service.apiPost('CheckPaymentStatus',{"order_id":this.route.snapshot.paramMap.get('id'),"uid":this.uId,"org_uid":this.orgId,'profile_id':this.cProfile})
      .subscribe(result => {
        if(result.status=='success'){
          this.amount = result.amount;
        }else{
          this.router.navigate(['/link-expired'])
        }
      },error =>{
        this.router.navigate(['/login'])
      })
    }
  }
}
