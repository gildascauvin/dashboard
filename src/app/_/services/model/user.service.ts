import { Injectable, EventEmitter } from '@angular/core';

import { Observable } from "rxjs/Observable";

import { HttpService } from '../http/http.service';
import { AuthService } from '../http/auth.service';

import { webConfig } from '../../../web-config';

let config = {
  baseApi: webConfig.baseApi + 'api/',
  prefixApp: 'dg_'
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

	user: any = {};

  onUpdate: EventEmitter<any> = new EventEmitter();

	constructor(private apiService: HttpService) {}

	getUserInfos(reload?) {
		let user: string = localStorage.getItem(config.prefixApp + 'user');
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

	updateUserInfos() {
		console.log('updateUserInfos this.user');
		this._saveIntoLocalStorage();
		return this;
	}

	private _saveIntoLocalStorage() {
		localStorage.setItem(config.prefixApp + 'user', JSON.stringify(this.user));
		this.onUpdate.emit(true);
	}
}
