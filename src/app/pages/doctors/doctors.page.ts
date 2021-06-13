import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Store } from "src/app/engine/store";
import { ChatMessage } from "src/app/models/chat-message";
import { ChatService } from "src/app/services/chat.service";
import { DepartmentService } from "src/app/services/department.service";
import { DoctorService } from "src/app/services/doctor.service";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { PaymentService } from "src/app/services/payment.service";
import { AlertController } from "@ionic/angular";
import { CometChat } from "@cometchat-pro/chat";
import { IStaff } from "src/interfaces/staff";

@Component({
  selector: "app-doctors",
  templateUrl: "./doctors.page.html",
  styleUrls: ["./doctors.page.scss"],
})
export class DoctorsPage implements OnInit {
  selectedDept;
  doctors: BehaviorSubject<any[]> = new BehaviorSubject([]);
  services: BehaviorSubject<any[]> = new BehaviorSubject([]);
  filteredDoctors: BehaviorSubject<any[]> = new BehaviorSubject([]);
  searchInput = "";
  loadingDoctors = false;
  store = new Store();
  decision: "current_hospital_doctors" | "all_doctors";
  displayChatView = false;
  constructor(
    private _docService: DoctorService,
    private _deptService: DepartmentService,
    private router: Router,
    private chatService: ChatService,
    private callNumber: CallNumber,
    private _paymentService: PaymentService,
    private _alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    const appID = "3474634cc00cc93";
    const region = "US";
    const appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(region)
      .build();
    CometChat.init(appID, appSetting).then(
      () => {
        console.log("AUTH SUCCESS");
        console.log("Initialization completed successfully");
        this.login();
        // You can now call login function.
      },
      (error) => {
        console.log("AUTH FAILED");
        console.log("Initialization failed with error:", error);
        // Check the reason for error and take appropriate action.
      }
    );
  }

  login() {
    console.log("Trying to login!!!");
    const authKey = "689e527b4fdef76814a24c0b3b6e062d13ba681a";
    const uid = "SUPERHERO2";

    CometChat.login(uid, authKey).then(
      async (user) => {
        console.log("Login Successful:", { user });
        // const groups = await CometChat.getJoinedGroups();
        // console.log("My groups ", groups);

        var groupsRequest = new CometChat.GroupsRequestBuilder()
          .setLimit(10)
          .build();

        groupsRequest.fetchNext().then(
          (groupList) => {
            /* groupList will be the list of Group class */
            console.log("Groups list fetched successfully", groupList);

            /* you can display the list of groups available using groupList */
            groupList.forEach((group: CometChat.Group) => {
              CometChat.leaveGroup(group?.getGuid()).then(
                hasLeft => {
                  console.log("Group left successfully:", hasLeft);
                },
                error => {
                  console.log("Group leaving failed with exception:", error);
                }
              );
            })
          },
          (error) => {
            console.log("Groups list fetching failed with error", error);
          }
        );
      },
      (error) => {
        console.log("Login failed with exception:", { error });
      }
    );
  }

  createGroup(groupId, groupName) {
    var group = new CometChat.Group(groupId, groupName, "private", "westy");

    CometChat.createGroup(group).then(
      (group) => {
        console.log("group created", { group });
        this.displayChatView = true;
      },
      (err) => {
        console.log("Group Error", { err });
        this.displayChatView = true;
      }
    );
  }

  ionViewDidEnter() {
    // this.selectedDept = this._deptService.getGOPDDept();
    // this._docService.presentActionSheet(async (data) => {
    //   this.decision = data;
    //   if (data === "current_hospital_doctors") {
    //     this._docService.fetchDoctors;
    //   } else {
    //     const doctors = await this._docService.fetchPrivatePractitioners();
    //     this.doctors.next(doctors);
    //     this.filterDoctors(this.searchInput);
    //   }
    // });

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

  async fetchWalletBalance() {
    const walletBalance = await this._paymentService.fetchWalletBalance();

    return walletBalance;
  }

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

  async initiateChat(doctor) {
    this.chatService.sendRequest(doctor._id);
    this.chatService.activeReceiverName = `${doctor.title || "" + " "}${
      doctor.fname
    } ${doctor.lname}`;
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

  async startChat(doctor: IStaff) {
    const walletBalance = await this.fetchWalletBalance();
    if (!walletBalance || walletBalance < 500) {
      const alertCtrl = await this._alertCtrl.create({
        header: `Insufficient Funds`,
        message: `You must have at least 550 naira in your wallet. You currently have ${
          walletBalance || 0
        } naira.`,
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            handler: (blah) => {},
          },
          {
            text: "Fund Wallet",
            handler: () => {
              this.router.navigate(["/wallet"], {
                queryParams: {
                  showBack: "yes",
                },
              });
            },
          },
        ],
      });

      await alertCtrl.present();
      return;
    }
    this.createGroup(
      `${this.store.user.smart_code}${doctor.smart_code}`,
      `${doctor.designation || ""} ${doctor.fname} ${doctor.lname}`
    );
    // if (!number) number = this.store.currentHospital.phone1;
    // this.callNumber
    //   .callNumber(number, true)
    //   .then((res) => console.log("Launched dialer!", res))
    //   .catch((err) => console.log("Error launching dialer", err));
  }
}
