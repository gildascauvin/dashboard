import { Injectable, EventEmitter } from '@angular/core';
import { HttpService } from '../../_/services/http/http.service';
import { HttpParams } from '@angular/common/http';

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

  getAllUserWorkouts(userId) {
    return this.httpService.get(`workout/client/user/${userId}`);
  }

  getAllClientWorkout(clientId, date?) {
    let page: any = {
      totalElements: 0,
      pageNumber: 0,
      size: 500,
    };

    if (date) {
      page.date = date;
    }

    return this.httpService.get(`workout/client/${clientId}?page=${page.pageNumber}&size=${page.size}&date=${page.date}`);
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

  getAllClientWorkouts(clientId, fromDate, toDate, strictDate?) {
    let page: any = {
      totalElements: 0,
      pageNumber: 0,
      size: 500,
    };

    let query = `workout/client/${clientId}?page=${page.pageNumber}&size=${page.size}&date=${fromDate}&date_end=${toDate}`;
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

  getUserClient(clientId) {
    return this.httpService.get(`user/${clientId}`);
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

  createClient(model) {
    return this.httpService.post(`user/client`, model);
  }

  updateClientUser(model) {
    return this.httpService.put(`user/client/${model.id}`, model);
  }

  removeClient(clientId) {
    return this.httpService.delete(`user/client/${clientId}`);
  }

  createClientUserProfile(model) {
    return this.httpService.post(`client/user/${model.user_id}/profile`, model);
  }

  updateClientUserProfile(model) {
    return this.httpService.put(`client/user/${model.user_id}/profile/${model.user_profile_id}`, model);
  }

  removeClientUserProfile(model) {
    return this.httpService.delete(`client/user/${model.user_id}/profile/${model.user_profile_id}`);
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

  responseInvitation(model) {
    return this.httpService.post(`user/client/${model.user_client_id}/response`, model);
  }

  // activeClientToProgram(userId, programId, clientId, isActive, dateStart?, dayStart?){
  //   let model = {
  //     is_active: !!isActive
  //   };
  //   return this.httpService.post(`program/${programId}/client/${clientId}`, model);
  // }

  activeClientToProgram(userId, programId, clientId, isActive, dateStart, dayStart){
    let model = {
      is_active: !!isActive,
      started_at: dateStart,
      started_day: parseInt('' + dayStart),
    };

    return this.httpService.post(`program/${programId}/client/${clientId}`, model);
  }

  activeClientToProgramToMe(programId, clientId, isActive, dateStart?, dayStart?){
    let model = {
      is_active: !!isActive,
      started_at: dateStart,
      started_day: dayStart && parseInt('' + dayStart),
    };

    return this.httpService.post(`program/${programId}/client/${clientId}`, model);
  }

  createWorkout(model) {
    return this.httpService.post(`workout`, model);
  }

  updateWorkout(model) {
    return this.httpService.put(`workout/${model.workout_id}`, model);
  }

  removeWorkout(id) {
    return this.httpService.delete(`workout/${id}`);
  }

  createClientWorkout(model) {
    return this.httpService.post(`workout/client/${model.user_id}`, model);
  }

  updateClientWorkout(model) {
    return this.httpService.put(`workout/client/${model.workout_id}`, model);
  }

  removeClientWorkout(workoutId) {
    return this.httpService.delete(`workout/client/${workoutId}`);
  }
}
