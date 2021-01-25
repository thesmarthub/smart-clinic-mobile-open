import { Component, OnInit } from '@angular/core';
import { LoadHospitals } from 'src/app/actions/events/hospital';
import { HospitalService } from 'src/app/services/hospital.service';

@Component({
  selector: 'app-hospitals',
  templateUrl: './hospitals.page.html',
  styleUrls: ['./hospitals.page.scss'],
})
export class HospitalsPage implements OnInit {

  constructor(public hService: HospitalService) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.hService.triggerEvent(LoadHospitals)
  }

}
