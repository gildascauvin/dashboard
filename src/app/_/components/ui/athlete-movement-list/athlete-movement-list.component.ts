import { Component, Input, OnInit } from '@angular/core';
import {webConfig} from "../../../../web-config";

@Component({
  selector: 'app-athlete-movement-list',
  templateUrl: './athlete-movement-list.component.html',
  styleUrls: ['./athlete-movement-list.component.scss'],
})
export class AthleteMovementListComponent implements OnInit {
  @Input() exercice: any = [];
  @Input() hideLocalBox : boolean = false;
  @Input() class: string = null;

  configExercices: any = webConfig.exercices;

  constructor() { }

  ngOnInit(): void {}

  getCardioUnitLabel(key) {
    const labelObj = this.configExercices.unit.find(obj => obj.id == key);

    if (labelObj) {
      return labelObj.name;
    }

    return '';
  }
}
