import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Store } from "src/app/engine/store";
import { ChatMessage } from "src/app/models/chat-message";
import { ChatService } from "src/app/services/chat.service";
import { DepartmentService } from "src/app/services/department.service";
import { DoctorService } from "src/app/services/doctor.service";

@Component({
  selector: "app-doctors",
  templateUrl: "./doctors.page.html",
  styleUrls: ["./doctors.page.scss"],
})
export class DoctorsPage implements OnInit {
  selectedDept;
  doctors: BehaviorSubject<any[]> = new BehaviorSubject([]);
  filteredDoctors: BehaviorSubject<any[]> = new BehaviorSubject([]);
  searchInput = "";
  loadingDoctors = false;
  store = new Store()
  constructor(
    private _docService: DoctorService,
    private _deptService: DepartmentService,
    private router: Router,
    private chatService: ChatService
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.selectedDept = this._deptService.getGOPDDept();
    this.fetchDoctors();
    this.presentDepartments();
  }

  presentDepartments() {
    this._deptService.presentActionSheet(this.onSelectDept);
  }

  onSelectDept = (data) => {
    this.selectedDept = data;
    this.fetchDoctors();
  };

  fetchDoctors() {
    console.log("Fetch doctors");
    this.loadingDoctors = true;
    this._docService
      .fetchDoctors(this.selectedDept?.route || "general-health")
      .subscribe(
        (res) => {
          this.doctors.next(res?.result || []);
          this.filterDoctors(this.searchInput);
        },
        (err) => {
          console.log(err);
        },
        () => {
          this.loadingDoctors = false;
        }
      );
  }

  filterDoctors(searchInput) {
    if (!searchInput) {
      return this.filteredDoctors.next(this.doctors.value.map((doc) => doc));
    }
    searchInput = searchInput.toLowerCase();
    const filteredDoctors = this.doctors.value.filter((doc) => {
      return (
        doc.fname?.toLowerCase()?.includes(searchInput) ||
        doc.lname?.toLowerCase()?.includes(searchInput) ||
        searchInput.includes(doc.fname?.toLowerCase()) ||
        searchInput.includes(doc.lname?.toLowerCase())
      );
    });
    this.filteredDoctors.next(filteredDoctors);
  }

  initiateChat(doctor) {
    this.chatService.sendRequest(doctor._id);
    // this.chatService.sendMessage(
    //   new ChatMessage(
    //     this.store.userFullName,
    //     `${doctor.fname} ${doctor.lname}`,
    //     doctor.id,
    //     "Hello Doc",
    //     this.chatService.activeChatKey,
    //     100082
    //   )
    // );
    // this.router.navigateByUrl("/tabs/chat");
  }
}
