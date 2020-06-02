import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ChartsModule } from 'ng2-charts';
import { DndModule } from 'ng2-dnd';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { NgxCaptchaModule } from 'ngx-captcha';

// import 'hammerjs';

import { AutocompleteLibModule } from 'angular-ng-autocomplete';

import { JwtInterceptor } from './_/services/http/jwt.interceptor';

import { DoorgetsTranslateModule , NgTranslate, NgTranslateAbstract } from 'doorgets-ng-translate';

export function newNgTranslate(http: HttpClient) {
  return new NgTranslate(http, '../../assets/locale');
}

import { AuthGuard } from './auth.service';

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
import { ConfirmAccountComponent } from './auth/confirm-account/confirm-account.component';
import { AccountNotConfirmedComponent } from './auth/account-not-confirmed/account-not-confirmed.component';

import { TemplatesModalEditComponent } from './_/templates/templates-modal/templates-modal-edit/templates-modal-edit.component';
import { TemplatesModalWorkoutDeleteComponent } from './_/templates/templates-modal/templates-modal-workout-delete/templates-modal-workout-delete.component';
import { TemplatesModalExerciceDeleteComponent } from './_/templates/templates-modal/templates-modal-exercice-delete/templates-modal-exercice-delete.component';
import { TemplatesModalExerciceManagerComponent } from './_/templates/templates-modal/templates-modal-exercice-manager/templates-modal-exercice-manager.component';

import { TemplatesModalCreateComponent } from './_/templates/templates-modal/templates-modal-create/templates-modal-create.component';
import { TemplatesModalDeleteComponent } from './_/templates/templates-modal/templates-modal-delete/templates-modal-delete.component';


import { InputsExerciceTypeSimpleComponent } from './_/templates/templates-modal/templates-modal-exercice-manager/inputs-exercice-type-simple/inputs-exercice-type-simple.component';
import { InputsExerciceTypeComplexComponent } from './_/templates/templates-modal/templates-modal-exercice-manager/inputs-exercice-type-complex/inputs-exercice-type-complex.component';
import { InputsExerciceTypeAmrapComponent } from './_/templates/templates-modal/templates-modal-exercice-manager/inputs-exercice-type-amrap/inputs-exercice-type-amrap.component';
import { InputsExerciceTypeTimeComponent } from './_/templates/templates-modal/templates-modal-exercice-manager/inputs-exercice-type-time/inputs-exercice-type-time.component';
import { InputsExerciceTypeEmomComponent } from './_/templates/templates-modal/templates-modal-exercice-manager/inputs-exercice-type-emom/inputs-exercice-type-emom.component';
import { InputsExerciceTypeOpenComponent } from './_/templates/templates-modal/templates-modal-exercice-manager/inputs-exercice-type-open/inputs-exercice-type-open.component';
import { InputsExerciceTypeCardioComponent } from './_/templates/templates-modal/templates-modal-exercice-manager/inputs-exercice-type-cardio/inputs-exercice-type-cardio.component';
import { InputsExerciceTypeCustomComponent } from './_/templates/templates-modal/templates-modal-exercice-manager/inputs-exercice-type-custom/inputs-exercice-type-custom.component';

import { InputAutocompleteComponent } from './_/components/forms/input-autocomplete/input-autocomplete.component';
import { AutofocusDirective } from './_/directives/autofocus.directive';

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
    ConfirmAccountComponent,
    AccountNotConfirmedComponent,
    TemplatesModalEditComponent,
    TemplatesModalWorkoutDeleteComponent,
    TemplatesModalExerciceDeleteComponent,
    TemplatesModalExerciceManagerComponent,
    TemplatesModalCreateComponent,
    TemplatesModalDeleteComponent,
    InputsExerciceTypeSimpleComponent,
    InputsExerciceTypeComplexComponent,
    InputsExerciceTypeAmrapComponent,
    InputsExerciceTypeTimeComponent,
    InputsExerciceTypeEmomComponent,
    InputsExerciceTypeOpenComponent,
    InputsExerciceTypeCardioComponent,
    InputsExerciceTypeCustomComponent,
    InputAutocompleteComponent,
    AutofocusDirective,
  ],
  imports: [
    FormsModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    NgxDnDModule,
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AutocompleteLibModule,
    ChartsModule,
    CommonModule,
    DndModule.forRoot(),
    DoorgetsTranslateModule.forRoot({
      provide: NgTranslateAbstract,
      useFactory: (newNgTranslate),
      deps: [HttpClient]
    }),
    PasswordStrengthMeterModule,
    NgxCaptchaModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
