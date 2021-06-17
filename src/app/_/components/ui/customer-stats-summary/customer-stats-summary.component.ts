import {Component, Inject, Input, OnInit, ViewChild} from "@angular/core";
import {ngxLightOptions} from "ngx-light-carousel/public-api";
import {NgxCarouselComponent} from "ngx-light-carousel";
import {ResizeService} from "../../../services/ui/resize-service.service";
import {DOCUMENT} from "@angular/common";
import {CustomerStatsService} from "../customer-stats-range/customer-stats-range.service";
import {endOfWeek} from "date-fns";
import * as _ from "lodash";
import {UsersService} from "../../../templates/users.service";
import {CustomerStatsComputerService} from "../../../services/stats/customer-stats-computer.service";
import {AuthService} from "../../../services/http/auth.service";
import { CustomerStatsSummaryService } from './customer-stats-summary.service';

@Component({
  selector: "app-customer-stats-summary",
  templateUrl: "./customer-stats-summary.component.html",
  styleUrls: ["./customer-stats-summary.component.scss"],
})
export class CustomerStatsSummaryComponent implements OnInit {
  @Input() isFromUrl = true;
  @ViewChild(NgxCarouselComponent) sliderElement: NgxCarouselComponent;

  currentElementCarousel: number = 0;
  size: number = 1;
  responsiveSize: number = 768;

  sub: any = {};

  carouselOptions: ngxLightOptions;
  carouselData: any = [];

  activeTab: string = 'trainingOverload';

  fatigueManagement: any = {
    load: {constraint: 0, rcac: 0},
    variation: {monotony: 0},
    fitness: {fitness: 0, energyScore: 0},
    colors: {load: {color1: '', color2: ''}, variation: {percent: 0}, fitness: {color1: ''}}
  };

  isCoach: boolean = false;

  constructor(
    private customerStatsService: CustomerStatsService,
    private resizeSvc: ResizeService,
    private customerStatsComputerService: CustomerStatsComputerService,
    private usersService: UsersService,
    private authService: AuthService,
    private customerStatsSummaryService: CustomerStatsSummaryService,
    @Inject(DOCUMENT) private _document
  ) {}

  ngAfterViewInit() {
    this.touchendCarousel();
  }

  ngOnInit() {
    this.detectScreenSize();
    this._initCarouselOptions();

    this.isCoach = this.authService.isCoach();

    this.sub.onStatsUpdatedStart = this.customerStatsService.onStatsUpdatedStart.subscribe(
      () => {
        this.fatigueManagement = {
          load: {constraint: 0, rcac: 0}, variation: {monotony: 0}, fitness: {fitness: 0, energyScore: 0},
          colors: {load: {color1: '', color2: ''}, variation: {percent: 0}, fitness: {color1: ''}}
        };
      }
    );

    this.sub.onStatsUpdated = this.customerStatsService.onStatsUpdated.subscribe(
      (component) => {

        let to = endOfWeek(component.startDay, {weekStartsOn: 1});
        let from = _.clone(to);
        to.setHours(23,59,59);
        from.setHours(0,0,0);
        from.setDate(from.getDate() - 27);
        let fromDate = CustomerStatsSummaryComponent.formatDate(from) + ' 00:00:00';
        let toDate = CustomerStatsSummaryComponent.formatDate(to) + ' 23:59:59';

        if (this.isFromUrl) {

          this.usersService.getAllWorkouts(fromDate, toDate, 1).subscribe((workouts: any) => {
            if (workouts) {
              let customerStats = this.customerStatsComputerService.computeStatsForAllWorkouts(workouts, true, from, to);
              this.fatigueManagement = this.customerStatsSummaryService.computeStatFatigueManagement(
                component.workouts,
                workouts,
                component.stats,
                customerStats,
                component.startDay,
                component.endDay
              );
            }
          });
        } else {

          let clientId = this.authService.getCurrentAthletId();
          this.usersService.getAllClientWorkouts(clientId, fromDate, toDate, 1).subscribe((workouts: any) => {
            if (workouts) {
              let customerStats = this.customerStatsComputerService.computeStatsForAllClientWorkouts(workouts, true, from, to);
              this.fatigueManagement = this.customerStatsSummaryService.computeStatFatigueManagement(
                component.workouts,
                workouts,
                component.stats,
                customerStats,
                component.startDay,
                component.endDay
              );
            }
          });
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.onStatsUpdated && this.sub.onStatsUpdated.unsubscribe();
    this.sub.onStatsUpdatedStart && this.sub.onStatsUpdatedStart.unsubscribe();
  }

  setActiveTab(tab) {
    this.activeTab = tab;
    this.customerStatsSummaryService.onTabChanged.emit(tab);
  }

  touchendCarousel(timeout?){

    let duration = 0;
    if (timeout === true) {
      duration = 1000;
    }

    setTimeout(() => {
      if (this.sliderElement && this.currentElementCarousel != this.sliderElement.current) {
        this.currentElementCarousel = this.sliderElement.current;

        if (this.currentElementCarousel == 1) {
          this.setActiveTab('energySystems');
        } else if (this.currentElementCarousel == 2) {
          this.setActiveTab('fatigueManagement');
        } else {
          this.setActiveTab('trainingOverload');
        }
      }
    }, duration);
  }

  private _initCarouselOptions() {
    this.carouselOptions = {
      animation: {
        animationClass: 'transition',
        animationTime: 500,
      },
      swipe: {
        swipeable: true,
        swipeVelocity: .004,
      },
      drag: {
        draggable: true,
        dragMany: true,
      },
      arrows: false,
      indicators: true,
      infinite: true,
      scroll: {
        numberToScroll: 1
      },
      breakpoints: [
        {
          width: 768,
          number: 1,
        },
        {
          width: 9999,
          number: 3,
        }
      ],
    };

    this.carouselData.push({title: 'Load'});
    this.carouselData.push({title: 'Variation'});
    this.carouselData.push({title: 'Fitness'});
  }

  private detectScreenSize() {
    const currentSize = this._document.body.clientWidth;
    this.size = currentSize;
    this.resizeSvc.onResize(currentSize);
  }

  private static formatDate(d) {
    var month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }
}
