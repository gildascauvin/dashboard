import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DoorgetsTranslateModule , NgTranslate, NgTranslateAbstract } from 'doorgets-ng-translate';

export function newNgTranslate(http: HttpClient) {
  return new NgTranslate(http, '../../assets/locale');
}

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PasswordForgotComponent } from './auth/password-forgot/password-forgot.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';

import { AthleteComponent } from './admin/athlete/athlete.component';
import { AthleteDashboardComponent } from './admin/athlete/athlete-dashboard/athlete-dashboard.component';
import { AthleteProfileComponent } from './admin/athlete/athlete-profile/athlete-profile.component';
import { AthleteStatsComponent } from './admin/athlete/athlete-stats/athlete-stats.component';
import { AthleteCalendarComponent } from './admin/athlete/athlete-calendar/athlete-calendar.component';

import { CoachComponent } from './admin/coach/coach.component';
import { CoachCalendarComponent } from './admin/coach/coach-calendar/coach-calendar.component';
import { CoachDashboardComponent } from './admin/coach/coach-dashboard/coach-dashboard.component';
import { CoachProgramsComponent } from './admin/coach/coach-programs/coach-programs.component';
import { CoachAthletesComponent } from './admin/coach/coach-athletes/coach-athletes.component';
import { CoachSettingsComponent } from './admin/coach/coach-settings/coach-settings.component';
import { CoachNotificationsComponent } from './admin/coach/coach-notifications/coach-notifications.component';

import { CoachAthleteProfileComponent } from './admin/coach/coach-athlete-profile/coach-athlete-profile.component';
import { CoachAthleteStatsComponent } from './admin/coach/coach-athlete-stats/coach-athlete-stats.component';
import { CoachAthleteCalendarComponent } from './admin/coach/coach-athlete-calendar/coach-athlete-calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    PasswordForgotComponent,
    PasswordResetComponent,
    CoachComponent,
    AthleteComponent,
    AthleteDashboardComponent,
    AthleteProfileComponent,
    AthleteStatsComponent,
    AthleteCalendarComponent,
    CoachCalendarComponent,
    CoachDashboardComponent,
    CoachProgramsComponent,
    CoachAthletesComponent,
    CoachSettingsComponent,
    CoachNotificationsComponent,
    CoachAthleteProfileComponent,
    CoachAthleteStatsComponent,
    CoachAthleteCalendarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DoorgetsTranslateModule.forRoot({
      provide: NgTranslateAbstract,
      useFactory: (newNgTranslate),
      deps: [HttpClient]
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
