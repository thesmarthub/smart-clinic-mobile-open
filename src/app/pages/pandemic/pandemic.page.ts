import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { IonSlides } from "@ionic/angular";

@Component({
  selector: "app-pandemic",
  templateUrl: "./pandemic.page.html",
  styleUrls: ["./pandemic.page.scss"],
})
export class PandemicPage implements OnInit {
  totalScore = 0;
  tabs = [
    { title: "History", key: "history", type: "check" },
    {
      title: "Are you feeling any of these symptoms?",
      key: "examination",
      type: "check",
    },
    { title: "Result", key: "result", type: "result" },
  ];

  tabForms = {
    history: [
      {
        key: "active_health_worker",
        title:
          "Are you an active health care professional working in a facility with a confirmed case?",
        score: 5,
        type: "radio",
        value: false,
        touched: false,
      },
      {
        key: "close_contact",
        title: "Have you had any close contact with a confirmed case?",
        score: 5,
        type: "radio",
        value: false,
        touched: false,
      },
      {
        key: "visited_facility",
        title: "Have you visited any health facility with a confirmed case?",
        score: 5,
        type: "radio",
        value: false,
        touched: false,
      },
      {
        key: "visited_area",
        title: "Have you been to an area with a confirmed case?",
        score: 5,
        type: "radio",
        value: false,
        touched: false,
      },
    ],
    examination: [
      {
        key: "fever",
        title: "Fever",
        score: 1,
        type: "checkbox",
        value: false,
        touched: false,
      },
      {
        key: "dry_cough",
        title: "Dry Cough",
        score: 1,
        type: "checkbox",
        value: false,
        touched: false,
      },
      {
        key: "running_nose",
        title: "Running Nose",
        score: 1,
        type: "checkbox",
        value: false,
        touched: false,
      },
      {
        key: "nasal_congestion",
        title: "Nasal Congestion",
        score: 1,
        type: "checkbox",
        value: false,
        touched: false,
      },
      {
        key: "sore_throat",
        title: "Sore Throat",
        score: 1,
        type: "checkbox",
        value: false,
        touched: false,
      },
      {
        key: "loss_of_appetite",
        title: "Loss of Appetite",
        score: 1,
        type: "checkbox",
        value: false,
        touched: false,
      },
      {
        key: "fatigue",
        title: "Fatigue",
        score: 1,
        type: "checkbox",
        value: false,
        touched: false,
      },
      {
        key: "muscle_and_joint_pain",
        title: "Muscle and Joint pain",
        score: 1,
        type: "checkbox",
        value: false,
        touched: false,
      },
      {
        key: "shortness_of_breath",
        title: "Shortness of Breath",
        score: 1,
        type: "checkbox",
        value: false,
        touched: false,
      },
      {
        key: "diarrhea",
        title: "Diarrhea",
        score: 1,
        type: "checkbox",
        value: false,
        touched: false,
      },
    ],
    results: [{}],
  };

  possibleResults = [
    {
      min: 0,
      max: 4,
      message: "It is unlikely that you have contracted COVID-19.",
      risk_level: "low",
      status: "Low Risk",
      advice:
        "Follow the Government guidance and recommendation provided within your location by staying at home. Drink lots of Water and boost your immune system by taking healthy foods",
      color: "primary",
    },
    {
      min: 5,
      max: 6,
      message: "There is a low chance that you have contracted COVID-19.",
      risk_level: "moderate",
      status: "Moderate Risk",
      advice:
        "Stay at home and wait for further instruction.\nCall your state hotline or NCDC  on 0800 9700 0010.The state epidemiology team with support from NCDC will arrange for sample collection and transportation from your location to the lab.",
      color: "tertiary",
    },
    {
      min: 7,
      max: 100,
      message: "There is a high chance that you have contracted COVID-19",
      risk_level: "high",
      status: "High Risk",
      advice:
        "Stay at home and wait for further instruction.\nCall your state hotline or NCDC  on 0800 9700 0010.The state epidemiology team with support from NCDC will arrange for sample collection and transportation from your location to the lab.",
      color: "danger",
    },
  ];
  constructor(private router: Router) {}

  ngOnInit() {}

  ionViewDidLeave() {
    this.totalScore = 0;
    this.tabForms.history.forEach((item) => {
      item.touched = false;
      item.value = false;
    });
    this.tabForms.examination.forEach((item) => {
      item.touched = false;
      item.value = false;
    });
    console.log("leaving pandemic component");
  }

  scoreInc(value, form) {
    if (!form.touched && value === 0) {
      form.touched = true;
      return;
    }
    form.touched = true;
    if (value !== 0) {
      this.totalScore += form.score;
    } else {
      this.totalScore -= form.score;
    }
  }

  afterSlide(val, content) {
    console.log(val);
    content?.scrollToTop(1500);
  }

  resultCalc() {
    return this.possibleResults.find(
      (result) => this.totalScore >= result.min && this.totalScore <= result.max
    );
  }

  goHome() {
    this.router.navigateByUrl("/tabs");
  }
}
