import { Component, Input, OnInit } from "@angular/core";
import {NgbCalendar, NgbDate, NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import {endOfWeek, format, startOfWeek,} from "date-fns";
import { Label } from "ng2-charts";
import { webConfig } from "../../../../web-config";
import { AuthService } from "../../../../_/services/http/auth.service";
import { UsersService } from "../../../../_/templates/users.service";
import { CustomerStatsService } from "./customer-stats-range.service";
import {CustomerStatsComputerService} from "../../../services/stats/customer-stats-computer.service";
import * as _ from "lodash";

@Component({
  selector: "app-customer-stats-range",
  templateUrl: "./customer-stats-range.component.html",
  styleUrls: ["./customer-stats-range.component.scss"],
})
export class CustomerStatsRangeComponent implements OnInit {
  @Input() showRange: boolean = true;
  @Input() isFromUrl = true;
  @Input() isOneDay = false;
  @Input() keepDates = false;

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

  movements: any = [];
  categoriesData: any = [];

  endDay: any = endOfWeek(new Date(), { weekStartsOn: 1 });
  startDay: any = startOfWeek(new Date(), { weekStartsOn: 1 });

  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      yAxes: [
        {
          id: "y-axis-0",
          position: "left",
        },
        {
          id: "y-axis-1",
          position: "right",
        },
      ],
    },
    plugins: {
      datalabels: {
        labels: {
          title: null,
        },
      },
    },
  };

  barChartCardioOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      yAxes: [
        {
          id: "y-axis-0",
          position: "left",
        },
        {
          id: "y-axis-1",
          position: "right",
        },
      ],
    },
    plugins: {
      datalabels: {
        labels: {
          title: null,
        },
        anchor: "end",
        align: "end",
      },
    },
  };

  barChartLabels: Label[] = [];
  barChartType: ChartType = "bar";
  barChartLegend = true;
  barChartPlugins = [pluginDataLabels];

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

  // barChartCardioData: ChartDataSets[] = [
  //   {
  //     data: this.stats.cardio.intensity,
  //     label: "Intensity",
  //     backgroundColor: "#cc0202",
  //     hoverBackgroundColor: "#cc0202",
  //     barThickness: 4,
  //     yAxisID: "y-axis-1",
  //   },
  //   {
  //     data: this.stats.cardio.volume,
  //     label: "Volume",
  //     backgroundColor: "#000000",
  //     hoverBackgroundColor: "#000000",
  //     barThickness: 4,
  //   },
  //   {
  //     data: this.stats.cardio.distance,
  //     label: "Distance",
  //     backgroundColor: "#9953c9",
  //     hoverBackgroundColor: "#9953c9",
  //     barThickness: 4,
  //   },
  // ];

  categories: any = webConfig.categories;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    public customerStatsService: CustomerStatsService,
    public customerStatsComputerService: CustomerStatsComputerService
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), "d", 7);
  }

  ngOnInit() {
    this._clean();

    this._init();

    this._syncWorkouts();
  }

  onDateSelection(date: NgbDate, datepicker) {
    this.customerStatsService.onStatsUpdatedStart.emit(true);

    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
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
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }

  // events
  public chartClicked({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  private _init(fromDate?, toDate?) {
    toDate = toDate || new Date();
    fromDate = fromDate || new Date();

    if (this.keepDates == false) {
      if (!this.isOneDay) {
        this.endDay = endOfWeek(toDate, { weekStartsOn: 1 });
        this.startDay = startOfWeek(fromDate, { weekStartsOn: 1 });
      } else {
        this.endDay = this.startDay = toDate;
      }
    } else {
      if (format(toDate, 'yyyyMMdd') == format(fromDate, 'yyyyMMdd')) {
        this.endDay = endOfWeek(toDate, { weekStartsOn: 1 });
        this.startDay = startOfWeek(fromDate, { weekStartsOn: 1 });
      } else {
        this.endDay = toDate;
        this.startDay = fromDate;
      }
    }

    this.fromDate.year = parseInt("" + format(this.startDay, "yyyy"));
    this.fromDate.month = parseInt("" + format(this.startDay, "MM"));
    this.fromDate.day = parseInt("" + format(this.startDay, "dd"));

    this.toDate.year = parseInt("" + format(this.endDay, "yyyy"));
    this.toDate.month = parseInt("" + format(this.endDay, "MM"));
    this.toDate.day = parseInt("" + format(this.endDay, "dd"));
  }

  private _syncWorkouts(strict?) {
    this.isLoading = true;

    this.sub.onGetAllWorkout && this.sub.onGetAllWorkout.unsubscribe();

    let toDate = this._computeDateFromDatePicker(this.toDate, true);
    let fromDate = this._computeDateFromDatePicker(this.fromDate, true);

    this._clean();

    let to = new Date(this._computeDateFromDatePicker(this.toDate));
    let from = new Date(this._computeDateFromDatePicker(this.fromDate));

    this._init(from, to);

    this.tabs = [];
    if (this.isFromUrl) {
      this.sub.onGetAllWorkout = this.usersService
        .getAllWorkouts(fromDate, toDate, 1)
        .subscribe((workouts: any) => {
          this.workouts = _.cloneDeep(workouts);
          let customerStats = this.customerStatsComputerService.computeStatsForAllWorkouts(this.workouts, this.keepDates);
          this._setCustomerStats(customerStats);
        });
    } else {
      let clientId = this.authService.getCurrentAthletId();

      this.sub.onGetAllWorkout = this.usersService
        .getAllClientWorkouts(clientId, fromDate, toDate, 1)
        .subscribe((workouts: any) => {

          this.workouts = _.cloneDeep(workouts);
          let customerStats = this.customerStatsComputerService.computeStatsForAllClientWorkouts(this.workouts, this.keepDates);
          this._setCustomerStats(customerStats);
        });
    }
  }

  private _setCustomerStats(customerStats)
  {
    this.barChartData = customerStats.barChartData;
    this.barChartLabels = customerStats.barChartLabels;
    this.categories = customerStats.categories;
    this.categoriesData = customerStats.categoriesData;
    this.isLoading = customerStats.isLoading;
    this.isOneDay = customerStats.isOneDay;
    this.liveStats = customerStats.liveStats;
    this.movements = customerStats.movements;
    this.stats = customerStats.stats;
    this.tabs = customerStats.tabs;

    this.customerStatsService.onStatsUpdated.emit(this);
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

    // this.barChartCardioData[0].data = [];
    // this.barChartCardioData[1].data = [];
    // this.barChartCardioData[2].data = [];
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

  private _computeDateFromDatePicker(date, withtime?) {
    let day = (date.day < 10) ? "0" + date.day : date.day;
    let month = (date.month < 10) ? "0" + date.month : date.month;

    let dateFormatted = date.year + "-" + month + "-" + day;

    if (withtime === true) {
      dateFormatted += " 00:00:00";
    }

    return dateFormatted;
  }
}
