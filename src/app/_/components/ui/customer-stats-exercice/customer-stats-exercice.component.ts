import { Component, Input, OnInit, ɵConsole } from "@angular/core";
import { webConfig } from 'src/app/web-config';
import { CustomerStatsService } from "../customer-stats-range/customer-stats-range.service";

@Component({
  selector: "app-customer-stats-exercice",
  templateUrl: "./customer-stats-exercice.component.html",
  styleUrls: ["./customer-stats-exercice.component.scss"],
})
export class CustomerStatsExerciceComponent implements OnInit {
  @Input() isFromUrl = true;

  movements: any = [];
  categoriesData: any = [];
  sub: any = {};
  categoriesIconClassCss: any = webConfig.categoriesIconClassCss;
  constructor(private customerStatsService: CustomerStatsService) {}

  ngOnInit(): void {
    this.sub.onStatsUpdated = this.customerStatsService.onStatsUpdated.subscribe(
      (component) => {
        this.movements = component.movements; 
        let totalMovements = 0;
        this.movements.forEach(mvt => {
          totalMovements += mvt.movements.length;
        });
        this.movements.map(mvt => { 
          mvt.percentage = (mvt.movements.length / totalMovements)*100;
       });   
        console.log(this.movements)         
        this.categoriesData = component.categoriesData;      
        let totalMovementsCategories = 0;
        this.categoriesData.forEach(category => {
         totalMovementsCategories += category.movements.length;
       });  
    
        this.categoriesData.map(category => {
           let style = this.categoriesIconClassCss.filter(style => style.id == category.id);          
           category.style = style.shift();           
           category.percentage = (category.movements.length / totalMovementsCategories)*100;
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

  searchIconAndClass(id){
    return this.categoriesIconClassCss.filter(style => style.id === id);
  }
  getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
  }
}
