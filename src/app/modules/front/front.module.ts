import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FrontRoutingModule } from './front-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { InvitationsComponent } from './invitations/invitations.component';
import { PageExpiredComponent } from './page-expired/page-expired.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PackagesComponent } from './packages/packages.component';
import { ServicesComponent } from './services/services.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentFailedComponent } from './payment-failed/payment-failed.component';
import { BoxLoaderComponent } from './box-loader/box-loader.component';
import { SelectOrgComponent } from './select-org/select-org.component';
import { PackageOrderSummaryComponent } from './package-order-summary/package-order-summary.component';
import { PayamentProcessingComponent } from './payament-processing/payament-processing.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { SupportComponent } from './support/support.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    InvitationsComponent,
    PageExpiredComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    VerifyOtpComponent,
    HeaderComponent,
    FooterComponent,
    PackagesComponent,
    ServicesComponent,
    PaymentSuccessComponent,
    PaymentFailedComponent,
    BoxLoaderComponent,
    SelectOrgComponent,
    PackageOrderSummaryComponent,
    PayamentProcessingComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
    SupportComponent
  ],
  imports: [
    CommonModule,
    FrontRoutingModule,
    ReactiveFormsModule,FormsModule
  ]
})
export class FrontModule { }
