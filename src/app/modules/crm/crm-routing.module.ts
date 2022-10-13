import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CrmComponent } from './crm.component';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { LeadsComponent } from './leads/leads.component';
import { EditLeadComponent } from './edit-lead/edit-lead.component';
import { LeadDetailsComponent } from './lead-details/lead-details.component';
import { AccountComponent } from './account/account.component';
import { AccountsComponent } from './accounts/accounts.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { ContactsComponent } from './contacts/contacts.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';
import { OpportunitiesComponent } from './opportunities/opportunities.component';
import { EditOpportunityComponent } from './edit-opportunity/edit-opportunity.component';
import { DealsComponent } from './deals/deals.component';
import { EditDealComponent } from './edit-deal/edit-deal.component';
import { DealDetailsComponent } from './deal-details/deal-details.component';
import { DealSettingsComponent } from './deal-settings/deal-settings.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { EditCampaignComponent } from './edit-campaign/edit-campaign.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { AccessDeniedComponent} from './access-denied/access-denied.component';
import { TestComponent } from './test/test.component';
import { TasksComponent } from './tasks/tasks.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { PackageInvoiceComponent } from './package-invoice/package-invoice.component';
import { TopupInvoiceComponent } from './topup-invoice/topup-invoice.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { MeetingComponent } from './meeting/meeting.component'; 
import { EditMeetingComponent } from './edit-meeting/edit-meeting.component';
import { MeetingDetailsComponent } from './meeting-details/meeting-details.component';
import { MatTableComponent } from './mat-table/mat-table.component';
import { LeadsFeedbacksComponent } from './leads-feedbacks/leads-feedbacks.component';
import { CallHistoryComponent } from './call-history/call-history.component';
import { FeedbackDetailsComponent } from './feedback-details/feedback-details.component';
import { MemberDashboardComponent } from './member-dashboard/member-dashboard.component';
import { MemberFeedbacksComponent } from './member-feedbacks/member-feedbacks.component';
import { MemberLeadsComponent } from './member-leads/member-leads.component';
import { MemberTasksComponent } from './member-tasks/member-tasks.component';
import { ChartsjsComponent } from './chartsjs/chartsjs.component';
import { CampaignReportComponent } from './campaign-report/campaign-report.component';
const routes: Routes = [
  /* Tasks Start */
  {path :"chartjs" ,canActivate:[AuthGuard],component :ChartsjsComponent },
  {path :"mat_table" ,canActivate:[AuthGuard],component :MatTableComponent },
  {path :"notifications/:id" ,canActivate:[AuthGuard],component :NotificationsComponent },
  {path :"tasks" ,canActivate:[AuthGuard],component :TasksComponent },
  {path :"tasks/:id" ,canActivate:[AuthGuard],component :EditTaskComponent },
  {path :"tasks/add" ,canActivate:[AuthGuard],component :EditTaskComponent },
  /* Tasks End */
  /* Leads Start */
  {path :"leads" ,canActivate:[AuthGuard],component :LeadsComponent },
  {path :"lead/success" ,canActivate:[AuthGuard],component :LeadsComponent },
  {path :"leads/:id" ,canActivate:[AuthGuard],component :EditLeadComponent },
  {path :"leads/add" ,canActivate:[AuthGuard],component :EditLeadComponent },
  {path :"lead-details/:id" ,canActivate:[AuthGuard],component :LeadDetailsComponent },
  /* Leads End */

  /* Account Start  */
  {path :"account" ,canActivate:[AuthGuard],component :AccountComponent },
  {path :"accounts/:id" ,canActivate:[AuthGuard],component :EditAccountComponent },
  {path :"accounts/add" ,canActivate:[AuthGuard],component :EditAccountComponent },
  {path :"accounts" ,canActivate:[AuthGuard],component :AccountsComponent },
  /* Account End  */

  /* Contact Start */
  {path :"contacts" ,canActivate:[AuthGuard],component :ContactsComponent },
  {path :"contacts/:id" ,canActivate:[AuthGuard],component :EditContactComponent },
  {path :"contacts/add" ,canActivate:[AuthGuard],component :EditContactComponent },
  /* Contact End */

  /* Opportunity Start  */
  {path :"opportunities" ,canActivate:[AuthGuard],component :OpportunitiesComponent },
  {path :"opportunities/:id" ,canActivate:[AuthGuard],component :EditOpportunityComponent },
  {path :"opportunities/add" ,canActivate:[AuthGuard],component :EditOpportunityComponent },
  /* Opportunity End */

  /* Deals Start */
  {path :"deals",canActivate:[AuthGuard], component :DealsComponent},
  {path :"deal/:id",canActivate:[AuthGuard], component :EditDealComponent},
  {path :"deal/add",canActivate:[AuthGuard], component :EditDealComponent},
  {path :"deal/details/:id",canActivate:[AuthGuard], component :DealDetailsComponent},
  {path :"deals/settings",canActivate:[AuthGuard], component :DealSettingsComponent},
  /* Deals End */
  
  /* Campaign */
  {path :"campaigns",canActivate:[AuthGuard], component :CampaignsComponent},
  {path :"campaigns/:id",canActivate:[AuthGuard], component :EditCampaignComponent},
  {path :"campaigns/add",canActivate:[AuthGuard], component :EditCampaignComponent},
  {path :"campaigns/report/:random/:cid/:org_id",canActivate:[AuthGuard], component :CampaignReportComponent},
  /* Campaign */

  /* User */
  {path :"profile/:profile_id/:orgId/:id" ,canActivate:[AuthGuard],component :ProfileComponent },
  {path :"create-account" ,canActivate:[AuthGuard],component :EditAccountComponent },
  {path :"edit-account/:id" ,canActivate:[AuthGuard],component :EditAccountComponent },
  {path :"members",canActivate:[AuthGuard], component :UsersComponent},
  {path :"permissions/:id",canActivate:[AuthGuard], component :PermissionsComponent},
  /* User */

  {path :"dashboard" ,canActivate:[AuthGuard],component :DashboardComponent },
  {path :"organizations" ,canActivate:[AuthGuard],component :OrganizationsComponent },
  {path :"access-denied",canActivate:[AuthGuard], component :AccessDeniedComponent},
  {path :"test",canActivate:[AuthGuard], component :TestComponent},
  {path :"order-history",canActivate:[AuthGuard], component :OrderHistoryComponent},
  {path :"package-invoice/:id",canActivate:[AuthGuard], component :PackageInvoiceComponent},
  {path :"topup-invoice/:id",canActivate:[AuthGuard], component :TopupInvoiceComponent},

  /* Meeting */
  {path :"meetings" ,canActivate:[AuthGuard],component :MeetingComponent },
  {path :"meetings/:id" ,canActivate:[AuthGuard],component :EditMeetingComponent },
  {path :"meeting-details/:id" ,canActivate:[AuthGuard],component :MeetingDetailsComponent },
  /* Meeting */

  /* Feedback */
  {path :"feedbacks" ,canActivate:[AuthGuard],component :LeadsFeedbacksComponent },
  {path :"feedbacks/:id" ,canActivate:[AuthGuard],component :FeedbackDetailsComponent },
  {path :"callHistory" ,canActivate:[AuthGuard],component :CallHistoryComponent },
  /* Feedback */

  /* MEMBER */
  {path :"dashboard/member/:profile_id/:orgId/:id" ,canActivate:[AuthGuard],component :MemberDashboardComponent },
  {path :"feedbacks/member/:profile_id/:orgId/:id" ,canActivate:[AuthGuard],component :MemberFeedbacksComponent },
  {path :"leads/member/:profile_id/:orgId/:id" ,canActivate:[AuthGuard],component :MemberLeadsComponent },
  {path :"tasks/member/:profile_id/:orgId/:id" ,canActivate:[AuthGuard],component :MemberTasksComponent },
  /* MEMBER */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
