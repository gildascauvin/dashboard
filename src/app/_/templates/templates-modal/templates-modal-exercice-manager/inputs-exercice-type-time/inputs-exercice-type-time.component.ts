import { Component, OnInit } from "@angular/core";
import * as _ from "lodash";
import {InputsExerciceComponent} from "../inputs-exercice.component";

@Component({
  selector: "tpc-inputs-exercice-type-time",
  templateUrl: "./inputs-exercice-type-time.component.html",
  styleUrls: ["./inputs-exercice-type-time.component.scss"],
})
export class InputsExerciceTypeTimeComponent extends InputsExerciceComponent implements OnInit {

  varyingStyle: any[] = [12, 8, 5];
  typeChoice: number = 4;

  ngOnInit(): void {
    this.model.time_style = this.model.time_style || 1;
    this.model.time_style_fixed = this.model.time_style_fixed || 3;
    this.model.time_style_varying = this.model.time_style_varying || "12 8 5";
    this._initMax();
  }

  onTypeChoiceChanged(event) {
    let name = event === 3 ? "AMRAP" : event === 4 ? "For time" : "EMOM";

    this.model.type = {
      id: event,
      name: name,
    };
  }

  updateVaryingStyle(value) {
    this.varyingStyle =
      (value &&
        value
          .replace(",", " ")
          .replace("-", " ")
          .replace(";", " ")
          .replace("_", " ")
          .split(" ")
          .filter((el) => {
            let res = parseInt("" + el) || null;
            if (res) {
              return res;
            }
          })) ||
      [];
  }
}
