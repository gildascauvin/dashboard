import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-athlete-movement-list-unit-label',
  templateUrl: './athlete-movement-list-unit-label.component.html',
  styleUrls: ['./athlete-movement-list-unit-label.component.scss'],
})
export class AthleteMovementListUnitLabelComponent implements OnInit {
  @Input() set: any = [];

  constructor() { }

  ngOnInit(): void {}
}
