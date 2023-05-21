

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: any;
  firstName: string = "";
  lastName: string = "";
  image: any;
  bio: any;

  constructor(
    private auth: AuthenticationService,
    private database: DatabaseService,
		private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private router: Router,
    private toastController: ToastController,

  ) { }

  async ngOnInit() {
    await this.getUser();
  } 

  async getUser() {
    await this.auth.getUser().then((user) =>{ 
      this.user = user
    })
    this.getUserInfo();
  }

  async getUserInfo() {
    await this.auth.getUserInfo(this.user.uid).then((userInfo: any) => {
      this.firstName = userInfo.firstName;
      this.lastName = userInfo.lastName;
      if(userInfo.image) {
        this.image = userInfo.image;
      }
      if(userInfo.bio) {
        this.bio = userInfo.bio;
      }
    })
  }
  
  async uploadImage() {
    this.image =  await Camera.getPhoto({
			quality: 90,
			allowEditing: true,
			resultType: CameraResultType.Uri,
			source: CameraSource.Photos // Camera, Photos or Prompt!
		});
    console.log(this.image);
    var img = new Image();
    img.src = this.image.webPath;
    await this.getBase64ImageFromUrl(this.image.webPath).then((data) => {
      this.image = data;
      console.log(this.image);
    });
    await this.database.addImage(this.image, this.user.uid);
    this.getUserInfo();
  }

  async getBase64ImageFromUrl(imageUrl: any) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
  
    return new Promise((resolve, reject) => {
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
          resolve(reader.result);
      }, false);
  
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }

  

  async updateBio() {
    await this.database.updateBio(this.bio, this.user.uid).then(async (res: any) => {
      const alert = await this.alertCtrl.create({
        header: 'Success',
        buttons: ['OK'],
      });
      await alert.present();
    });
  }

  

  
  


}