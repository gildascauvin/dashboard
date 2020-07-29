import { Injectable, EventEmitter } from '@angular/core';
import { HttpService } from '../../_/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  onListUpdated: EventEmitter<any> = new EventEmitter();
  onUserUpdated: EventEmitter<any> = new EventEmitter();
  onWorkoutSaved: EventEmitter<any> = new EventEmitter();

  constructor(private httpService: HttpService) {}

  getAll(page?) {
    page = page || {
      totalElements: 0,
      pageNumber: 0,
      size: 10,
      query: ''
    };

    return this.httpService.get(`user/?page=${page.pageNumber}&size=${page.size}&query=${page.query}`);
  }

  getAllRoles() {
    let page = {
      pageNumber: 0,
      size: 100,
    };

    return this.httpService.get(`role/?page=${page.pageNumber}&size=${page.size}`);
  }

  getAllMovements(val) {
    let page = {
      totalElements: 0,
      pageNumber: 0,
      size: 20,
      name: val
    };

    return this.httpService.get(`movement/?page=${page.pageNumber}&size=${page.size}&name=${page.name}`);
  }

  getAllTemplates(val) {
    let page = {
      totalElements: 0,
      pageNumber: 0,
      size: 10,
      name: val
    };

    return this.httpService.get(`template/?page=${page.pageNumber}&size=${page.size}&name=${page.name}`);
  }

  getAllWorkout(date?) {
    let page: any = {
      totalElements: 0,
      pageNumber: 0,
      size: 500,
    };

    if (date) {
      page.date = date;
    }

    return this.httpService.get(`workout/?page=${page.pageNumber}&size=${page.size}&date=${page.date}`);
  }

  getAllWorkouts(fromDate, toDate, strictDate?) {
    let page: any = {
      totalElements: 0,
      pageNumber: 0,
      size: 500,
    };

    let query = `workout/?page=${page.pageNumber}&size=${page.size}&date=${fromDate}&date_end=${toDate}`;
    query += strictDate
      ? '&strict_date=1'
      : '';
    return this.httpService.get(query);
  }

  getAllPrograms() {
    let page: any = {
      totalElements: 0,
      pageNumber: 0,
      size: 500,
    };

    return this.httpService.get(`program`);
  }

  getProgram(id) {
    return this.httpService.get(`program/${id}`);
  }

  getOne(id) {
    return this.httpService.get(`user/${id}`);
  }

  getUser() {
    return this.httpService.get(`user`);
  }

  createUserProfile(model) {
    return this.httpService.post(`user/profile`, model);
  }

  updateUserProfile(model) {
    return this.httpService.put(`user/profile/${model.user_profile_id}`, model);
  }

  removeUserProfile(model) {
    return this.httpService.delete(`user/profile/${model.user_profile_id}`);
  }

  createUser(model) {
    return this.httpService.post(`user`, model);
  }

  updateUser(model) {
    return this.httpService.put(`user`, model);
  }

  resetUserPassword(model) {
    return this.httpService.post(`user/reset-password`, model);
  }

  removeUser(id, model) {
    return this.httpService.delete(`user/${id}`);
  }

  createClient(id, model) {
    return this.httpService.post(`user/${id}/client`, model);
  }

  removeClient(id, clientId) {
    return this.httpService.delete(`user/${id}/client/${clientId}`);
  }

  createProgram(id, model) {
    model.user_id = id;
    return this.httpService.post(`program`, model);
  }

  updateProgram(model) {
    return this.httpService.put(`program/${model.program_id}`, model);
  }

  removeProgram(id, model) {
    return this.httpService.delete(`program/${model.program_id}`);
  }

  responseInvitation(id, invitationId, clientId, model) {
    return this.httpService.post(`user/${id}/client/${invitationId}/response/${clientId}`, model);
  }

  activeClientToProgram(userId, programId, clientId, isActive, dateStart?, dayStart?){
    let model = {
      is_active: !!isActive
    };
    return this.httpService.post(`user/${userId}/program/${programId}/client/${clientId}`, model);
  }

  activeClientToProgramToMe(programId, clientId, isActive, dateStart?, dayStart?){
    let model = {
      is_active: !!isActive
    };
    return this.httpService.post(`program/${programId}/client/${clientId}`, model);
  }

  // activeClientToProgram(userId, programId, clientId, isActive, dateStart, dayStart){
  //   let model = {
  //     is_active: !!isActive,
  //     started_at: dateStart,
  //     started_day: parseInt('' + dayStart),
  //   };

  //   console.log('model', model);
  //   return this.httpService.post(`user/${userId}/program/${programId}/client/${clientId}`, model);
  // }

  createWorkout(model) {
    return this.httpService.post(`workout`, model);
  }

  updateWorkout(model) {
    return this.httpService.put(`workout/${model.workout_id}`, model);
  }

  removeWorkout(id) {
    return this.httpService.delete(`workout/${id}`);
  }
}
