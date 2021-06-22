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
import { AlertController, LoadingController } from "@ionic/angular";
import { CometChat } from "@cometchat-pro/chat";
import { IStaff } from "src/interfaces/staff";
import CometChatManager from "src/cometchat-pro-angular-ui-kit/CometChatWorkspace/projects/angular-chat-ui-kit/src/utils/controller";

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
    private _alertCtrl: AlertController,
    private _loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  ionViewDidLeave() {
    this.displayChatView = false;
  }

  async initialize() {
    const loggedInUser = await CometChat.getLoggedinUser().catch(e => null);
    if (loggedInUser?.getName()) {
      return this.setupChat(loggedInUser);
    }
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
        setTimeout(() => {
          this.initialize();
        }, 5000);
        // Check the reason for error and take appropriate action.
      }
    );
  }

  login() {
    console.log("authkey", this.store.cometAuthKey);
    this._loadingCtrl.create();

    CometChat.login(this.store.cometAuthKey)
      .then(
        async (user) => {
          console.log("login successful", user)
          this.setupChat(user);

          // const groups = await CometChat.getJoinedGroups();
          // console.log("My groups ", groups);

          // var groupsRequest = new CometChat.GroupsRequestBuilder()
          //   .setLimit(10)
          //   .build();

          // groupsRequest.fetchNext().then(
          //   (groupList) => {
          //     /* groupList will be the list of Group class */
          //     console.log("Groups list fetched successfully", groupList);
          //     if (this.store.userType === "doctor") {
          //       this.displayChatView = true;
          //     }
          //     /* you can display the list of groups available using groupList */
          //     groupList.forEach((group: CometChat.Group) => {
          //       CometChat.deleteGroup(group?.getGuid()).then(
          //         (hasLeft) => {
          //           console.log("Group deleted successfully:", hasLeft);
          //         },
          //         (error) => {
          //           console.log("Group deleting failed with exception:", error);
          //         }
          //       );
          //     });
          //   },
          //   (error) => {
          //     console.log("Groups list fetching failed with error", error);
          //   }
          // );
        },
        (error) => {
          console.log("Login failed with exception:", { error });
          CometChat;
        }
      )
      .finally(() => this._loadingCtrl.dismiss());
  }

  setupChat(user) {
    console.log("Setting up:", { user });
    if (this.store.activeChatDoctor) {
      this.createGroup(this.store.activeChatDoctor);
    }

    if (this.store.userType === "doctor") {
      this.displayChatView = true;
    }
  }

  async createGroup(doctor) {
    if (this.store.userType === "doctor") {
      return (this.displayChatView = true);
    }

    // new CometChat.UsersRequestBuilder().build()

    // const chatGroup = await CometChat.getGroup(
    //   `${this.store.user.smart_code}${doctor.smart_code}`
    // )
    //   .then((group) => group)
    //   .catch((e) => {
    //     console.log(e);
    //     return null;
    //   });
    // console.log("Created chat group", chatGroup);

    var group = new CometChat.Group(
      `${this.store.user.smart_code}${doctor.smart_code}`,
      `${doctor.designation || ""} ${doctor.fname} ${doctor.lname}`,
      "private",
      "westy"
    );

    this.chatService
      .runner(`users/${this.store.user._id}/friends`, "POST", {
        accepted: [doctor._id],
      })
      .then((res) => {
        console.log("Friend", res);
        this.store.activeChatDoctor = doctor;
        this.displayChatView = true;
      })
      .catch((e) => console.log(e, "Add friend error"));

    // CometChat.createGroup(group)
    //   .then(
    //     (group) => {
    //       this.chatService
    //         .runner(`groups/${group.getGuid()}/members`, {
    //           participants: [doctor._id],
    //         })
    //         .then((res) => console.log(res))
    //         .catch((err) => console.log(err));
    //       console.log("group created", { group });
    //       this.displayChatView = true;
    //     },
    //     (err) => {
    //       console.log("Group Error", { err });
    //       this.displayChatView = true;
    //     }
    //   )
    //   .catch((e) => {
    //     console.log(e);
    //     this.displayChatView = true;
    //   });
  }

  ionViewDidEnter() {
    this.initialize();
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
    if (this.store.userType !== "doctor") {
      this.fetchDoctors();
      this.presentDepartments();
    }
  }

  presentDepartments() {
    // this._deptService.presentActionSheet(this.onSelectDept);
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
    this._docService.fetchDoctors(this.selectedDept?.route || "").subscribe(
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

  async startChat(doctor: IStaff) {
    const walletBalance = await this.fetchWalletBalance();
    if (!walletBalance || walletBalance < 100) {
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
    } else {
      const alertCtrl2 = await this._alertCtrl.create({
        header: "Starting Consultation",
        message: `550 units will be deducted from your wallet for this transaction. <br> Do you want to proceed?`,
        buttons: [
          {
            text: "Yes",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {
              this.createGroup(doctor);
            },
          },
          {
            text: "No",
            handler: () => {},
          },
        ],
      });

      await alertCtrl2.present();
    }

    // if (!number) number = this.store.currentHospital.phone1;
    // this.callNumber
    //   .callNumber(number, true)
    //   .then((res) => console.log("Launched dialer!", res))
    //   .catch((err) => console.log("Error launching dialer", err));
  }
}
