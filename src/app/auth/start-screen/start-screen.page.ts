import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.page.html',
  styleUrls: ['./start-screen.page.scss'],
})
export class StartScreenPage implements OnInit {
frameClass = "frame"
doctorQuestion = false
  constructor(public router:Router) { }

  ngOnInit() {
    setTimeout(
      ()=> {
        this.frameClass = "frame loaded"
        
        setInterval(()=>{ this.doctorQuestion = true }, 7000);
      }, 200)

   
  }



}
