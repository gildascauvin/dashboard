import {Injectable} from '@angular/core';
import * as _ from "lodash";
import {addHours, differenceInDays, endOfWeek, format, startOfWeek} from "date-fns";
import {webConfig} from "../../../web-config";
import {ChartDataSets} from "chart.js";

@Injectable({
  providedIn: 'root'
})
export class CustomerStatsComputerService {

  categories: any = webConfig.categories;
  categoriesData: any = [];

  stats: any = {
    weekly: {
      volume: [],
      tonnage: [],
      distance: [],
      intensite: [],
      duration: [],
      rpe: [],

      realIntensite: [],
      realIntensiteSize: [],

      volumeRound: 0,
      tonnageRound: 0,
      distanceRound: 0,
      intensiteRound: 0,
    },
    categories: {},
    movements: {},
    cardioMvt: [],
    intervalMvt: [],
    cardio: {
      volume: [],
      intensity: [],
      distance: [],
    },
  };

  liveStats: any = {
    volume: 0,
    tonnage: 0,
    distance: 0,
    intensite: 0,
    intensiteSize: 0,
  };

  barChartData: ChartDataSets[] = [
    {
      data: this.stats.weekly.intensite,
      label: "Intensité",
      backgroundColor: "#cc0202",
      hoverBackgroundColor: "#cc0202",
      barPercentage: 0.5,
      maxBarThickness: 12,
    },
    {
      data: this.stats.weekly.volume,
      label: "Volume",
      backgroundColor: "#000000",
      hoverBackgroundColor: "#000000",
      barPercentage: 0.5,
      maxBarThickness: 12,
    },
    {
      data: this.stats.weekly.tonnage,
      label: "Tonnage",
      backgroundColor: "#C1C1C1",
      hoverBackgroundColor: "#C1C1C1",
      yAxisID: "y-axis-1",
      barPercentage: 0.5,
      maxBarThickness: 12,
    },
    {
      data: this.stats.weekly.distance,
      label: "Distance",
      backgroundColor: "#9953c9",
      hoverBackgroundColor: "#9953c9",
      yAxisID: "y-axis-1",
      barPercentage: 0.5,
      maxBarThickness: 12,
    },
  ];

  workouts: any = {};
  barChartLabels: any = {};
  movements: any = {};
  isLoading: boolean = false;
  isOneDay: boolean = false;
  tabs: any = [];
  movementsCustomer:any = [];

  computeStatsForAllClientWorkouts(workouts, forceDaily?, from?, to?)
  {
    this._clean();

    this.tabs = [];
    this.workouts = _.cloneDeep(workouts);

    this.barChartLabels = [];
    this.stats.movements = {};
    this.stats.cardioMvt = [];
    this.stats.intervalMvt = [];
    this.movements = [];

    let allKeys = Object.keys(workouts);
    let isEmpty = allKeys.length == 0;

    if (isEmpty || workouts.length == 0) {
      this._clean();
      return this;
    }

    if (!this.isOneDay) {
      let endWeekDay = endOfWeek(new Date(), {weekStartsOn: 1});
      let startWeekDay = startOfWeek(new Date(), {weekStartsOn: 1});
    }

    let dates = [];
    if (!isEmpty) {
      for (const property in workouts) {
        dates.push(property);
      }
      if (!this.isOneDay) {
        let endWeekDay = this._getMonday(new Date(dates[0]));
        let startWeekDay = endOfWeek(new Date(dates[dates.length - 1]), {
          weekStartsOn: 1,
        });
        let nbDays = 7;
        let diff = Math.abs(differenceInDays(startWeekDay, endWeekDay));
        let isDaily = (forceDaily && forceDaily == true) ? true : diff < 30;

        if (diff < nbDays) {
          diff = nbDays;
        }
        let currentDate = endWeekDay;

        if (from && to) {
          currentDate = from;
          diff = Math.abs(differenceInDays(from, to));
        }

        let modulo = isDaily ? 1 : 7;
        for (let i = 0; i < diff; i++) {
          if (i % modulo == 0) {
            let property = format(currentDate, "yyyy-MM-dd");
            let propertyKey = format(currentDate, "MM/dd");
            this.barChartLabels.push(propertyKey);

            this.tabs.push({
              stats: {intensite: 0, volume: 0, tonnage: 0, distance: 0,},
              date: property,
              workouts: [],
            });
          }

          currentDate = addHours(currentDate, 24);
        }
        if (isDaily) {
          this.tabs.map((part) => {
            this._initPart(part);
            return part;
          });
        } else {
          this.tabs.map((part) => {
            this._initPartWeek(part);
            return part;
          });
        }
      } else {
        let property = format(new Date(dates[0]), "yyyy-MM-dd");
        let propertyKey = format(new Date(dates[0]), "MM/dd");
        this.barChartLabels.push(propertyKey);

        const part = {
          stats: {
            intensite: 0,
            volume: 0,
            tonnage: 0,
            distance: 0,
          },
          date: property,
          workouts: [],
        };
        this._initPart(part);
      }
    }

    this.isLoading = false;

    return this;
  }

