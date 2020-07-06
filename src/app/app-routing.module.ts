import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth.service';

import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PasswordForgotComponent } from './auth/password-forgot/password-forgot.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { CoachComponent } from './admin/coach/coach.component';
import { AthleteComponent } from './admin/athlete/athlete.component';

import { AthleteDashboardComponent } from './admin/athlete/athlete-dashboard/athlete-dashboard.component';
import { AthleteProfileComponent } from './admin/athlete/athlete-profile/athlete-profile.component';
import { AthleteStatsComponent } from './admin/athlete/athlete-stats/athlete-stats.component';
import { AthleteCalendarComponent } from './admin/athlete/athlete-calendar/athlete-calendar.component';
import { AthleteNotificationsComponent } from './admin/athlete/athlete-notifications/athlete-notifications.component';
import { AthleteProgramsComponent } from './admin/athlete/athlete-programs/athlete-programs.component';

import { CoachCalendarComponent } from './admin/coach/coach-calendar/coach-calendar.component';
import { CoachDashboardComponent } from './admin/coach/coach-dashboard/coach-dashboard.component';
import { CoachProgramsComponent } from './admin/coach/coach-programs/coach-programs.component';
import { CoachAthletesComponent } from './admin/coach/coach-athletes/coach-athletes.component';
import { CoachSettingsComponent } from './admin/coach/coach-settings/coach-settings.component';
import { CoachNotificationsComponent } from './admin/coach/coach-notifications/coach-notifications.component';
import { CoachAthleteProfileComponent } from './admin/coach/coach-athlete-profile/coach-athlete-profile.component';
import { CoachAthleteStatsComponent } from './admin/coach/coach-athlete-stats/coach-athlete-stats.component';
import { CoachAthleteCalendarComponent } from './admin/coach/coach-athlete-calendar/coach-athlete-calendar.component';
import { ConfirmAccountComponent } from './auth/confirm-account/confirm-account.component';
import { AccountNotConfirmedComponent } from './auth/account-not-confirmed/account-not-confirmed.component';

const routes: Routes = [{
    path: '',
    component: AuthComponent,
    children: [{
    	path: '',
    	component: LoginComponent
	},{
        path: 'signup',
        component: RegisterComponent
    },{
        path: 'forgot-password',
        component: PasswordForgotComponent
    },{
        path: 'account-not-confirmed/:email',
        component: AccountNotConfirmedComponent
    },{
        path: 'reset-password/:token/:email',
        component: PasswordResetComponent
    },{
        path: 'confirm-account/:token/:email',
        component: ConfirmAccountComponent
    }]
}, {
    path: 'coach',
    component: CoachComponent,
    canActivate: [AuthGuard],
    children: [{
        path: 'dashboard',
        component: CoachDashboardComponent
      },{
        path: 'profile',
        component: CoachAthleteProfileComponent
      },{
        path: 'calendar',
        component: CoachAthleteCalendarComponent
      },{
        path: 'stats',
        component: CoachAthleteStatsComponent
      }]
}, {
    path: 'athlete',
    component: AthleteComponent,
    canActivate: [AuthGuard],
    children: [{
        path: 'dashboard',
        component: AthleteDashboardComponent
      },{
        path: 'profile',
        component: AthleteProfileComponent
      },{
        path: 'calendar',
        component: AthleteCalendarComponent
      },{
        path: 'programs',
        component: AthleteProgramsComponent
      },{
        path: 'stats',
        component: AthleteStatsComponent
    }]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
