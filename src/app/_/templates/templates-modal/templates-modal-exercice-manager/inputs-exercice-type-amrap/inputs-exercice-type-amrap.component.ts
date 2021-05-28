import { Component } from "@angular/core";
import {InputsExerciceComponent} from "../inputs-exercice.component";

@Component({
  selector: "tpc-inputs-exercice-type-amrap",
  templateUrl: "./inputs-exercice-type-amrap.component.html",
  styleUrls: ["./inputs-exercice-type-amrap.component.scss"],
})
export class InputsExerciceTypeAmrapComponent extends InputsExerciceComponent {

  typeChoice: number = 3;

  onTypeChoiceChanged(event) {
    let name = event === 3 ? "AMRAP" : event === 4 ? "For time" : "EMOM";

    this.model.type = {
      id: event,
      name: name,
    };
  }
}
