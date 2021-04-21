import { Component, OnInit } from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-coach-settings-plan-modal',
  templateUrl: './coach-settings-plan-modal.component.html',
  styleUrls: ['./coach-settings-plan-modal.component.scss']
})
export class CoachSettingsPlanModalComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
  ) { }

  ngOnInit(): void {}

  cancel() {
    this.bsModalRef.hide();
  }
}


