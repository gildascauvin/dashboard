import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

@Component({
  selector: 'tpc-input-autocomplete',
  templateUrl: './input-autocomplete.component.html',
  styleUrls: ['./input-autocomplete.component.scss']
})
export class InputAutocompleteComponent implements OnInit {
	keyword = 'name';

	@Input() type = "normal";
  @Input() data = [];
  @Input() label = 'Search movement';
	@ViewChild('auto') auto;
  @Output() onSelectedItem: EventEmitter<any> = new EventEmitter();
	@Output() handleOnChangeSearch: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  	console.log('InputAutocompleteComponent', this.data);
  }

  selectEvent(item) {
  	this.onSelectedItem.emit(item);
  	this.auto.clear();
  }

  onChangeSearch(val: string) {
    this.handleOnChangeSearch.emit(val);
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e){
    // do something when input is focused
  }
}
