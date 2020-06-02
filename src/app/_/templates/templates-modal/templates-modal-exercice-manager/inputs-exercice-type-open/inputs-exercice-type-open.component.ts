import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from '../../../users.service';
import { webConfig } from '../../../../../web-config';

@Component({
  selector: 'tpc-inputs-exercice-type-open',
  templateUrl: './inputs-exercice-type-open.component.html',
  styleUrls: ['./inputs-exercice-type-open.component.scss']
})
export class InputsExerciceTypeOpenComponent implements OnInit {
	@Input() model: any = {};
  configExercices: any = webConfig.exercices;
  movements: any[] = [];
  sub: any;

  constructor(
  	private usersService: UsersService,
  	) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }

  onSelectedItem(item) {
    console.log('item', item);
    this.model.movements.push(item);
  }

  onChangeSearch(val) {
    if (val) {
      this.sub && this.sub.unsubscribe();

      this.sub = this.usersService.getAllMovements(val).subscribe((response: any) => {
        console.log('response', response);
        if (response && response.content) {
          this.movements = response.content;
        }
      });
    }
  }

}
