import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { InvitationsComponent } from './invitations/invitations.component';
import { PageExpiredComponent } from './page-expired/page-expired.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { PackagesComponent } from './packages/packages.component';
import { ServicesComponent } from './services/services.component';
import { PaymentFailedComponent } from './payment-failed/payment-failed.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { SelectOrgComponent } from './select-org/select-org.component';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { PackageOrderSummaryComponent } from './package-order-summary/package-order-summary.component';
import { PayamentProcessingComponent } from './payament-processing/payament-processing.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import {SupportComponent  } from "./support/support.component";


const routes: Routes = [

  { path:'',component:HomeComponent },
  { path:'login',component:LoginComponent },
  { path:'register',component:RegisterComponent },
  { path:'invite/:id',component:InvitationsComponent },
  { path:'link-expired',component:PageExpiredComponent },
  { path:'forgot-password',component:ForgotPasswordComponent },
  { path:'reset-password/:id',component:ResetPasswordComponent },
  { path:'verify-otp',component:VerifyOtpComponent },
  { path: 'packages',canActivate:[AuthGuard],component :PackagesComponent},
  { path: 'services',canActivate:[AuthGuard],component :ServicesComponent},
  { path: 'select-org',canActivate:[AuthGuard],component :SelectOrgComponent},
  { path: 'payment-success/:id',canActivate:[AuthGuard],component :PaymentSuccessComponent},
  { path: 'payment-failed/:id',canActivate:[AuthGuard],component :PaymentFailedComponent},
  { path: 'order/:id',canActivate:[AuthGuard],component :PackageOrderSummaryComponent},
  { path: 'payment-processing',canActivate:[AuthGuard],component :PayamentProcessingComponent},
  { path: 'privacy_policies',component:PrivacyPolicyComponent},
  { path: 'terms&conditions',component:TermsAndConditionsComponent},
  { path: 'support',component:SupportComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontRoutingModule { }
