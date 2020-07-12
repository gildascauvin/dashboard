import { Component, OnInit } from '@angular/core';

import { format, addHours, startOfISOWeek, startOfWeek, endOfWeek, differenceInDays } from 'date-fns';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';

import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import * as _ from 'lodash';

import { UsersService } from '../../../_/templates/users.service';

import { webConfig } from '../../../web-config';

@Component({
  selector: 'app-athlete-stats',
  templateUrl: './athlete-stats.component.html',
  styleUrls: ['./athlete-stats.component.scss']
})
export class AthleteStatsComponent implements OnInit {
  isLoading: boolean = false;

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  workouts: any[] = [];

  sub: any = {};

  tabs: any = [];

  stats: any = {
    weekly: {
      volume: [],
      tonnage: [],
      intensite: [],

      realIntensite: [],
      realIntensiteSize: [],

      volumeRound: 0,
      tonnageRound: 0,
      intensiteRound: 0,
    },
    categories: {},
    movements: {},
    cardio: {
      volume: [],
      intensity: [],
    },
  };

  liveStats: any = {
    volume: 0,
    tonnage: 0,
    intensite: 0,
    intensiteSize: 0,
  };

  movements: any = [];
  categoriesData: any = [];

  endDay: any = endOfWeek(new Date(), {weekStartsOn: 1});
  startDay: any = startOfWeek(new Date(), {weekStartsOn: 1});

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
        }
      ]
    },
    plugins: {
      datalabels: {
        labels: {
          title: null
        },
        anchor: 'end',
        align: 'end',
      }
    }
  };

  barChartCardioOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
        }
      ]
    },
    plugins: {
      datalabels: {
        labels: {
          title: null
        },
        anchor: 'end',
        align: 'end',
      }
    }
  };

  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [pluginDataLabels];

  barChartData: ChartDataSets[] = [
    {
      data: this.stats.weekly.intensite,
      label: 'Intensité',
      backgroundColor: "#cc0202",
      hoverBackgroundColor: "#cc0202",
      barThickness: 4,
    },
    {
      data: this.stats.weekly.volume,
      label: 'Volume',
      backgroundColor: "#000000",
      hoverBackgroundColor: "#000000",
      barThickness: 4,
    },
    {
      data: this.stats.weekly.tonnage,
      label: 'Tonnage',
      backgroundColor: "#C1C1C1",
      hoverBackgroundColor: "#C1C1C1",
      barThickness: 4,
      yAxisID: 'y-axis-1'
    }
  ];

  barChartCardioData: ChartDataSets[] = [
    {
      data: this.stats.cardio.intensity,
      label: 'Intensity',
      backgroundColor: "#cc0202",
      hoverBackgroundColor: "#cc0202",
      barThickness: 4,
      yAxisID: 'y-axis-1',
    },{
      data: this.stats.cardio.volume,
      label: 'Volume',
      backgroundColor: "#000000",
      hoverBackgroundColor: "#000000",
      barThickness: 4,
    }
  ];

  categories: any = webConfig.categories;

  constructor(
    private usersService: UsersService,
    private calendar: NgbCalendar, public formatter: NgbDateParserFormatter
    ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 7);
  }

  ngOnInit() {
    this._clean();

    this._init();

    this._syncWorkouts();

    console.log('this', this);
  }

  onDateSelection(date: NgbDate, datepicker) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    if (this.toDate && this.fromDate) {
      datepicker.toggle();

      this._syncWorkouts(true);
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  private _init(fromDate?, toDate?) {
    toDate = toDate || new Date();
    fromDate = fromDate || new Date();

    this.endDay = endOfWeek(toDate, {weekStartsOn: 1});
    this.startDay = startOfWeek(fromDate, {weekStartsOn: 1});

    this.fromDate.year = parseInt('' + format(this.startDay, 'yyyy'));
    this.fromDate.month = parseInt('' + format(this.startDay, 'MM'));
    this.fromDate.day = parseInt('' + format(this.startDay, 'dd'));

    this.toDate.year = parseInt('' + format(this.endDay, 'yyyy'));
    this.toDate.month = parseInt('' + format(this.endDay, 'MM'));
    this.toDate.day = parseInt('' + format(this.endDay, 'dd'));
  }

  private _syncWorkouts(strict?) {
    this.isLoading = true;

    this.sub.onGetAllWorkout && this.sub.onGetAllWorkout.unsubscribe();

    let toDate = this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day + ' 00:00:00';
    let fromDate = this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day + ' 00:00:00';

    this._clean();

    let to = new Date(this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day);
    let from = new Date(this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day);

    this._init(from, to);

    this.tabs = [];

    this.sub.onGetAllWorkout = this.usersService.getAllWorkouts(fromDate, toDate, 1)
      .subscribe((workouts: any) => {
        this.workouts = _.cloneDeep(workouts);

        this.barChartLabels = [];
        this.stats.movements = {};
        this.movements = [];

        let allKeys = Object.keys(workouts);
        let isEmpty = allKeys.length == 0;

        if (isEmpty || workouts.length == 0) {
          this._clean();
          return;
        }
        // let isDaily = allKeys.length <= 30;

        // this.endDay = endOfWeek(new Date(), {weekStartsOn: 1});
        // this.startDay = startOfWeek(new Date(), {weekStartsOn: 1});

        let endWeekDay = endOfWeek(new Date(), {weekStartsOn: 1});
        let startWeekDay = startOfWeek(new Date(), {weekStartsOn: 1});

        let dates = [];
        if (!isEmpty) {
          for (const property in workouts) {
            dates.push(property);
          }

          endWeekDay = startOfWeek(new Date(dates[0]), {weekStartsOn: 1})
          startWeekDay = endOfWeek(new Date(dates[dates.length - 1]), {weekStartsOn: 1});
        }

        let nbDays = 7;
        let diff = Math​.abs(differenceInDays(startWeekDay, endWeekDay));
        let isDaily = diff < 30;

        if (diff < nbDays) {
          diff = nbDays;
        }


        let currentDate = endWeekDay;
        let modulo = isDaily ? 1 : 7;

        for(let i = 0; i < diff; i++) {
          if (i % modulo == 0) {
            let property = format(currentDate, 'yyyy-MM-dd');
            let propertyKey = format(currentDate, 'MM/dd');
            this.barChartLabels.push(propertyKey);

            this.tabs.push({
              stats: {
                intensite: 0,
                volume: 0,
                tonnage: 0,
              },
              date: property,
              workouts: []
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
    });
  }

  private _initPartWeek(part) {
    let startDay = startOfWeek(new Date(part.date), {weekStartsOn: 1});
    let selectedDay;
    for (let workoutKey in this.workouts) {
      selectedDay = startOfWeek(new Date(workoutKey), {weekStartsOn: 1});
      if (format(startDay, 'yyyy-MM-dd') === format(selectedDay, 'yyyy-MM-dd')) {
        // console.log(workout);
        part.workouts = _.concat(part.workouts, this.workouts[workoutKey]);
      }
    }

    let volume = 0;
    let tonnage = 0;
    let intensite = 0;
    let intensiteSize = 0;
    let parentId = 0;

    let cardioVolume = 0;
    let cardioIntensite = 0;
    let cardioIntensiteSize = 0;

    part.workouts.map((workout) => {
      workout.program && workout.program.exercices.map((exercice) => {

        // Exercice simple
        if (exercice.type.id === 1) {
          exercice.movements && exercice.movements.map((movement) => {
            parentId = this.categories[movement.category_id];

            movement.sets.map((set) => {
              volume += set.rep * set.set;
              tonnage += set.rep * set.set * set.value;
              intensite += set.rep * set.set * set.value;
              intensiteSize += set.rep * set.set;
            });

            if (parentId) {
              this._calcMovements(movement, parentId, volume, tonnage, intensite, intensiteSize);
            }
          });
        // Exercice complex
        } else if (exercice.type.id === 2) {
           exercice.movements && exercice.movements.map((movement) => {
            parentId = this.categories[movement.category_id];

            console.log('Exercice complex', exercice);
            movement.sets.map((set) => {
              volume += set.rep * exercice.sets;
              tonnage += set.rep * exercice.sets * set.value;
              intensite += set.rep * exercice.sets * set.value;
              intensiteSize += set.rep * exercice.sets;
            });

            if (parentId) {
              this._calcMovements(movement, parentId, volume, tonnage, intensite, intensiteSize);
            }
          });
        // Exercice AMRAP
        } else if (exercice.type.id === 3) {
          exercice.movements && exercice.movements.map((movement) => {
            parentId = this.categories[movement.category_id];

            let _volume = movement.sets[0].quantity * exercice.sets;
            let _tonnage = movement.sets[0].quantity * exercice.sets * movement.sets[0].value;
            let _intensite = movement.sets[0].quantity * exercice.sets * movement.sets[0].value;
            let _intensiteSize = movement.sets[0].quantity * exercice.sets;

            volume += _volume;
            tonnage += _tonnage;
            intensite += _intensite;
            intensiteSize += _intensiteSize;

            if (parentId) {
              this._calcMovements(movement, parentId, _volume, _tonnage, _intensite, _intensiteSize);
            }
          });
        // Exercice complex - For Time
        } else if (exercice.type.id === 4) {
          exercice.movements && exercice.movements.map((movement) => {
          parentId = this.categories[movement.category_id];

          let _volume = movement.sets[0].quantity * exercice.time_style_fixed;
          let _tonnage = movement.sets[0].quantity * exercice.time_style_fixed * movement.sets[0].value;
          let _intensite = movement.sets[0].quantity * exercice.time_style_fixed * movement.sets[0].value;
          let _intensiteSize = movement.sets[0].quantity * exercice.time_style_fixed;

          volume += _volume;
          tonnage += _tonnage;
          intensite += _intensite;
          intensiteSize += _intensiteSize;

          if (parentId) {
            this._calcMovements(movement, parentId, _volume, _tonnage, _intensite, _intensiteSize);
          }
        });
        // Exercice complex - EMOM
        } else if (exercice.type.id === 5) {
          let sets = parseInt('' + (exercice.emom_duration * 60 / exercice.emom_seconds));

          exercice.movements && exercice.movements.map((movement) => {
            parentId = this.categories[movement.category_id];

            let _volume = movement.sets[0].quantity * sets;
            let _tonnage = movement.sets[0].quantity * sets * movement.sets[0].value;
            let _intensite = movement.sets[0].quantity * sets * movement.sets[0].value;
            let _intensiteSize = movement.sets[0].quantity * sets;

            volume += _volume;
            tonnage += _tonnage;
            intensite += _intensite;
            intensiteSize += _intensiteSize;

            if (parentId) {
              this._calcMovements(movement, parentId, _volume, _tonnage, _intensite, _intensiteSize);
            }
          });
        // Exercice complex - Cardio
        } else if (exercice.type.id === 7) {
          if (exercice.cardio_scoring == 1) {
            cardioVolume += exercice.cardio_cardio_movement.interval;
            cardioIntensite += exercice.cardio_cardio_movement.value;
            cardioIntensiteSize++
          } else if (exercice.cardio_scoring == 2) {
            exercice.cardio_intervals_movement.sets.map((set) => {
              cardioVolume += set.interval * set.set;
              cardioIntensite += set.value;
              cardioIntensiteSize++
            });
          }
        }
      })
    });

    this.stats.categories[1].intensity = parseInt('' + this.stats.categories[1].intensite / this.stats.categories[1].intensiteSize);
    this.stats.categories[2].intensity = parseInt('' + this.stats.categories[2].intensite / this.stats.categories[2].intensiteSize);
    this.stats.categories[3].intensity = parseInt('' + this.stats.categories[3].intensite / this.stats.categories[3].intensiteSize);
    this.stats.categories[4].intensity = parseInt('' + this.stats.categories[4].intensite / this.stats.categories[4].intensiteSize);
    this.stats.categories[5].intensity = parseInt('' + this.stats.categories[5].intensite / this.stats.categories[5].intensiteSize);
    this.stats.categories[6].intensity = parseInt('' + this.stats.categories[6].intensite / this.stats.categories[6].intensiteSize);
    this.stats.categories[7].intensity = parseInt('' + this.stats.categories[7].intensite / this.stats.categories[7].intensiteSize);

    this.stats.weekly.intensite.push(parseInt('' + intensite / intensiteSize) | 0);
    this.stats.weekly.volume.push(volume | 0);
    this.stats.weekly.tonnage.push(tonnage | 0);

    this.stats.weekly.realIntensite.push(intensite);
    this.stats.weekly.realIntensiteSize.push(intensiteSize);

    this.stats.cardio.volume.push(cardioVolume | 0);
    this.stats.cardio.intensity.push(parseInt('' + cardioIntensite / cardioIntensiteSize) | 0);

    this.barChartData[0].data = this.stats.weekly.intensite;
    this.barChartData[1].data = this.stats.weekly.volume;
    this.barChartData[2].data = this.stats.weekly.tonnage;

    let noEmptyData = _.filter(this.barChartData[0].data, (data) => data > 0);

    let totalIntensite = _.reduce(this.stats.weekly.realIntensite, (a: number, b: number) => a + b, 0);
    let totalIntensiteSize = _.reduce(this.stats.weekly.realIntensiteSize, (a: number, b: number) => a + b, 0);

    this.stats.weekly.intensiteRound = parseInt('' + totalIntensite/totalIntensiteSize);

    this.stats.weekly.volumeRound = _.reduce(this.barChartData[1].data, (a: number, b: number) => a + b, 0);
    this.stats.weekly.tonnageRound = _.reduce(this.barChartData[2].data, (a: number, b: number) => a + b, 0);

    // this.barChartData[0].data = this.stats.weekly.intensite;

    this.barChartCardioData[0].data = this.stats.cardio.intensity;
    this.barChartCardioData[1].data = this.stats.cardio.volume;
  }

  private _initPart(part) {
    if (this.workouts[part.date]) {
      part.workouts = this.workouts[part.date];

      let volume = 0;
      let tonnage = 0;
      let intensite = 0;
      let intensiteSize = 0;
      let parentId = 0;

      let cardioVolume = 0;
      let cardioIntensite = 0;
      let cardioIntensiteSize = 0;

      part.workouts.map((workout) => {
        workout.program.exercices.map((exercice) => {
          // Exercice simple
          if (exercice.type.id === 1) {
            exercice.movements && exercice.movements.map((movement) => {
              parentId = this.categories[movement.category_id];

              movement.sets.map((set) => {
                volume += set.rep * set.set;
                tonnage += set.rep * set.set * set.value;
                intensite += set.rep * set.set * set.value;
                intensiteSize += set.rep * set.set;
              });

              if (parentId) {
                this._calcMovements(movement, parentId, volume, tonnage, intensite, intensiteSize);
              }
            });
          // Exercice complex
          } else if (exercice.type.id === 2) {
             exercice.movements && exercice.movements.map((movement) => {
              parentId = this.categories[movement.category_id];

              console.log('Exercice complex', exercice);
              console.log('---------------- BEFORE --------------------');
              console.log('volume', volume);
              console.log('tonnage', tonnage);
              console.log('intensite', intensite);
              console.log('intensiteSize', intensiteSize);

              movement.sets.map((set) => {
                volume += set.rep * exercice.sets;
                tonnage += set.rep * exercice.sets * set.value;
                intensite += set.rep * exercice.sets * set.value;
                intensiteSize += set.rep * exercice.sets;

                console.log('---------------- AFTER --------------------');
                console.log('volume', volume, set.rep , exercice.sets);
                console.log('tonnage', tonnage, set.rep, exercice.sets, set.value);
                console.log('intensite', intensite);
                console.log('intensiteSize', intensiteSize);
              });

              if (parentId) {
                this._calcMovements(movement, parentId, volume, tonnage, intensite, intensiteSize);
              }
            });
          // Exercice AMRAP
          } else if (exercice.type.id === 3) {
            exercice.movements && exercice.movements.map((movement) => {
              parentId = this.categories[movement.category_id];

              let _volume = movement.sets[0].quantity * exercice.sets;
              let _tonnage = movement.sets[0].quantity * exercice.sets * movement.sets[0].value;
              let _intensite = movement.sets[0].quantity * exercice.sets * movement.sets[0].value;
              let _intensiteSize = movement.sets[0].quantity * exercice.sets;

              volume += _volume;
              tonnage += _tonnage;
              intensite += _intensite;
              intensiteSize += _intensiteSize;

              if (parentId) {
                this._calcMovements(movement, parentId, _volume, _tonnage, _intensite, _intensiteSize);
              }
            });
          // Exercice complex - For Time
          } else if (exercice.type.id === 4) {
            exercice.movements && exercice.movements.map((movement) => {
              parentId = this.categories[movement.category_id];

              let _volume = movement.sets[0].quantity * exercice.time_style_fixed;
              let _tonnage = movement.sets[0].quantity * exercice.time_style_fixed * movement.sets[0].value;
              let _intensite = movement.sets[0].quantity * exercice.time_style_fixed * movement.sets[0].value;
              let _intensiteSize = movement.sets[0].quantity * exercice.time_style_fixed;

              volume += _volume;
              tonnage += _tonnage;
              intensite += _intensite;
              intensiteSize += _intensiteSize;

              if (parentId) {
                this._calcMovements(movement, parentId, _volume, _tonnage, _intensite, _intensiteSize);
              }
            });
          // Exercice complex - EMOM
          } else if (exercice.type.id === 5) {
            let sets = parseInt('' + (exercice.emom_duration * 60 / exercice.emom_seconds));

            exercice.movements && exercice.movements.map((movement) => {
              parentId = this.categories[movement.category_id];

              let _volume = movement.sets[0].quantity * sets;
              let _tonnage = movement.sets[0].quantity * sets * movement.sets[0].value;
              let _intensite = movement.sets[0].quantity * sets * movement.sets[0].value;
              let _intensiteSize = movement.sets[0].quantity * sets;

              volume += _volume;
              tonnage += _tonnage;
              intensite += _intensite;
              intensiteSize += _intensiteSize;

              if (parentId) {
                this._calcMovements(movement, parentId, _volume, _tonnage, _intensite, _intensiteSize);
              }
            });
          // Exercice complex - Cardio
          } else if (exercice.type.id === 7) {
            if (exercice.cardio_scoring == 1) {
              cardioVolume += exercice.cardio_cardio_movement.interval;
              cardioIntensite += exercice.cardio_cardio_movement.value;
              cardioIntensiteSize++
            } else if (exercice.cardio_scoring == 2) {
              exercice.cardio_intervals_movement.sets.map((set) => {
                cardioVolume += set.interval * set.set;
                cardioIntensite += set.value;
                cardioIntensiteSize++
              });
            }
          }
        })
      });

      this.stats.categories[1].intensity = parseInt('' + this.stats.categories[1].intensite / this.stats.categories[1].intensiteSize);
      this.stats.categories[2].intensity = parseInt('' + this.stats.categories[2].intensite / this.stats.categories[2].intensiteSize);
      this.stats.categories[3].intensity = parseInt('' + this.stats.categories[3].intensite / this.stats.categories[3].intensiteSize);
      this.stats.categories[4].intensity = parseInt('' + this.stats.categories[4].intensite / this.stats.categories[4].intensiteSize);
      this.stats.categories[5].intensity = parseInt('' + this.stats.categories[5].intensite / this.stats.categories[5].intensiteSize);
      this.stats.categories[6].intensity = parseInt('' + this.stats.categories[6].intensite / this.stats.categories[6].intensiteSize);
      this.stats.categories[7].intensity = parseInt('' + this.stats.categories[7].intensite / this.stats.categories[7].intensiteSize);

      this.stats.weekly.intensite.push(parseInt('' + intensite / intensiteSize));
      this.stats.weekly.volume.push(volume);
      this.stats.weekly.tonnage.push(tonnage);

      this.stats.weekly.realIntensite.push(intensite);
      this.stats.weekly.realIntensiteSize.push(intensiteSize);


      this.stats.cardio.volume.push(cardioVolume);
      this.stats.cardio.intensity.push(parseInt('' + cardioIntensite / cardioIntensiteSize));
    } else {
      part.workouts = [];
      this.stats.weekly.intensite.push(0);
      this.stats.weekly.volume.push(0);
      this.stats.weekly.tonnage.push(0);
      this.stats.weekly.realIntensite.push(0);
      this.stats.weekly.realIntensiteSize.push(0);
    }

    this.barChartData[0].data = this.stats.weekly.intensite;
    this.barChartData[1].data = this.stats.weekly.volume;
    this.barChartData[2].data = this.stats.weekly.tonnage;

    let noEmptyData = _.filter(this.barChartData[0].data, (data) => data > 0);
    let totalIntensite = _.reduce(this.stats.weekly.realIntensite, (a: number, b: number) => a + b, 0);
    let totalIntensiteSize = _.reduce(this.stats.weekly.realIntensiteSize, (a: number, b: number) => a + b, 0);

    this.stats.weekly.intensiteRound = parseInt('' + totalIntensite/totalIntensiteSize);

    this.stats.weekly.volumeRound = _.reduce(this.barChartData[1].data, (a: number, b: number) => a + b, 0);
    this.stats.weekly.tonnageRound = _.reduce(this.barChartData[2].data, (a: number, b: number) => a + b, 0);

    this.barChartData[0].data = this.stats.weekly.intensite;

    this.barChartCardioData[0].data = this.stats.cardio.intensity;
    this.barChartCardioData[1].data = this.stats.cardio.volume;

    console.log(this);
  }

  private _setStats(rep, set, value) {
    this.liveStats.volume += rep * set;
    this.liveStats.tonnage += rep * set * value;
    this.liveStats.intensite += rep * set * value;
    this.liveStats.intensiteSize += rep * set;
  }

  private _calcMovements(movement, parentId, volume, tonnage, intensite, intensiteSize) {
    if (!this.stats.movements[movement.movement_id]) {
      this.stats.movements[movement.movement_id] = {
        movements: [movement],
        volume: volume,
        tonnage: tonnage,
        intensite: intensite,
        intensiteSize: intensiteSize,
        name: movement.name,
      };
    } else {
      this.stats.movements[movement.movement_id].movements.push(movement);
      this.stats.movements[movement.movement_id].volume += volume;
      this.stats.movements[movement.movement_id].tonnage += tonnage;
      this.stats.movements[movement.movement_id].intensite += intensite;
      this.stats.movements[movement.movement_id].intensiteSize += intensiteSize;
    }

    this.movements = []
    for(let mvt in this.stats.movements) {
      this.stats.movements[mvt].intensity = parseInt('' + this.stats.movements[mvt].intensite / this.stats.movements[mvt].intensiteSize);
      this.movements.push(this.stats.movements[mvt]);
    }

    this.movements = _.sortBy(this.movements, 'volume').reverse();

    if (this.stats.categories[parentId]) {
      if (!_.find(this.stats.categories[parentId].movements, { 'movement_id': movement.movement_id })) {
        this.stats.categories[parentId].movements.push(movement);
      }

      this.stats.categories[parentId].volume += volume;
      this.stats.categories[parentId].tonnage += tonnage;
      this.stats.categories[parentId].intensite += intensite;
      this.stats.categories[parentId].intensiteSize += intensiteSize;
    }

    this.categoriesData = [];
    for (let category in this.stats.categories) {
      this.categoriesData.push(this.stats.categories[category]);
    }
    this.categoriesData = _.sortBy(this.categoriesData, 'volume').reverse();
  }

  private _clean() {
    this.stats = {
      weekly: {
        volume: [],
        tonnage: [],
        intensite: [],
        realIntensite: [],
        realIntensiteSize: [],
        volumeRound: 0,
        tonnageRound: 0,
        intensiteRound: 0,
      },
      categories: {},
      movements: {},
      cardio: {
        volume: [],
        intensity: [],
      },
    };

    this.stats.categories[0] = this._setCategory('Others');
    this.stats.categories[1] = this._setCategory('Cardio');
    this.stats.categories[2] = this._setCategory('Olympic Weightlifting');
    this.stats.categories[3] = this._setCategory('Powerlifting');
    this.stats.categories[4] = this._setCategory('Strongman');
    this.stats.categories[5] = this._setCategory('Stretching');
    this.stats.categories[6] = this._setCategory('Plyometrics');
    this.stats.categories[7] = this._setCategory('General Strenght');

    this.movements = []
    this.categoriesData = [];

    this.barChartData[0].data = [];
    this.barChartData[1].data = [];
    this.barChartData[2].data = [];

    this.barChartCardioData[0].data = [];
    this.barChartCardioData[1].data = [];

  }

  private _setCategory(label) {
    return {
      label: label,
      volume: 0,
      tonnage: 0,
      intensite: 0,
      intensiteSize: 0,
      movements: [],
    }
  }
}
