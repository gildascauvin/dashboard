import { Component } from '@angular/core';
import { DoorgetsTranslateService } from 'doorgets-ng-translate';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private doorgetsTranslateService: DoorgetsTranslateService) {}

  ngOnInit() {
    this.doorgetsTranslateService.init({
      languages: ['en', 'fr'],
      current: 'fr',
      default: 'fr'
    });
  }
}

