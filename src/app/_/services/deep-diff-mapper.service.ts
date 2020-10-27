import { Injectable } from "@angular/core";
import { isEqual, isObject, transform } from "lodash";

@Injectable({
  providedIn: "root",
})
export class DeepDiffMapperService {
  difference(object, base): any[] {
    return transform(object, (result, value, key) => {
      if (base && !isEqual(value, base[key])) {
        result[key] =
          isObject(value) && isObject(base[key])
            ? this.difference(value, base[key])
            : value;
      }
    });
  }
}
