import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Store } from '../../engine/store';
import * as moment from 'moment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  store = new Store;
  formData = new FormData();
  show: boolean = false
  imageModal: boolean = false
  profile: any = {}
  profileImage = ""
  changePass: any = {
    password: "",
    newPassword: "",
    confirmPassword: ""
  }

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    console.log(this.store.user._id)
    this.authService.initializeProfile(this.store.user._id)
    this.authService.patient_profile.subscribe((data) => {
      console.log(data, "data")
      this.profile = data
      if (data) {
        this.profile.d_o_b = moment(this.profile.d_o_b).format('DD/MMM/YYYY')
        if (this.profile.profileImage) {
          this.profileImage = this.profile.profileImage
        } else {
          this.profileImage = "https://bulma.io/images/placeholders/1280x960.png"
        }
        // this.profileImage = "https://bulma.io/images/placeholders/1280x960.png"
      }
    })

  }

  editProfile() {
    this.authService.editUserDetails(this.profile)
  }

  showChangePassword() {
    if (this.show == true) {
      this.show = false
    }
    else {
      this.show = true
    }

  }
  cancel() {
    this.show = false;
  }

  changePassword() {

    if (this.changePass.newPassword != this.changePass.confirmPassword) {
      alert("please confirm pass")
    } else {
      this.authService.updatePassword(this.changePass, this.store.user._id)
    }
  }

  activateImageModal() {
    this.imageModal = true
    console.log("see em")
  }

  deActivateImageModal() {
    this.imageModal = false
    console.log("see em")
  }

  fileChange(file: any) {
    this.formData.append("files", file.target["files"][0]);
    console.log(this.formData.get("files"))
  }

  updateProfileImage(){
    this.authService.updateUserImage(this.formData, this.store.user._id)
  }

}
