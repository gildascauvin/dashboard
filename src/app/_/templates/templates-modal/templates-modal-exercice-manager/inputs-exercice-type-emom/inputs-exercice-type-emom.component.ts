import { Component, OnInit } from "@angular/core";
import {InputsExerciceComponent} from "../inputs-exercice.component";

@Component({
  selector: "tpc-inputs-exercice-type-emom",
  templateUrl: "./inputs-exercice-type-emom.component.html",
  styleUrls: ["./inputs-exercice-type-emom.component.scss"],
})
export class InputsExerciceTypeEmomComponent extends InputsExerciceComponent implements OnInit {

  typeChoice: number = 5;

  ngOnInit(): void {
    this.model.emom_scoring = this.model.emom_scoring || 1;
    this.model.emom_duration = this.model.emom_duration || 9;
    this.model.emom_seconds = this.model.emom_seconds || 60;

    this._initMax();
  }

  onTypeChoiceChanged(event) {
    let name = event === 3 ? "AMRAP" : event === 4 ? "For time" : "EMOM";

    this.model.type = {
      id: event,
      name: name,
    };
  }
}
