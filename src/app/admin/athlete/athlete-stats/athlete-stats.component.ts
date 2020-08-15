import { Component, OnInit, Input } from '@angular/core';

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
  @Input() isFromUrl = true;

  constructor() {
  }

  ngOnInit() {}
}
