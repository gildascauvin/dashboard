import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {DoorgetsTranslateService} from "doorgets-ng-translate";

@Component({
  selector: 'tpc-input-autocomplete',
  templateUrl: './input-autocomplete.component.html',
  styleUrls: ['./input-autocomplete.component.scss']
})
export class InputAutocompleteComponent implements OnInit {
  keyword = 'name';

  @Input() type = "normal";
  @Input() clear = true;
  @Input() data = [];
  @Input() label = '';

  @ViewChild('auto') auto;
  @Output() onSelectedItem: EventEmitter<any> = new EventEmitter();
  @Output() onCleared: EventEmitter<any> = new EventEmitter();
  @Output() handleOnChangeSearch: EventEmitter<any> = new EventEmitter();

  constructor(private doorgetsTranslateService: DoorgetsTranslateService) { }

  ngOnInit(): void {
    this.label = this.doorgetsTranslateService.instant("#Search movement");
  }

  selectEvent(item) {
    this.onSelectedItem.emit(item);
    if (this.clear) {
      this.auto.clear();
    }
  }

  onInputCleared() {
    this.onCleared.emit({});
  }

  onChangeSearch(val: string) {
    this.handleOnChangeSearch.emit(val);
  }

  onFocused(e){
  }
}
