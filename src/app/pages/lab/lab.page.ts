import { Component, OnInit } from '@angular/core';
import { LoadLabRequests } from 'src/app/actions/events/lab';
import { LoadedLabRequests } from 'src/app/actions/states/lab';
import { LabService } from 'src/app/services/lab.service';

@Component({
  selector: 'app-lab',
  templateUrl: './lab.page.html',
  styleUrls: ['./lab.page.scss'],
})
export class LabPage implements OnInit {

  constructor(public lService: LabService) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.lService.triggerEvent(LoadLabRequests)
  }

}
