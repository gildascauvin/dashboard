import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getItem(keyName) {
  	let value = localStorage.getItem(keyName)
  	if (!value) {
  		return;
  	}

  	return JSON.parse(localStorage.getItem(keyName));
  }

  setItem(keyName, value) {
  	if (!value) {
  		return;
  	}

  	return localStorage.setItem(keyName,  JSON.stringify(value));
  }
}
