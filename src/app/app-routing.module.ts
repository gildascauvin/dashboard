import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth.service';

import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PasswordForgotComponent } from './auth/password-forgot/password-forgot.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';

import { CoachComponent } from './admin/coach/coach.component';
import { CoachAthleteProfileComponent } from './admin/coach/coach-athlete/coach-athlete-profile/coach-athlete-profile.component';
import { CoachAthleteStatsComponent } from './admin/coach/coach-athlete/coach-athlete-stats/coach-athlete-stats.component';
import { CoachAthleteCalendarComponent } from './admin/coach/coach-athlete/coach-athlete-calendar/coach-athlete-calendar.component';
import { CoachAthleteLeadboardComponent } from './admin/coach/coach-athlete/coach-athlete-leadboard/coach-athlete-leadboard.component';

import { AthleteComponent } from './admin/athlete/athlete.component';

import { ConfirmAccountComponent } from './auth/confirm-account/confirm-account.component';

import { AthleteDashboardComponent } from './admin/athlete/athlete-dashboard/athlete-dashboard.component';
import { AthleteProfileComponent } from './admin/athlete/athlete-profile/athlete-profile.component';
import { AthleteStatsComponent } from './admin/athlete/athlete-stats/athlete-stats.component';
import { AthleteStatsTrainingOverloadComponent } from './admin/athlete/athlete-stats/athlete-stats-training-overload/athlete-stats-training-overload.component';
import { AthleteStatsFatigueManagementComponent } from './admin/athlete/athlete-stats/athlete-stats-fatigue-management/athlete-stats-fatigue-management.component';

import { AthleteCalendarComponent } from './admin/athlete/athlete-calendar/athlete-calendar.component';
import { AthleteNotificationsComponent } from './admin/athlete/athlete-notifications/athlete-notifications.component';
import { AthleteProgramsComponent } from './admin/athlete/athlete-programs/athlete-programs.component';
import { AthleteProgramsDetailComponent } from './admin/athlete/athlete-programs/athlete-programs-detail/athlete-programs-detail.component';
import { AthleteProfilePerformanceComponent } from './admin/athlete/athlete-profile/athlete-profile-performance/athlete-profile-performance.component';
import { AthleteProfileReadinessComponent } from './admin/athlete/athlete-profile/athlete-profile-readiness/athlete-profile-readiness.component';

import { CoachDashboardComponent } from './admin/coach/coach-dashboard/coach-dashboard.component';

import { CoachSettingsComponent } from './admin/coach/coach-settings/coach-settings.component';
import { CoachSettingsPlanComponent } from './admin/coach/coach-settings/coach-settings-plan/coach-settings-plan.component';
import { CoachSettingsProfileComponent } from './admin/coach/coach-settings/coach-settings-profile/coach-settings-profile.component';
import { CoachSettingsPasswordComponent } from './admin/coach/coach-settings/coach-settings-password/coach-settings-password.component';

import { CoachNotificationsComponent } from './admin/coach/coach-notifications/coach-notifications.component';
import { CoachClientsComponent } from './admin/coach/coach-clients/coach-clients.component';
import { CoachProgramsComponent } from './admin/coach/coach-programs/coach-programs.component';
import { CoachProgramsDetailComponent } from './admin/coach/coach-programs/coach-programs-detail/coach-programs-detail.component';

import { AccountNotConfirmedComponent } from './auth/account-not-confirmed/account-not-confirmed.component';

import { AthleteSettingsComponent } from './admin/athlete/athlete-settings/athlete-settings.component';
import { AthleteSettingsPlanComponent } from './admin/athlete/athlete-settings/athlete-settings-plan/athlete-settings-plan.component';
import { AthleteSettingsProfileComponent } from './admin/athlete/athlete-settings/athlete-settings-profile/athlete-settings-profile.component';
import { AthleteSettingsPasswordComponent } from './admin/athlete/athlete-settings/athlete-settings-password/athlete-settings-password.component';

