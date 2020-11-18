import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class MovementService {
  constructor() {}

  isShowRepMax(movement) {
    const excludeEquipement = [
      "none",
      "other",
      "medicine ball",
      "mat",
      "foam roll",
      "exercice ball",
      "bosu ball",
      "bodyweight",
      "bands",
    ];

    return (
      movement.has_repmax &&
      movement.category_id !== 9 &&
      movement.category_id !== 8 &&
      !excludeEquipement.find((element) => element === movement.equipments)
    );
  }
}
