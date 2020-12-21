import { Component, Input, OnInit } from '@angular/core';
import { webConfig } from 'src/app/web-config';
import { CustomerStatsService } from '../customer-stats-range/customer-stats-range.service';

@Component({
  selector: 'app-customer-stats-exercice',
  templateUrl: './customer-stats-exercice.component.html',
  styleUrls: ['./customer-stats-exercice.component.scss'],
})
export class CustomerStatsExerciceComponent implements OnInit {
  @Input() isFromUrl = true;
  @Input() isFromOverView = false;
  movements: any = [];
  categoriesData: any = [];
  sub: any = {};
  categoriesIconClassCss: any = webConfig.categoriesIconClassCss;
  constructor(private customerStatsService: CustomerStatsService) { }

  ngOnInit(): void {
    this.sub.onStatsUpdated = this.customerStatsService.onStatsUpdated.subscribe(
      (component) => {
        this.movements = component.movements;
        let totalMovements = 0;
        this.movements.forEach((mvt) => {
          totalMovements += mvt.movements.length;
        });
        this.movements.map((mvt) => {
          mvt.percentage = (mvt.movements.length / totalMovements) * 100;
        });
        this.categoriesData = component.categoriesData;
        let totalMovementsCategories = 0;
        this.categoriesData.forEach((category) => {
          totalMovementsCategories += category.movements.length;
        });

        this.categoriesData.map((category) => {
          let style = this.categoriesIconClassCss.filter(
            (style) => style.id == category.id
          );
          category.style = style.shift();
          category.percentage =
            (category.movements.length / totalMovementsCategories) * 100;
        });
      }
    );

    this.sub.onStatsUpdatedStart = this.customerStatsService.onStatsUpdatedStart.subscribe(
      () => {
        this.movements = [];
        this.categoriesData = [];
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.onStatsUpdated && this.sub.onStatsUpdated.unsubscribe();
    this.sub.onStatsUpdatedStart && this.sub.onStatsUpdatedStart.unsubscribe();
  }

  searchIconAndClass(id) {
    return this.categoriesIconClassCss.filter((style) => style.id === id);
  }
  getRandomColor(step: number) {
    let color = 'FFFFFF';
    let colorToInt = parseInt(color.substr(1), 16), // Convert HEX color to integer
      nstep = step; // Convert step to integer
    if (!isNaN(colorToInt) && !isNaN(nstep)) {
      // Make sure that color has been converted to integer
      colorToInt += nstep; // Increment integer with step
      let ncolor = colorToInt.toString(16); // Convert back integer to HEX
      ncolor = '#' + new Array(7 - ncolor.length).join('0') + ncolor; // Left pad '0' to make HEX look like a color
      if (/^#[0-9a-f]{6}$/i.test(ncolor)) {
        // Make sure that HEX is a valid color
        return ncolor;
      }
    }
    return color;
  }
}