  computeStatsForAllWorkouts(workouts, forceDaily?, from?, to?) {

    this._clean();
    this.tabs = [];
    this.workouts = _.cloneDeep(workouts);

    this.barChartLabels = [];
    this.stats.movements = {};
    this.stats.cardioMvt = [];
    this.stats.intervalMvt = [];
    this.movements = [];

    let allKeys = Object.keys(workouts);
    let isEmpty = allKeys.length == 0;

    if (isEmpty || workouts.length == 0) {
      this._clean();
      return this;
    }

    let endWeekDay = endOfWeek(new Date(), { weekStartsOn: 1 });
    let startWeekDay = startOfWeek(new Date(), { weekStartsOn: 1 });

    let dates = [];
    if (!isEmpty) {
      for (const property in workouts) {
        dates.push(property);
      }

      endWeekDay = startOfWeek(new Date(dates[0]), { weekStartsOn: 1 });
      startWeekDay = endOfWeek(new Date(dates[dates.length - 1]), {
        weekStartsOn: 1,
      });
    }

    let nbDays = 7;
    let diff = Math.abs(differenceInDays(startWeekDay, endWeekDay));
    let isDaily = (forceDaily && forceDaily == true) ? true : diff < 30;

    if (diff < nbDays) {
      diff = nbDays;
    } else if (!forceDaily || forceDaily == false) {
      diff += 7;
    }

    let currentDate = endWeekDay;
    if (from && to) {
      currentDate = from;
      diff = Math.abs(differenceInDays(from, to));
    }

    let modulo = isDaily ? 1 : 7;

    for (let i = 0; i < diff; i++) {
      if (i % modulo == 0) {
        let property = format(currentDate, "yyyy-MM-dd");
        let propertyKey = format(currentDate, "MM/dd");
        this.barChartLabels.push(propertyKey);

        this.tabs.push({
          stats: {
            intensite: 0,
            volume: 0,
            tonnage: 0,
            distance: 0,
          },
          date: property,
          workouts: [],
        });
      }

      currentDate = addHours(currentDate, 24);
    }
    if (isDaily) {
      this.tabs.map((part) => {
        this._initPart(part);
        return part;
      });
    } else {
      this.tabs.map((part) => {
        this._initPartWeek(part);
        return part;
      });
    }

    this.isLoading = false;

    return this;
  }

