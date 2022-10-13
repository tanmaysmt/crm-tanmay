import { Component, OnInit } from '@angular/core';
declare var Razorpay:any;
@Component({
  selector: 'app-package-order-summary',
  templateUrl: './package-order-summary.component.html',
  styleUrls: ['./package-order-summary.component.css']
})
export class PackageOrderSummaryComponent implements OnInit {
  constructor() { }
    ngOnInit(): void {
      var razorpay = new Razorpay({
      key: '{{RAZORPAY_KEY_ID}}', 
      image: 'https://walit.net/assets/images/icon_pay_its1.png',
    });
  }
 
}
