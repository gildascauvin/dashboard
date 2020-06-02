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
      size: 10,
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

  getProgram(id) {
    return this.httpService.get(`program/one/${id}`);
  }

  getOne(id) {
    return this.httpService.get(`user/${id}`);
  }

  createUserProfile(id, model) {
    return this.httpService.post(`user/${id}/profile`, model);
  }

  updateUserProfile(id, model) {
    return this.httpService.put(`user/${id}/profile/${model.user_profile_id}`, model);
  }

  removeUserProfile(id, model) {
    return this.httpService.delete(`user/${id}/profile/${model.user_profile_id}`);
  }

  createUser(model) {
    return this.httpService.post(`user`, model);
  }

  updateUser(id, model) {
    return this.httpService.put(`user/${id}`, model);
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

  activeClientToProgram(userId, programId, clientId, isActive){
    let model = {
      is_active: !!isActive
    };
    return this.httpService.post(`user/${userId}/program/${programId}/client/${clientId}`, model);
  }

  createWorkout(model) {
    return this.httpService.post(`workout`, model);
  }
}
