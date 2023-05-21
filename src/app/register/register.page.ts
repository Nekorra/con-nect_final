import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
//import { Storage } from '@ionic/storage-angular';

import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: any = FormGroup;  
  showPassword = false;
  passwordToggleIcon = 'eye-off-outline';
  role: any;

  constructor(
    private router: Router, 
    private auth: AuthenticationService, 
    private fb: FormBuilder, 
    public loadingController: LoadingController,  
    private alertCtrl: AlertController, 
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController
    //private storage: Storage
  ) { }

  async ngOnInit() {
    //this.storage.create();
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]],
    }); 
  }

  navigateLogin() {
    this.router.navigate(['/login']);
  }

  register() {
    console.log("test")
    console.log(this.registerForm.value)
    this.auth.register(this.registerForm.value).then(async (res) => {
      let toast = await this.toastCtrl.create({
        duration: 3000,
        message: 'Successfully created new Account!'
      });
      toast.present();
      //this.storage.set("firstName", this.registerForm.controls["firstName"].value);
      this.router.navigate(['/tabs/home']);
    }, async (err) => {
      let alert = await this.alertCtrl.create({
        header: 'Error',
        message: err.message,
        buttons: ['OK']
      });
      alert.present();  
    })
    

  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Logging In...',
      duration: 2000
    });
    await loading.present();
  }


  togglePassword() {
    this.showPassword = !this.showPassword;
    if (this.passwordToggleIcon == 'eye-outline') {
      this.passwordToggleIcon = 'eye-off-outline';
    } else {
      this.passwordToggleIcon = 'eye-outline';
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Organization',
          handler: () => {
            this.role = 'organization';
            this.registerForm.controls['role'].setValue('organization');
          }
        },
        {
          text: 'Individual',
          handler: () => {
            this.role = 'individual';
            this.registerForm.controls['role'].setValue('individual');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();
  }
}