  _initPart(part) {
    if (this.workouts[part.date]) {
      part.workouts = this.workouts[part.date];

      let volume = 0;
      let tonnage = 0;
      let distance = 0;
      let intensite = 0;
      let intensiteSize = 0;
      let parentId = 0;
      let duration = 0;
      let rpe = 0;

      let cardioVolume = 0;
      let cardioDistance = 0;
      let cardioIntensite = 0;
      let cardioIntensiteSize = 0;


      part.workouts.map((workout) => {
        duration += parseInt(workout.duration);
        rpe += parseInt(workout.rate);
        workout.program.exercices.map((exercice) => {
          if (exercice.type.id === 1) {
            exercice.movements &&
            exercice.movements.map((movement) => {
              parentId = this.categories[movement.category_id];

              let _volume = 0;
              let _tonnage = 0;
              let _distance = 0;
              let _intensite = 0;
              let _intensiteSize = 0;

              movement.sets.map((set) => {
                if (movement.has_rep_unit) {
                  _distance += set.rep * set.set;
                } else {
                  _volume += set.rep * set.set;
                }
                let calcul = this._calcIntensiteTonnage(
                  movement.max_value,
                  set.unit_label,
                  set.value,
                  set.rep,
                  set.set
                );
                _tonnage += calcul["tonnage"];
                _intensite += calcul["intensite"];
                _intensiteSize += set.rep * set.set;
              });

              volume += _volume;
              tonnage += _tonnage;
              distance += _distance;
              intensite += _intensite;
              intensiteSize += _intensiteSize;

              if (parentId) {
                this._calcMovements(
                  movement,
                  parentId,
                  _volume,
                  _tonnage,
                  _distance,
                  _intensite,
                  _intensiteSize
                );
              }
            });
            // Exercice complex
          } else if (exercice.type.id === 2) {
            exercice.movements &&
            exercice.movements.map((movement) => {

              parentId = this.categories[movement.category_id];

              let _volume = 0;
              let _tonnage = 0;
              let _distance = 0;
              let _intensite = 0;
              let _intensiteSize = 0;

              movement.sets.map((set) => {
                if (movement.has_rep_unit)
                  _distance = set.rep * exercice.sets;
                else _volume += set.rep * exercice.sets;
                let calcul = this._calcIntensiteTonnage(
                  movement.max_value,
                  set.unit_label,
                  set.value,
                  set.rep,
                  exercice.sets
                );
                _tonnage += calcul["tonnage"];
                _intensite += calcul["intensite"];
                _intensiteSize += set.rep * exercice.sets;
              });

              volume += _volume;
              tonnage += _tonnage;
              distance += _distance;
              intensite += _intensite;
              intensiteSize += _intensiteSize;

              if (parentId) {
                this._calcMovements(
                  movement,
                  parentId,
                  _volume,
                  _tonnage,
                  _distance,
                  _intensite,
                  _intensiteSize,
                  exercice.sets
                );
              }
            });
            // Exercice AMRAP
          } else if (exercice.type.id === 3) {
            exercice.movements &&
            exercice.movements.map((movement) => {
              parentId = this.categories[movement.category_id];

              movement.sets.map((set) => {
                set.rep = set.quantity;
              })


              let _volume = 0;
              let _tonnage = 0;
              // movement.sets[0].quantity *
              // exercice.sets *
              // movement.sets[0].value;
              let _distance = 0;
              let _intensite = 0;
              // movement.sets[0].quantity *
              // exercice.sets *
              // movement.sets[0].value;
              if (movement.has_rep_unit) {
                _distance = movement.sets[0].quantity * exercice.sets;
              } else {
                _volume += movement.sets[0].quantity * exercice.sets;
              }
              let calcul = this._calcIntensiteTonnage(
                movement.max_value,
                movement.sets[0].unit_label,
                movement.sets[0].value,
                movement.sets[0].quantity,
                exercice.sets
              );
              _tonnage += calcul["tonnage"];
              _intensite += calcul["intensite"];
              let _intensiteSize = movement.sets[0].quantity * exercice.sets;

              volume += _volume;
              tonnage += _tonnage;
              distance += _distance;
              intensite += _intensite;
              intensiteSize += _intensiteSize;

              if (parentId) {
                this._calcMovements(
                  movement,
                  parentId,
                  _volume,
                  _tonnage,
                  _distance,
                  _intensite,
                  _intensiteSize,
                  exercice.sets
                );
              }
            });
            // Exercice complex - For Time
          } else if (exercice.type.id === 4) {
            exercice.movements &&
            exercice.movements.map((movement) => {
              parentId = this.categories[movement.category_id];
              movement.sets.map((set) => {
                set.rep = set.quantity;
              })

              let _volume = 0;
              let _tonnage = 0;
              // movement.sets[0].quantity *
              // exercice.time_style_fixed *
              // movement.sets[0].value;
              let _distance = 0;
              let _intensite = 0;
              // movement.sets[0].quantity *
              // exercice.time_style_fixed *
              // movement.sets[0].value;
              if (movement.has_rep_unit) {
                _distance =
                  movement.sets[0].quantity * exercice.time_style_fixed;
              } else {
                _volume +=
                  movement.sets[0].quantity * exercice.time_style_fixed;
              }
              let calcul = this._calcIntensiteTonnage(
                movement.max_value,
                movement.sets[0].unit_label,
                movement.sets[0].value,
                movement.sets[0].quantity,
                exercice.time_style_fixed
              );
              _tonnage += calcul["tonnage"];
              _intensite += calcul["intensite"];
              let _intensiteSize =
                movement.sets[0].quantity * exercice.time_style_fixed;

              volume += _volume;
              tonnage += _tonnage;
              distance += _distance;
              intensite += _intensite;
              intensiteSize += _intensiteSize;

              if (parentId) {
                this._calcMovements(
                  movement,
                  parentId,
                  _volume,
                  _tonnage,
                  _distance,
                  _intensite,
                  _intensiteSize,
                  exercice.time_style_fixed
                );
              }
            });
            // Exercice complex - EMOM
          } else if (exercice.type.id === 5) {
            let sets = parseInt(
              "" + (exercice.emom_duration * 60) / exercice.emom_seconds
            );

            exercice.movements &&
            exercice.movements.map((movement) => {
              parentId = this.categories[movement.category_id];

              movement.sets.map((set) => {
                set.rep = set.quantity;
              })

              /*if (!movement.sets[0].quantity || movement.sets[0].value) {
                return;
              }*/

              let _volume = 0;
              let _tonnage = 0;
              // movement.sets[0].quantity * sets * movement.sets[0].value;
              let _distance = 0;
              let _intensite = 0;

              // movement.sets[0].quantity * sets * movement.sets[0].value;
              if (movement.has_rep_unit) {
                _distance = movement.sets[0].quantity * sets;
              } else {
                _volume += movement.sets[0].quantity * sets;
              }
              let calcul = this._calcIntensiteTonnage(
                movement.max_value,
                movement.sets[0].unit_label,
                movement.sets[0].value,
                movement.sets[0].quantity,
                sets
              );

              _tonnage += calcul["tonnage"];
              _intensite += calcul["intensite"];

              let _intensiteSize = movement.sets[0].quantity * sets;

              volume += _volume;
              tonnage += _tonnage;
              distance += _distance;
              intensite += _intensite;
              intensiteSize += _intensiteSize;

              if (parentId) {
                this._calcMovements(
                  movement,
                  parentId,
                  _volume,
                  _tonnage,
                  _distance,
                  _intensite,
                  _intensiteSize,
                  parseInt(exercice.emom_duration)
                );
              }
            });
            // Exercice complex - Cardio
          } else if (exercice.type.id === 7) {
            var cardioVolume = 0;
            var cardioTonnage = 0;
            if (exercice.cardio_scoring == 1) {
              //cardioVolume += exercice.cardio_cardio_movement.interval;
              cardioDistance = exercice.cardio_cardio_movement.interval;
              cardioIntensite =
                exercice.cardio_cardio_movement.value * cardioDistance;
              cardioIntensiteSize = exercice.cardio_cardio_movement.interval;
              this.stats.cardioMvt = this.stats.cardioMvt? this.stats.cardioMvt: [];
              this.stats?.cardioMvt?.push(exercice.cardio_cardio_movement);
            } else if (exercice.cardio_scoring == 2) {
              this.stats.intervalMvt = this.stats.intervalMvt? this.stats.intervalMvt: [];
              this.stats.intervalMvt.push(...exercice.cardio_intervals_movement.sets);
              exercice.cardio_intervals_movement.sets.map((set) => {
                // cardioVolume += set.interval * set.set;
                cardioDistance += set.interval * set.set;
                cardioIntensite += set.value * set.interval * set.set;
                cardioIntensiteSize += set.interval * set.set;
              });
            }
            volume += cardioVolume;
            tonnage += cardioTonnage;
            distance += cardioDistance;
            intensite += cardioIntensite;
            intensiteSize += cardioIntensiteSize;



            this.stats.categories[1].volume += cardioVolume;
            this.stats.categories[1].tonnage += Math.round((cardioTonnage + Number.EPSILON) * 100) / 100;
            this.stats.categories[1].distance += cardioDistance;
            this.stats.categories[1].intensite += cardioIntensite;
            this.stats.categories[1].intensiteSize += cardioIntensiteSize;
            this.stats.categories[1].movements.push({});
            if (this.categoriesData.length === 0) {
              for (let category in this.stats.categories) {
                this.categoriesData.push(this.stats.categories[category]);
              }
            }
            this.categoriesData = _.sortBy(
              this.categoriesData,
              "movements.length"
            ).reverse();
          }
        });
      });

      this.stats.categories[1].intensity =
        this.stats.categories[1].intensiteSize != 0
          ? parseInt(
          "" +
          this.stats.categories[1].intensite /
          this.stats.categories[1].intensiteSize
          )
          : 0;
      this.stats.categories[2].intensity =
        this.stats.categories[2].intensiteSize != 0
          ? parseInt(
          "" +
          this.stats.categories[2].intensite /
          this.stats.categories[2].intensiteSize
          )
          : 0;
      this.stats.categories[3].intensity =
        this.stats.categories[3].intensiteSize != 0
          ? parseInt(
          "" +
          this.stats.categories[3].intensite /
          this.stats.categories[3].intensiteSize
          )
          : 0;
      this.stats.categories[4].intensity =
        this.stats.categories[4].intensiteSize != 0
          ? parseInt(
          "" +
          this.stats.categories[4].intensite /
          this.stats.categories[4].intensiteSize
          )
          : 0;
      this.stats.categories[5].intensity =
        this.stats.categories[5].intensiteSize != 0
          ? parseInt(
          "" +
          this.stats.categories[5].intensite /
          this.stats.categories[5].intensiteSize
          )
          : 0;
      this.stats.categories[6].intensity =
        this.stats.categories[6].intensiteSize != 0
          ? parseInt(
          "" +
          this.stats.categories[6].intensite /
          this.stats.categories[6].intensiteSize
          )
          : 0;

      this.stats.categories[7].intensity =
        this.stats.categories[7].intensiteSize != 0
          ? parseInt(
          "" +
          this.stats.categories[7].intensite /
          this.stats.categories[7].intensiteSize
          )
          : 0;

      this.stats.weekly.intensite.push(
        parseInt("" + intensite / intensiteSize)
      );

      this.stats.weekly.volume.push(Math.round((volume + Number.EPSILON) * 100) / 100);
      this.stats.weekly.tonnage.push(Math.round((tonnage + Number.EPSILON) * 100) / 100);
      this.stats.weekly.distance.push(Math.round((distance + Number.EPSILON) * 100) / 100);

      this.stats.weekly.realIntensite.push(intensite);
      this.stats.weekly.realIntensiteSize.push(intensiteSize);

      this.stats.weekly.duration.push(duration);
      this.stats.weekly.rpe.push(rpe);


      // this.stats.cardio.volume.push(cardioVolume);
      // this.stats.cardio.distance.push(cardioDistance);
      // this.stats.cardio.intensity.push(
      //   parseInt("" + cardioIntensite / cardioIntensiteSize)
      // );
    } else {
      part.workouts = [];
      this.stats.weekly.intensite.push(0);
      this.stats.weekly.volume.push(0);
      this.stats.weekly.tonnage.push(0);
      this.stats.weekly.distance.push(0);
      this.stats.weekly.realIntensite.push(0);
      this.stats.weekly.realIntensiteSize.push(0);
      this.stats.weekly.duration.push(0);
      this.stats.weekly.rpe.push(0);
    }

    this.barChartData[0].data = this.stats.weekly.intensite;
    this.barChartData[1].data = this.stats.weekly.volume;
    this.barChartData[2].data = this.stats.weekly.tonnage;
    this.barChartData[3].data = this.stats.weekly.distance;

    let noEmptyData = _.filter(this.barChartData[0].data, (data) => data > 0);
    let totalIntensite = _.reduce(
      this.stats.weekly.realIntensite,
      (a: number, b: number) => a + b,
      0
    );
    let totalIntensiteSize = _.reduce(
      this.stats.weekly.realIntensiteSize,
      (a: number, b: number) => a + b,
      0
    );

    this.stats.weekly.intensiteRound = parseInt(
      "" + totalIntensite / totalIntensiteSize
    );

    this.stats.weekly.volumeRound = _.reduce(
      this.barChartData[1].data,
      (a: number, b: number) => a + b,
      0
    );
    this.stats.weekly.tonnageRound = _.reduce(
      this.barChartData[2].data,
      (a: number, b: number) => a + b,
      0
    );
    this.stats.weekly.distanceRound = _.reduce(
      this.barChartData[3].data,
      (a: number, b: number) => a + b,
      0
    );

    this.barChartData[0].data = this.stats.weekly.intensite;

    this.stats.weekly.intensiteRound = Math.round((this.stats.weekly.intensiteRound + Number.EPSILON) * 100) / 100;
    this.stats.weekly.volumeRound = Math.round((this.stats.weekly.volumeRound + Number.EPSILON) * 100) / 100;
    this.stats.weekly.tonnageRound = Math.round((this.stats.weekly.tonnageRound + Number.EPSILON) * 100) / 100;
    this.stats.weekly.distanceRound = Math.round((this.stats.weekly.distanceRound + Number.EPSILON) * 100) / 100;
  }

