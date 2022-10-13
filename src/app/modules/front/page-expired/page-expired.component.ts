import { Component, OnInit } from '@angular/core';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-page-expired',
  templateUrl: './page-expired.component.html',
  styleUrls: ['./page-expired.component.css']
})
export class PageExpiredComponent implements OnInit {
  constructor(private service : AuthService) { }
  ngOnInit(): void {
    localStorage.removeItem('invited_email');
    if (this.service.isAuthenticated()) {
      this.service.logOut();
		}
  }
}
