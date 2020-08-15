import { Injectable, EventEmitter } from '@angular/core';

import { Observable } from "rxjs/Observable";

import { HttpService } from '../http/http.service';
import { AuthService } from '../http/auth.service';

import { webConfig } from '../../../web-config';


@Injectable({
  providedIn: 'root'
})
export class UserService {

	user: any = {};
	userClient: any = {};

  onUpdate: EventEmitter<any> = new EventEmitter();
  onWorkoutSaved: EventEmitter<any> = new EventEmitter();

	constructor(private apiService: HttpService) {}

	getUserInfos(reload?) {
		let user: string = localStorage.getItem(webConfig.prefixApp + 'user');
		if (user) {
			this.user = JSON.parse(user);
		}

		if (reload) {
			this.apiService.get('user').subscribe((user) => {
			 	return this.initUserInfos(user);
			});
		}

		return this;
	}

	update(userData) {
		let dataToPatch = userData;

	  return this.apiService
			.patch('user', dataToPatch)
			.map(() => {
				return this.apiService.get('user').subscribe((user) => {
				 	return this.initUserInfos(user);
				});
			});
	}

	initUserInfos(user) {
		if (!user) {
			return this;
		}

		this.user = user || {};

		this._saveIntoLocalStorage();
		return this;
	}

	initUserClientInfos(userClient) {
		if (!userClient) {
			return this;
		}

		this.userClient = userClient || {};

		this._saveClientIntoLocalStorage();
		return this;
	}

	updateUserInfos() {
		this._saveIntoLocalStorage();
		return this;
	}

	private _saveIntoLocalStorage() {
		localStorage.setItem(webConfig.prefixApp + 'user', JSON.stringify(this.user));
		this.onUpdate.emit(true);
	}

	private _saveClientIntoLocalStorage() {
		localStorage.setItem(webConfig.prefixApp + 'user_client', JSON.stringify(this.userClient));
		this.onUpdate.emit(true);
	}
}