import { AthleteCoachComponent } from './admin/athlete/athlete-coach/athlete-coach.component';
import { CoachAthleteComponent } from './admin/coach/coach-athlete/coach-athlete.component';
import { AutoConnectComponent } from './auth/auto-connect/auto-connect.component';
import {AthleteStatsEnergySystemsComponent} from "./admin/athlete/athlete-stats/athlete-stats-energy-systems/athlete-stats-energy-systems.component";
import {AthleteTeamComponent} from "./admin/athlete/athlete-team/athlete-team.component";
import {CoachDashboardPlanningComponent} from "./admin/coach/coach-dashboard/coach-dashboard-planning/coach-dashboard-planning.component";
import {CoachDashboardPerformanceComponent} from "./admin/coach/coach-dashboard/coach-dashboard-performance/coach-dashboard-performance.component";
import {CoachDashboardWellnessComponent} from "./admin/coach/coach-dashboard/coach-dashboard-wellness/coach-dashboard-wellness.component";
import {AthletePerformanceComponent} from "./admin/athlete/athlete-performance/athlete-performance.component";
import {AthleteWellnessComponent} from "./admin/athlete/athlete-wellness/athlete-wellness.component";

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
    },{
        path: 'connect-as/:token',
        component: AutoConnectComponent
    }]
}, {
    path: 'coach',
    component: CoachComponent,
    canActivate: [AuthGuard],
    children: [{
            path: 'dashboard',
            component: CoachDashboardComponent,
            children: [
              {
                  path: '',
                  component: CoachDashboardPlanningComponent
              },{
                  path: 'performance',
                  component: CoachDashboardPerformanceComponent
              },{
                  path: 'wellness',
                  component: CoachDashboardWellnessComponent
              }
            ]
        },{
            path: 'athlet',
            component: CoachAthleteComponent,
            children: [
                {
                    path: 'dashboard',
                    component: CoachAthleteLeadboardComponent
                }, {
                    path: 'profile',
                    component: CoachAthleteProfileComponent,
                    children: [
                        {
                            path: '',
                            component: AthleteProfileReadinessComponent,
                            data: {
                                isCoach: true,
                                isAthlet: false,
                            }
                        },{
                            path: 'performance',
                            component: AthleteProfilePerformanceComponent,
                            data: {
                                isCoach: true,
                                isAthlet: false,
                            }
                        }
                    ]
                },{
                    path: 'calendar',
                    component: CoachAthleteCalendarComponent
                },{
                    path: 'stats',
                    component: CoachAthleteStatsComponent,
                    children: [
                      {
                        path: '',
                        component: AthleteStatsFatigueManagementComponent,
                        data: {
                          isCoach: true,
                          isAthlet: false,
                        }
                      },
                      {
                        path: 'overload',
                        component: AthleteStatsTrainingOverloadComponent,
                        data: {
                          isCoach: true,
                          isAthlet: false,
                        }
                      },
                      {
                        path: 'energy',
                        component: AthleteStatsEnergySystemsComponent,
                        data: {
                          isCoach: true,
                          isAthlet: false,
                        }
                      }
                    ]
                }
            ],
        },{
            path: 'clients',
            component: CoachClientsComponent
        },{
            path: 'programs',
            component: CoachProgramsComponent
        },{
            path: 'programs/:programId',
            component: CoachProgramsDetailComponent
        },{
            path: 'settings',
            component: CoachSettingsComponent,
            children: [{
                path: 'profile',
                component: CoachSettingsProfileComponent
              },{
                path: 'password',
                component: CoachSettingsPasswordComponent
              },{
                path: 'plan',
                component: CoachSettingsPlanComponent
            }]
        },{
            path: 'stats',
            component: AthleteStatsComponent
    }]
}, {
    path: 'athlete',
    component: AthleteComponent,
    canActivate: [AuthGuard],
    children: [{
        path: 'dashboard',
        component: AthleteDashboardComponent
      }, {
        path: 'team',
        component: AthleteTeamComponent
      }, {
        path: 'performance',
        component: AthletePerformanceComponent
      },{
        path: 'wellness',
        component: AthleteWellnessComponent
      },{
        path: 'profile',
        component: AthleteProfileComponent,
        children: [
            {
                path: '',
                component: AthleteProfileReadinessComponent,
                data: {
                    isCoach: false,
                    isAthlet: true,
                }
            },{
                path: 'performance',
                component: AthleteProfilePerformanceComponent,
                data: {
                    isCoach: false,
                    isAthlet: true,
                }
            }
        ]
      },{
        path: 'calendar',
        component: AthleteCalendarComponent
      },{
        path: 'programs',
        component: AthleteProgramsComponent
      },{
        path: 'coach',
        component: AthleteCoachComponent
      },{
        path: 'programs/:programId',
        component: AthleteProgramsDetailComponent
      },{
        path: 'settings',
        component: AthleteSettingsComponent,
        children: [{
            path: 'profile',
            component: AthleteSettingsProfileComponent
          },{
            path: 'password',
            component: AthleteSettingsPasswordComponent
          },{
            path: 'plan',
            component: AthleteSettingsPlanComponent
        }]
      },{
        path: 'stats',
        component: AthleteStatsComponent,
        children: [{
            path: '',
            component: AthleteStatsFatigueManagementComponent,
            data: {
              isCoach: false,
              isAthlet: true,
            }
          },{
            path: 'overload',
            component: AthleteStatsTrainingOverloadComponent,
            data: {
              isCoach: false,
              isAthlet: true,
            }
          },
          {
            path: 'energy',
            component: AthleteStatsEnergySystemsComponent,
            data: {
              isCoach: false,
              isAthlet: true,
            }
          }]
    }]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
