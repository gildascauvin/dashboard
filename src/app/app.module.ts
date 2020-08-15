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

import { UnitSizeLabelPipe } from './_/pipes/unit-size-label.pipe';
import { RatioMovementPipe } from './_/pipes/ratio-movement.pipe';

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
import { AthleteProgramsComponent } from './admin/athlete/athlete-programs/athlete-programs.component';
import { AthleteProgramsDetailComponent } from './admin/athlete/athlete-programs/athlete-programs-detail/athlete-programs-detail.component';

import { CoachComponent } from './admin/coach/coach.component';
import { CoachCalendarComponent } from './admin/coach/coach-calendar/coach-calendar.component';
import { CoachDashboardComponent } from './admin/coach/coach-dashboard/coach-dashboard.component';
import { CoachProgramsComponent } from './admin/coach/coach-programs/coach-programs.component';
import { CoachSettingsComponent } from './admin/coach/coach-settings/coach-settings.component';
import { CoachNotificationsComponent } from './admin/coach/coach-notifications/coach-notifications.component';

import { CoachAthleteProfileComponent } from './admin/coach/coach-athlete/coach-athlete-profile/coach-athlete-profile.component';
import { CoachAthleteStatsComponent } from './admin/coach/coach-athlete/coach-athlete-stats/coach-athlete-stats.component';
import { CoachAthleteCalendarComponent } from './admin/coach/coach-athlete/coach-athlete-calendar/coach-athlete-calendar.component';
import { CoachAthleteLeadboardComponent } from './admin/coach/coach-athlete/coach-athlete-leadboard/coach-athlete-leadboard.component';
import { CoachAthleteComponent } from './admin/coach/coach-athlete/coach-athlete.component';

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

import { UsersModalProgramCreateComponent } from './_/templates/programs/users-modal-program-create/users-modal-program-create.component';
import { UsersModalProgramEditComponent } from './_/templates/programs/users-modal-program-edit/users-modal-program-edit.component';
import { UsersModalProgramDeleteComponent } from './_/templates/programs/users-modal-program-delete/users-modal-program-delete.component';
import { UsersModalProgramAthleteManagerComponent } from './_/templates/programs/users-modal-program-athlete-manager/users-modal-program-athlete-manager.component';
import { UsersModalProgramDuplicateComponent } from './_/templates/programs/users-modal-program-duplicate/users-modal-program-duplicate.component';
import { UsersModalProgramAssignComponent } from './_/templates/programs/users-modal-program-assign/users-modal-program-assign.component';
import { UsersModalProgramAthleteManagerMeComponent } from './_/templates/programs/users-modal-program-athlete-manager-me/users-modal-program-athlete-manager-me.component';

import { InputAutocompleteComponent } from './_/components/forms/input-autocomplete/input-autocomplete.component';
import { AutofocusDirective } from './_/directives/autofocus.directive';
import { AthleteProfileModalProfileCreateComponent } from './admin/athlete/athlete-profile/athlete-profile-modal/athlete-profile-modal-profile-create/athlete-profile-modal-profile-create.component';
import { AthleteProfileModalProfileEditComponent } from './admin/athlete/athlete-profile/athlete-profile-modal/athlete-profile-modal-profile-edit/athlete-profile-modal-profile-edit.component';
import { AthleteProfileModalProfileDeleteComponent } from './admin/athlete/athlete-profile/athlete-profile-modal/athlete-profile-modal-profile-delete/athlete-profile-modal-profile-delete.component';
import { CustomerStatsComponent } from './_/components/ui/customer-stats/customer-stats.component';
import { CustomerStatsRangeComponent } from './_/components/ui/customer-stats-range/customer-stats-range.component';
import { CustomerStatsExerciceComponent } from './_/components/ui/customer-stats-exercice/customer-stats-exercice.component';
import { AthleteSettingsComponent } from './admin/athlete/athlete-settings/athlete-settings.component';
import { AthleteSettingsPlanComponent } from './admin/athlete/athlete-settings/athlete-settings-plan/athlete-settings-plan.component';
import { AthleteSettingsProfileComponent } from './admin/athlete/athlete-settings/athlete-settings-profile/athlete-settings-profile.component';
import { AthleteSettingsPasswordComponent } from './admin/athlete/athlete-settings/athlete-settings-password/athlete-settings-password.component';

import { CoachClientsComponent } from './admin/coach/coach-clients/coach-clients.component';
import { CoachProgramsDetailComponent } from './admin/coach/coach-programs/coach-programs-detail/coach-programs-detail.component';
import { CoachSettingsPlanComponent } from './admin/coach/coach-settings/coach-settings-plan/coach-settings-plan.component';
import { CoachSettingsProfileComponent } from './admin/coach/coach-settings/coach-settings-profile/coach-settings-profile.component';
import { CoachSettingsPasswordComponent } from './admin/coach/coach-settings/coach-settings-password/coach-settings-password.component';

import { UsersModalInvitationCreateComponent } from './admin/coach/coach-clients/coach-clients-modal/users-modal-invitation-create/users-modal-invitation-create.component';
import { UsersModalInvitationDeleteComponent } from './admin/coach/coach-clients/coach-clients-modal/users-modal-invitation-delete/users-modal-invitation-delete.component';

import { AthleteCoachComponent } from './admin/athlete/athlete-coach/athlete-coach.component';

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
    AthleteProgramsComponent,
    UsersModalProgramCreateComponent,
    UsersModalProgramEditComponent,
    UsersModalProgramDeleteComponent,
    UsersModalProgramAthleteManagerComponent,
    UsersModalProgramAthleteManagerMeComponent,
    UsersModalProgramDuplicateComponent,
    UsersModalProgramAssignComponent,
    AthleteProgramsDetailComponent,
    AthleteProfileModalProfileCreateComponent,
    AthleteProfileModalProfileEditComponent,
    AthleteProfileModalProfileDeleteComponent,
    CustomerStatsComponent,
    CustomerStatsRangeComponent,
    CustomerStatsExerciceComponent,
    AthleteSettingsComponent,
    AthleteSettingsPlanComponent,
    AthleteSettingsProfileComponent,
    AthleteSettingsPasswordComponent,
    UnitSizeLabelPipe,
    RatioMovementPipe,
    CoachClientsComponent,
    CoachProgramsDetailComponent,
    CoachSettingsPlanComponent,
    CoachSettingsProfileComponent,
    CoachSettingsPasswordComponent,
    UsersModalInvitationCreateComponent,
    UsersModalInvitationDeleteComponent,
    AthleteCoachComponent,
    CoachAthleteLeadboardComponent,
    CoachAthleteComponent
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
