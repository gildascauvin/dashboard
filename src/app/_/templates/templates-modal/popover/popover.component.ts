import { Component, Input } from '@angular/core';

@Component({
  selector: 'popover',
  templateUrl: 'popover.component.html',
    styleUrls: ['./popover.component.scss']
})

export class PopoverComponent{
    @Input() movement:any;
}