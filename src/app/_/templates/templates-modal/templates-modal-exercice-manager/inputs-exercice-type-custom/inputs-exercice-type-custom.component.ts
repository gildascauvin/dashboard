import { Component, OnInit, Input } from '@angular/core';
import { webConfig } from '../../../../../web-config';

@Component({
  selector: 'tpc-inputs-exercice-type-custom',
  templateUrl: './inputs-exercice-type-custom.component.html',
  styleUrls: ['./inputs-exercice-type-custom.component.scss']
})
export class InputsExerciceTypeCustomComponent implements OnInit {
	@Input() model: any = {};
	@Input() isPlanning: boolean = false;
  @Input() profil: any[] = [];


  configExercices: any = webConfig.exercices;

  constructor() { }

  ngOnInit(): void {
  	this.model.custom_scoring = this.model.custom_scoring || 0;
  }

}
