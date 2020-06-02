import { Injectable, EventEmitter } from '@angular/core';
import { HttpService } from '../../_/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {
  onListUpdated: EventEmitter<any> = new EventEmitter();
  onTemplateUpdated: EventEmitter<any> = new EventEmitter();
  onTemplateReset: EventEmitter<any> = new EventEmitter();
  onWorkoutsGroupReset: EventEmitter<any> = new EventEmitter();

  constructor(private httpService: HttpService) {}

  getAll(page?) {
    page = page || {
      totalElements: 0,
      pageNumber: 0,
      size: 10,
      query: ''
    };

    return this.httpService.get(`template/?page=${page.pageNumber}&size=${page.size}&query=${page.query}`);
  }

  get(id) {
    return this.httpService.get(`template/${id}`);
  }

  create(model) {
    return this.httpService.post(`template`, model);
  }

  update(model) {
    return this.httpService.put(`template/${model.template_id}`, model);
  }

  remove(model) {
    return this.httpService.delete(`template/${model.template_id}`);
  }
}
