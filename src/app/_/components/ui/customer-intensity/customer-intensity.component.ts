import { Component, Input, OnInit } from '@angular/core';
import { webConfig } from 'src/app/web-config';
import { CustomerStatsService } from '../customer-stats-range/customer-stats-range.service';
import { UnitSizeComparPipe } from "../../../pipes/unit-size-compar.pipe";
@Component({
  selector: 'app-customer-intensity',
  templateUrl: './customer-intensity.component.html',
  styleUrls: ['./customer-intensity.component.scss'],
})
export class CustomerIntensityComponent implements OnInit {
  categoriesData = [];
  categoriesIntensityIconClassCss: any = webConfig.categoriesIntensityIconClassCss;
  sub: any = {};
  movements = [];
  intervalMvts= [];
  cardioMvts=[];

  constructor(private customerStatsService: CustomerStatsService, private unitSizeComparPipe: UnitSizeComparPipe) { }

  ngOnInit() {
    this.categoriesData[0] = this._setCategory("Max intensities","#more than", 0);
    this.categoriesData[1] = this._setCategory("Challenging Intensities","#between eighty", 1);
    this.categoriesData[2] = this._setCategory("Moderate Intensities","#between seventy", 2);
    this.categoriesData[3] = this._setCategory("Low Intensities","#less than", 3);
    this.categoriesData.map((category) => {
      let style = this.categoriesIntensityIconClassCss.filter(
        (style) => style.id == category.id
      );
      category.style = style.shift();
    });
    this.sub.onStatsUpdated = this.customerStatsService.onStatsUpdated.subscribe(
      (component) => {
        this.categoriesData.forEach((category) => {
          category.percentage = 0;
          category.volumeCategory = 0;
        });
        const stats = component.stats;
        this.movements = stats.movements;
        this.cardioMvts = stats.cardioMvt;
        this.intervalMvts = stats.intervalMvt;
  
        let totalMovements = 0;

        for (let mvtId in this.movements) {
          totalMovements += this.movements[mvtId].intensiteSize;
        }

        this.cardioMvts?.forEach((mvt) => {
          if(mvt.interval) {
            totalMovements += (mvt.interval / 100);
            const intensity = Math.round(mvt?.value);
            const volume = mvt.interval / 100;
            this.updateVolume(intensity, volume);
          }
        });

        this.intervalMvts?.forEach((mvt) => {
          if(mvt.interval) {
            totalMovements += (mvt.interval * mvt.set)/10;
            const intensity = Math.round(mvt.value);
            const volume = (mvt.interval * mvt.set)/10;
            this.updateVolume(intensity, volume);
          }
        });

        let intensity:number;
        let intensityPercentage;
        let percentage;


        for (let mvtId in this.movements) {
          this.movements[mvtId]?.movements?.map((movement) => {
            movement?.sets?.map((set) => {
              if (set.unit == 1 || set.unit == 2) {
                intensityPercentage =  this.unitSizeComparPipe.transform(set.value, movement.max_value, movement.max_unit, set.unit );
                percentage = intensityPercentage.split(" ")[0];
                intensity = +percentage;
              } else {
                intensity = Math.round(set.value);
              }

        
              const volume = set.rep * set.set;
              this.updateVolume(intensity, volume);
            })
            
        })
        }  
        if(totalMovements != 0) {
          this.categoriesData[0].percentage = Math.round((this.categoriesData[0].volumeCategory / totalMovements) * 100);
          this.categoriesData[1].percentage = Math.round((this.categoriesData[1].volumeCategory / totalMovements) * 100);
          this.categoriesData[2].percentage = Math.round((this.categoriesData[2].volumeCategory / totalMovements) * 100);
          this.categoriesData[3].percentage = Math.round((this.categoriesData[3].volumeCategory / totalMovements) * 100);
        }
      }
    );
    this.sub.onStatsUpdatedStart = this.customerStatsService.onStatsUpdatedStart.subscribe(
      () => {
        this.movements = [];
      }
    );
  }

  updateVolume(intensity, volume) {
    if(intensity >= 90) {
      this.categoriesData[0].volumeCategory  += volume;
    } else if (intensity >= 80 && intensity <= 89)  {
      this.categoriesData[1].volumeCategory  += volume;
    } else if(intensity >= 70 && intensity <= 79) {
      this.categoriesData[2].volumeCategory  += volume;
    } else {
      this.categoriesData[3].volumeCategory  += volume;
    }
  }
  ngOnDestroy(): void {
    this.sub.onStatsUpdated && this.sub.onStatsUpdated.unsubscribe();
    this.sub.onStatsUpdatedStart && this.sub.onStatsUpdatedStart.unsubscribe();
  }
  private setCategoryStats(movement, index, totalMovements) {
    this.categoriesData[index].movements.push(movement);
    this.categoriesData[index].volumeCategory += movement.movements.length;
  }
  private _setCategory(label, subtitle, id) {
    return {
      id: id,
      label: label,
      percentage: 0,
      subtitle: subtitle,
      volumeCategory: 0,
      movements: []
    };
  }
}
