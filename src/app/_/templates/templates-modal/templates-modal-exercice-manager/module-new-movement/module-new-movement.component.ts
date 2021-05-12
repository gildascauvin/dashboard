import {Component, EventEmitter, Inject, Input, OnInit, Output} from "@angular/core";
import * as _ from "lodash";
import { webConfig } from "../../../../../web-config";
import { UsersService } from "../../../users.service";
import {ToastrService} from "ngx-toastr";
import {DOCUMENT} from "@angular/common";
import {ResizeService} from "../../../../services/ui/resize-service.service";

@Component({
  selector: "tpc-module-new-movement",
  templateUrl: "./module-new-movement.component.html",
  styleUrls: ["./module-new-movement.component.scss"],
})
export class ModuleNewMovementComponent implements OnInit {

  @Output() onCreatedNewMovement: EventEmitter<any> = new EventEmitter();
  @Output() onCloseNewMovement: EventEmitter<any> = new EventEmitter();

  size: number = 1;
  responsiveSize: number = 768;

  @Input() newMovement : any = [{
    name: '',
    categoryId: '',
    unit: '0',
    imageUrl: ''
  }];

  categories: any = [];

  sub: any;

  constructor(
    private usersService: UsersService,
    private toastrService: ToastrService,
    @Inject(DOCUMENT) private _document,
    private resizeSvc: ResizeService,
  ) {}

  ngOnInit() {
    this.detectScreenSize();

    this.sub = this.usersService
      .getAllCategories()
      .subscribe((response: any) => {
        this.categories = response.content;
      });
  }

  closeNewMovementForm() {
    this.onCloseNewMovement.emit();
  }

  saveNewMovementForm() {
    this.usersService.createMovement(this.newMovement.name, this.newMovement.categoryId, this.newMovement.unit, this.newMovement.imageUrl)
      .subscribe((response: any) => {
        if (response.errors) {
          this.toastrService.error(response.message);
        } else {
          this.toastrService.success("#Movement created!");
          this.closeNewMovementForm();
          this.onCreatedNewMovement.emit(response.movement);
        }
      });
  }

  private detectScreenSize() {
    const currentSize = this._document.body.clientWidth;
    this.size = currentSize;
    this.resizeSvc.onResize(currentSize);
  }

}