  _initPartWeek(part) {
    let startDay = startOfWeek(new Date(part.date), { weekStartsOn: 1 });
    let selectedDay;
    for (let workoutKey in this.workouts) {
      selectedDay = startOfWeek(new Date(workoutKey), { weekStartsOn: 1 });
      if (
        format(startDay, "yyyy-MM-dd") === format(selectedDay, "yyyy-MM-dd")
      ) {
        part.workouts = _.concat(part.workouts, this.workouts[workoutKey]);
      }
    }

    let volume = 0;
    let tonnage = 0;
    let distance = 0;
    let intensite = 0;
    let intensiteSize = 0;
    let parentId = 0;
    let duration = 0;
    let rpe = 0;

    let cardioVolume = 0;
    let cardioDistance = 0;
    let cardioIntensite = 0;
    let cardioIntensiteSize = 0;

    part.workouts.map((workout) => {
      duration += parseInt(workout.duration);
      rpe += parseInt(workout.rate);

      workout.program &&
      workout.program.exercices.map((exercice) => {
        // Exercice simple
        if (exercice.type.id === 1) {
          exercice.movements &&
          exercice.movements.map((movement) => {
            parentId = this.categories[movement.category_id];

            let _volume = 0;
            let _tonnage = 0;
            let _distance = 0;
            let _intensite = 0;
            let _intensiteSize = 0;

            movement.sets.map((set) => {
              if (movement.has_rep_unit) {
                _distance += set.rep * set.set;
              } else {
                _volume += set.rep * set.set;
              }
              let calcul = this._calcIntensiteTonnage(
                movement.max_value,
                set.unit_label,
                set.value,
                set.rep,
                set.set
              );
              _tonnage += calcul["tonnage"];
              _intensite += calcul["intensite"];
              _intensiteSize += set.rep * set.set;
            });

            volume += _volume;
            tonnage += _tonnage;
            distance += _distance;
            intensite += _intensite;
            intensiteSize += _intensiteSize;

            if (parentId) {
              this._calcMovements(
                movement,
                parentId,
                _volume,
                _tonnage,
                _distance,
                _intensite,
                _intensiteSize,
                exercice.sets
              );
            }
          });
          // Exercice complex
        } else if (exercice.type.id === 2) {
          exercice.movements &&
          exercice.movements.map((movement) => {
            parentId = this.categories[movement.category_id];

            let _volume = 0;
            let _tonnage = 0;
            let _distance = 0;
            let _intensite = 0;
            let _intensiteSize = 0;

            movement.sets.map((set) => {
              if (movement.has_rep_unit)
                _distance = set.rep * exercice.sets;
              else _volume += set.rep * exercice.sets;
              let calcul = this._calcIntensiteTonnage(
                movement.max_value,
                set.unit_label,
                set.value,
                set.rep,
                exercice.sets
              );
              _tonnage += calcul["tonnage"];
              _intensite += calcul["intensite"];
              _intensiteSize += set.rep * exercice.sets;
            });

            volume += _volume;
            tonnage += _tonnage;
            distance += _distance;
            intensite += _intensite;
            intensiteSize += _intensiteSize;

            if (parentId) {
              this._calcMovements(
                movement,
                parentId,
                _volume,
                _tonnage,
                _distance,
                _intensite,
                _intensiteSize,
                exercice.sets
              );
            }

          });
          // Exercice AMRAP
        } else if (exercice.type.id === 3) {
          exercice.movements &&
          exercice.movements.map((movement) => {
            parentId = this.categories[movement.category_id];

            let _volume = 0;
            let _tonnage = 0;
            // movement.sets[0].quantity *
            // exercice.sets *
            // movement.sets[0].value;
            let _distance = 0;
            let _intensite = 0;
            // movement.sets[0].quantity *
            // exercice.sets *
            // movement.sets[0].value;
            if (movement.has_rep_unit) {
              _distance = movement.sets[0].quantity * exercice.sets;
            } else {
              _volume += movement.sets[0].quantity * exercice.sets;
            }
            let calcul = this._calcIntensiteTonnage(
              movement.max_value,
              movement.sets[0].unit_label,
              movement.sets[0].value,
              movement.sets[0].quantity,
              exercice.sets
            );
            _tonnage += calcul["tonnage"];
            _intensite += calcul["intensite"];
            let _intensiteSize = movement.sets[0].quantity * exercice.sets;

            volume += _volume;
            tonnage += _tonnage;
            distance += _distance;
            intensite += _intensite;
            intensiteSize += _intensiteSize;

            if (parentId) {
              this._calcMovements(
                movement,
                parentId,
                _volume,
                _tonnage,
                _distance,
                _intensite,
                _intensiteSize,
                exercice.sets
              );
            }
          });
          // Exercice complex - For Time
        } else if (exercice.type.id === 4) {
          exercice.movements &&
          exercice.movements.map((movement) => {
            parentId = this.categories[movement.category_id];
            let _volume = 0;
            let _tonnage = 0;
            // movement.sets[0].quantity *
            // exercice.time_style_fixed *
            // movement.sets[0].value;
            let _distance = 0;
            let _intensite = 0;
            // movement.sets[0].quantity *
            // exercice.time_style_fixed *
            // movement.sets[0].value;
            if (movement.has_rep_unit) {
              _distance =
                movement.sets[0].quantity * exercice.time_style_fixed;
            } else {
              _volume +=
                movement.sets[0].quantity * exercice.time_style_fixed;
            }
            let calcul = this._calcIntensiteTonnage(
              movement.max_value,
              movement.sets[0].unit_label,
              movement.sets[0].value,
              movement.sets[0].quantity,
              exercice.time_style_fixed
            );
            _tonnage += calcul["tonnage"];
            _intensite += calcul["intensite"];
            let _intensiteSize =
              movement.sets[0].quantity * exercice.time_style_fixed;

            volume += _volume;
            tonnage += _tonnage;
            distance += _distance;
            intensite += _intensite;
            intensiteSize += _intensiteSize;

            if (parentId) {
              this._calcMovements(
                movement,
                parentId,
                _volume,
                _tonnage,
                _distance,
                _intensite,
                _intensiteSize,
                exercice.sets
              );
            }
          });
          // Exercice complex - EMOM
        } else if (exercice.type.id === 5) {
          let sets = parseInt(
            "" + (exercice.emom_duration * 60) / exercice.emom_seconds
          );

          exercice.movements &&
          exercice.movements.map((movement) => {
            parentId = this.categories[movement.category_id];

            /*if (!movement.sets[0].quantity || movement.sets[0].value) {
              return;
            }*/

            let _volume = 0;
            let _tonnage = 0;
            // movement.sets[0].quantity * sets * movement.sets[0].value;
            let _distance = 0;
            let _intensite = 0;

            // movement.sets[0].quantity * sets * movement.sets[0].value;
            if (movement.has_rep_unit) {
              _distance = movement.sets[0].quantity * sets;
            } else {
              _volume += movement.sets[0].quantity * sets;
            }
            let calcul = this._calcIntensiteTonnage(
              movement.max_value,
              movement.sets[0].unit_label,
              movement.sets[0].value,
              movement.sets[0].quantity,
              sets
            );

            _tonnage += calcul["tonnage"];
            _intensite += calcul["intensite"];

            let _intensiteSize = movement.sets[0].quantity * sets;

            volume += _volume;
            tonnage += _tonnage;
            distance += _distance;
            intensite += _intensite;
            intensiteSize += _intensiteSize;

            if (parentId) {
              this._calcMovements(
                movement,
                parentId,
                _volume,
                _tonnage,
                _distance,
                _intensite,
                _intensiteSize,
                exercice.sets
              );
            }
          });
          // Exercice complex - Cardio
        } else if (exercice.type.id === 7) {

          var cardioVolume = 0;
          var cardioTonnage = 0;
          if (exercice.cardio_scoring == 1) {
            //cardioVolume += exercice.cardio_cardio_movement.interval;
            cardioDistance = exercice.cardio_cardio_movement.interval;
            cardioIntensite =
              exercice.cardio_cardio_movement.value * cardioDistance;
            cardioIntensiteSize = exercice.cardio_cardio_movement.interval;
          } else if (exercice.cardio_scoring == 2) {
            exercice.cardio_intervals_movement.sets.map((set) => {
              // cardioVolume += set.interval * set.set;
              cardioDistance += set.interval * set.set;
              cardioIntensite += set.value * set.interval;
              cardioIntensiteSize += set.interval;
            });
          }

          volume += cardioVolume;
          tonnage += cardioTonnage;
          distance += cardioDistance;
          intensite += cardioIntensite;
          intensiteSize += cardioIntensiteSize;

          this.stats.categories[1].volume += cardioVolume;
          this.stats.categories[1].tonnage += Math.round((cardioTonnage + Number.EPSILON) * 100) / 100;
          this.stats.categories[1].distance += cardioDistance;
          this.stats.categories[1].intensite += cardioIntensite;
          this.stats.categories[1].intensiteSize += cardioIntensiteSize;
          this.stats.categories[1].movements.push({});
          if (this.categoriesData.length === 0) {
            for (let category in this.stats.categories) {
              this.categoriesData.push(this.stats.categories[category]);
            }
          }
          this.categoriesData = _.sortBy(
            this.categoriesData,
            "movements.length"
          ).reverse();

        }
      });
    });

    this.stats.categories[1].intensity = parseInt(
      "" +
      this.stats.categories[1].intensite /
      this.stats.categories[1].intensiteSize
    );
    this.stats.categories[2].intensity = parseInt(
      "" +
      this.stats.categories[2].intensite /
      this.stats.categories[2].intensiteSize
    );
    this.stats.categories[3].intensity = parseInt(
      "" +
      this.stats.categories[3].intensite /
      this.stats.categories[3].intensiteSize
    );
    this.stats.categories[4].intensity = parseInt(
      "" +
      this.stats.categories[4].intensite /
      this.stats.categories[4].intensiteSize
    );
    this.stats.categories[5].intensity = parseInt(
      "" +
      this.stats.categories[5].intensite /
      this.stats.categories[5].intensiteSize
    );
    this.stats.categories[6].intensity = parseInt(
      "" +
      this.stats.categories[6].intensite /
      this.stats.categories[6].intensiteSize
    );
    this.stats.categories[7].intensity = parseInt(
      "" +
      this.stats.categories[7].intensite /
      this.stats.categories[7].intensiteSize
    );

    this.stats.weekly.intensite.push(
      parseInt("" + intensite / intensiteSize) | 0
    );

    this.stats.weekly.volume.push(volume | 0);
    this.stats.weekly.tonnage.push(tonnage | 0);
    this.stats.weekly.distance.push(distance | 0);

    this.stats.weekly.duration.push(duration | 0);
    this.stats.weekly.rpe.push(rpe | 0);

    this.stats.weekly.realIntensite.push(intensite);
    this.stats.weekly.realIntensiteSize.push(intensiteSize);

    this.stats.cardio.volume.push(cardioVolume | 0);
    this.stats.cardio.distance.push(cardioDistance | 0);
    this.stats.cardio.intensity.push(
      parseInt("" + cardioIntensite / cardioIntensiteSize) | 0
    );

    this.barChartData[0].data = this.stats.weekly.intensite;
    this.barChartData[1].data = this.stats.weekly.volume;
    this.barChartData[2].data = this.stats.weekly.tonnage;
    this.barChartData[3].data = this.stats.weekly.distance;

    let noEmptyData = _.filter(this.barChartData[0].data, (data) => data > 0);

    let totalIntensite = _.reduce(
      this.stats.weekly.realIntensite,
      (a: number, b: number) => a + b,
      0
    );
    let totalIntensiteSize = _.reduce(
      this.stats.weekly.realIntensiteSize,
      (a: number, b: number) => a + b,
      0
    );

    this.stats.weekly.intensiteRound = parseInt(
      "" + totalIntensite / totalIntensiteSize
    );
    this.stats.weekly.volumeRound = _.reduce(
      this.barChartData[1].data,
      (a: number, b: number) => a + b,
      0
    );
    this.stats.weekly.tonnageRound = _.reduce(
      this.barChartData[2].data,
      (a: number, b: number) => a + b,
      0
    );
    this.stats.weekly.distanceRound = _.reduce(
      this.barChartData[3].data,
      (a: number, b: number) => a + b,
      0
    );

    this.stats.weekly.intensiteRound = Math.round((this.stats.weekly.intensiteRound + Number.EPSILON) * 100) / 100;
    this.stats.weekly.volumeRound = Math.round((this.stats.weekly.volumeRound + Number.EPSILON) * 100) / 100;
    this.stats.weekly.tonnageRound = Math.round((this.stats.weekly.tonnageRound + Number.EPSILON) * 100) / 100;
    this.stats.weekly.distanceRound = Math.round((this.stats.weekly.distanceRound + Number.EPSILON) * 100) / 100;

    // this.barChartData[0].data = this.stats.weekly.intensite;

    // this.barChartCardioData[0].data = this.stats.cardio.intensity;
    // this.barChartCardioData[1].data = this.stats.cardio.volume;
    // this.barChartCardioData[2].data = this.stats.cardio.distance;
  }

