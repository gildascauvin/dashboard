export class StandardDeviationCore {

  static standardDeviation (array) {
    return Math.sqrt(StandardDeviationCore.variance(array));
  };

  static variance (array) {
    let mean = StandardDeviationCore.mean(array, false);
    return StandardDeviationCore.mean(array.map(function (num) {
      return Math.pow(num - mean, 2);
    }), true);
  };

  static mean (array, usePopulation) {
    return StandardDeviationCore.sum(array) / (array.length - (usePopulation === true ? 1 : 0));
  };

  static sum (array) {
    let num = 0;
    for (let i = 0, l = array.length; i < l; i++) num += array[i];
    return num;
  };
}
