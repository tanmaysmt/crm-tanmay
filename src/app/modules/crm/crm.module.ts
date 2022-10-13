import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatTableModule} from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatNativeDateModule} from '@angular/material/core';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CrmRoutingModule } from './crm-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CrmComponent } from './crm.component';
import { LeadsComponent } from './leads/leads.component';
import { AccountsComponent } from './accounts/accounts.component';
import { ContactsComponent } from './contacts/contacts.component';
import { OpportunitiesComponent } from './opportunities/opportunities.component';
import { DealsComponent } from './deals/deals.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { AccountComponent } from './account/account.component';
import { ProfileComponent } from './profile/profile.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { EditLeadComponent } from './edit-lead/edit-lead.component';
import { LeadDetailsComponent } from './lead-details/lead-details.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';
import { EditOpportunityComponent } from './edit-opportunity/edit-opportunity.component';
import { EditDealComponent } from './edit-deal/edit-deal.component';
import { DealDetailsComponent } from './deal-details/deal-details.component';
import { EditCampaignComponent } from './edit-campaign/edit-campaign.component';
import { UsersComponent } from './users/users.component';
import { DealSettingsComponent } from './deal-settings/deal-settings.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { TestComponent } from './test/test.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AsideComponent } from './aside/aside.component';
import { FooterComponent } from './footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NoDataComponent } from './no-data/no-data.component';
import { LoaderComponent } from './loader/loader.component';
import { SideloaderComponent } from './sideloader/sideloader.component';
import { TasksComponent } from './tasks/tasks.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { PackageInvoiceComponent } from './package-invoice/package-invoice.component';
import { TopupInvoiceComponent } from './topup-invoice/topup-invoice.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { MeetingComponent } from './meeting/meeting.component';
import { EditMeetingComponent } from './edit-meeting/edit-meeting.component';
import { MeetingDetailsComponent } from './meeting-details/meeting-details.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatTableComponent } from './mat-table/mat-table.component';
import { LeadsFeedbacksComponent } from './leads-feedbacks/leads-feedbacks.component';
import { CallHistoryComponent } from './call-history/call-history.component';
import { FeedbackDetailsComponent } from './feedback-details/feedback-details.component';
import { MemberDashboardComponent } from './member-dashboard/member-dashboard.component';
import { MemberLeadsComponent } from './member-leads/member-leads.component';
import { MemberTasksComponent } from './member-tasks/member-tasks.component';
import { MemberFeedbacksComponent } from './member-feedbacks/member-feedbacks.component';
import { ChartsjsComponent } from './chartsjs/chartsjs.component';
import { NgChartsModule } from 'ng2-charts';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDialogModule} from '@angular/material/dialog';
import { LeadTransferComponent } from './dialogBox/lead-transfer/lead-transfer.component';
import { CampaignReportComponent } from './campaign-report/campaign-report.component';
import {MatTreeModule} from '@angular/material/tree';
@NgModule({
  declarations: [
    DashboardComponent,
    CrmComponent,
    LeadsComponent,
    AccountsComponent,
    ContactsComponent,
    OpportunitiesComponent,
    DealsComponent,
    CampaignsComponent,
    AccountComponent,
    ProfileComponent,
    PermissionsComponent,
    OrganizationsComponent,
    EditLeadComponent,
    LeadDetailsComponent,
    EditAccountComponent,
    EditContactComponent,
    EditOpportunityComponent,
    EditDealComponent,
    DealDetailsComponent,
    EditCampaignComponent,
    UsersComponent,
    DealSettingsComponent,
    AccessDeniedComponent,
    TestComponent,
    NavbarComponent,
    AsideComponent,
    FooterComponent,
    NoDataComponent,
    LoaderComponent,
    SideloaderComponent,
    TasksComponent,
    EditTaskComponent,
    OrderHistoryComponent,
    PackageInvoiceComponent,
    TopupInvoiceComponent,
    NotificationsComponent,
    MeetingComponent,
    EditMeetingComponent,
    MeetingDetailsComponent,
    MatTableComponent,
    LeadsFeedbacksComponent,
    CallHistoryComponent,
    FeedbackDetailsComponent,
    MemberDashboardComponent,
    MemberLeadsComponent,
    MemberTasksComponent,
    MemberFeedbacksComponent,
    ChartsjsComponent,
    LeadTransferComponent,
    CampaignReportComponent
  ],
  imports: [
    CommonModule,MatDialogModule,
    CrmRoutingModule,ReactiveFormsModule,CKEditorModule,FormsModule,MatInputModule,MatButtonModule,
    MatTableModule,MatPaginatorModule,MatCheckboxModule,MatRadioModule,MatSelectModule,NgChartsModule,MatTreeModule,
    MatSortModule,MatFormFieldModule,MatNativeDateModule,MatDatepickerModule,MatProgressSpinnerModule,NgMultiSelectDropDownModule,MatAutocompleteModule,
  ]
})
export class CrmModule { }