  private _getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  private _calcIntensiteTonnage(maxValue, unitLabel, value, repet, sets) {
    let _intensite = 0;
    let _tonnage = 0;
    if (maxValue) {
      if (unitLabel === "%") {
        const resultRepKg = (value / 100) * maxValue || 0;
        _tonnage = parseFloat((repet * sets * resultRepKg).toFixed(2));
        _intensite = repet * sets * value;
      } else {
        _tonnage += repet * sets * value;
        const resultIntensiteKg = value / maxValue || 0;
        _intensite =
          parseFloat((repet * sets * resultIntensiteKg).toFixed(2)) * 100;
      }
    } else {
      if (unitLabel === "%") {
        _intensite = repet * sets * value;
      }
      if (unitLabel === "kg") {
        _tonnage = repet * sets * value;
      }
    }
    return { tonnage: _tonnage, intensite: _intensite };
  }

  private _calcMovements(
    movement,
    parentId,
    volume,
    tonnage,
    distance,
    intensite,
    intensiteSize,
    sets?
  ) {
    if(sets) {
      movement.sets.map((set) => {
        set.set = sets;
      });
    }

    if (!this.stats.movements[movement.movement_id]) {
      this.stats.movements[movement.movement_id] = {
        movements: [movement],
        volume: volume,
        tonnage: tonnage,
        distance: distance,
        intensite: intensite,
        intensiteSize: intensiteSize,
        name: movement.name,
      };
    } else {
      this.stats.movements[movement.movement_id].movements.push(movement);
      this.stats.movements[movement.movement_id].volume += volume;
      this.stats.movements[movement.movement_id].tonnage += Math.round((tonnage + Number.EPSILON) * 100) / 100;
      this.stats.movements[movement.movement_id].distance += distance;
      this.stats.movements[movement.movement_id].intensite += intensite;
      this.stats.movements[movement.movement_id].intensiteSize += intensiteSize;

    }

    this.movements = [];

    for (let mvt in this.stats.movements) {
      this.stats.movements[mvt].intensity = parseFloat(
        "" +
        this.stats.movements[mvt].intensite /
        this.stats.movements[mvt].intensiteSize
      ).toFixed(2);
      this.movements.push(this.stats.movements[mvt]);
    }

    this.movements = _.sortBy(this.movements, "volume").reverse();


    if (this.stats.categories[parentId]) {
      if (
        !_.find(this.stats.categories[parentId].movements, {
          movement_id: movement.movement_id,
        })
      ) {
        this.stats.categories[parentId].movements.push(movement);
      }

      this.stats.categories[parentId].volume += volume;
      this.stats.categories[parentId].tonnage += tonnage;
      this.stats.categories[parentId].distance += distance;
      this.stats.categories[parentId].intensite += intensite;
      this.stats.categories[parentId].intensiteSize += intensiteSize;
    }

    this.categoriesData = [];
    for (let category in this.stats.categories) {
      this.categoriesData.push(this.stats.categories[category]);
    }
    this.categoriesData = _.sortBy(
      this.categoriesData,
      "movements.length"
    ).reverse();
  }

