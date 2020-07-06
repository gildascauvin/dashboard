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
      intensite: [],
      volume: [],
      tonnage: [],
    },
    categories: {}
  }

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
        // anchor: 'end',
        // align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    {
      data: this.stats.weekly.intensite,
      label: 'Intensité',
      backgroundColor: "#cc0202",
      borderColor: '#FFFFFF',
      hoverBackgroundColor: "#cc0202",
      barThickness: 6,
    },
    {
      data: this.stats.weekly.volume,
      label: 'Volume',
      borderColor: '#FFFFFF',
      backgroundColor: "#000000",
      hoverBackgroundColor: "#000000",
      barThickness: 6,
    },
    {
      data: this.stats.weekly.tonnage,
      label: 'Tonnage',
      backgroundColor: "#C1C1C1",
      borderColor: '#FFFFFF',
      hoverBackgroundColor: "#C1C1C1",
      barThickness: 6,
      yAxisID: 'y-axis-1'
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

    console.log('AthleteStatsComponent', this);
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

    // let formatedDate = format(this.startDay, 'yyyy-MM-dd');
    // this.tabs.push({
    //   stats: {
    //     intensite: 0,
    //     volume: 0,
    //     tonnage: 0,
    //   },
    //   date: formatedDate,
    //   workouts: []
    // });

    // let nextDay = addHours(this.startDay, 24);
    // formatedDate = format(nextDay, 'yyyy-MM-dd');
    // this.tabs.push({
    //   stats: {
    //     intensite: 0,
    //     volume: 0,
    //     tonnage: 0,
    //   },
    //   date: formatedDate,
    //   workouts: []
    // });

    // for(let i = 0; i < 5; i++) {
    //   nextDay = addHours(nextDay, 24);
    //   formatedDate = format(nextDay, 'yyyy-MM-dd');
    //   this.tabs.push({
    //     stats: {
    //       intensite: 0,
    //       volume: 0,
    //       tonnage: 0,
    //     },
    //     date: formatedDate,
    //     workouts: []
    //   });
    // }
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
        let allKeys = Object.keys(workouts);
        let isEmpty = allKeys.length == 0;
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
          console.log(i % modulo, modulo, diff);
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
            if (this.workouts[part.date]) {
              part.workouts = this.workouts[part.date];

              let volume = 0;
              let tonnage = 0;
              let intensite = 0;
              let intensiteSize = 0;
              let parentId = 0;

              part.workouts.map((workout) => {
                workout.program.exercices.map((exercice) => {
                  exercice.movements && exercice.movements.map((movement) => {
                    parentId = this.categories[movement.category_id];

                    movement.sets.map((set) => {
                      volume += set.rep * set.set;
                      tonnage += set.rep * set.set * set.value;
                      intensite += set.value;
                      intensiteSize++
                    });

                    if (parentId) {
                      this.stats.categories[parentId].movements.push(movement);
                      this.stats.categories[parentId].volume += volume;
                      this.stats.categories[parentId].tonnage += tonnage;
                      this.stats.categories[parentId].intensite += intensite;

                      this.stats.categories[parentId].intensiteSize += intensiteSize;
                    }
                  })
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
            } else {
              part.workouts = [];
              this.stats.weekly.intensite.push(0);
              this.stats.weekly.volume.push(0);
              this.stats.weekly.tonnage.push(0);
            }

            this.barChartData[0].data = this.stats.weekly.intensite;
            this.barChartData[1].data = this.stats.weekly.volume;
            this.barChartData[2].data = this.stats.weekly.tonnage;

            return part;
          });
        } else {

        }

        this.isLoading = false;
    });
  }

  private _clean() {
    this.stats.weekly.volume = [];
    this.stats.weekly.tonnage = [];
    this.stats.weekly.intensite = [];

    this.stats.categories = {
      1: {
        label: 'Cardio',
        volume: 0,
        tonnage: 0,
        intensite: 0,
        intensiteSize: 0,
        movements: [],
      },
      2: {
        label: 'Olympic Weightlifting',
        volume: 0,
        tonnage: 0,
        intensite: 0,
        intensiteSize: 0,
        movements: [],
      },
      3: {
        label: 'Powerlifting',
        volume: 0,
        tonnage: 0,
        intensite: 0,
        intensiteSize: 0,
        movements: [],
      },
      4: {
        label: 'Strongman',
        volume: 0,
        tonnage: 0,
        intensite: 0,
        intensiteSize: 0,
        movements: [],
      },
      5: {
        label: 'Stretching',
        volume: 0,
        tonnage: 0,
        intensite: 0,
        intensiteSize: 0,
        movements: [],
      },
      6: {
        label: 'Plyometrics',
        volume: 0,
        tonnage: 0,
        intensite: 0,
        intensiteSize: 0,
        movements: [],
      },
      7: {
        label: 'General Strenght',
        volume: 0,
        tonnage: 0,
        intensite: 0,
        intensiteSize: 0,
        movements: [],
      }
    };
  }
}