  private _clean() {
    this.stats = {
      weekly: {
        volume: [],
        tonnage: [],
        distance: [],
        intensite: [],
        realIntensite: [],
        realIntensiteSize: [],
        duration: [],
        rpe: [],
        volumeRound: 0,
        tonnageRound: 0,
        distanceRound: 0,
        intensiteRound: 0,
      },
      categories: {},
      movements: {},
      cardio: {
        volume: [],
        intensity: [],
        distance: [],
      },
    };

    this.stats.categories[0] = this._setCategory("Others", 0);
    this.stats.categories[1] = this._setCategory("Cardio & intervals", 1);
    this.stats.categories[2] = this._setCategory("Olympic Weightlifting", 2);
    this.stats.categories[3] = this._setCategory("Powerlifting", 3);
    this.stats.categories[4] = this._setCategory("Strongman", 4);
    this.stats.categories[5] = this._setCategory("Stretching", 5);
    this.stats.categories[6] = this._setCategory("Plyometrics", 6);
    this.stats.categories[7] = this._setCategory("General Strenght", 7);

    this.movements = [];
    this.categoriesData = [];

    this.barChartData[0].data = [];
    this.barChartData[1].data = [];
    this.barChartData[2].data = [];
    this.barChartData[3].data = [];

    this.workouts = [];
  }

  private _setCategory(label, id) {
    return {
      label: label,
      volume: 0,
      tonnage: 0,
      distance: 0,
      intensite: 0,
      intensiteSize: 0,
      movements: [],
      id: id,
    };
  }
}
