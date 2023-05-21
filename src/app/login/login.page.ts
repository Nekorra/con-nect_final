import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { AlertController, ToastController, LoadingController, ActionSheetController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: any = FormGroup;
  showPassword = false;
  passwordToggleIcon = 'eye-off-outline';

  constructor(
    private router: Router, 
    private auth: AuthenticationService, 
    private fb: FormBuilder, 
    public loadingController: LoadingController,  
    private alertCtrl: AlertController, 
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController
    ) { }

  async ngOnInit() {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  
  navigatePrimaryRegister() {
    this.router.navigate(["/register"])
  }
 
  login() {
    this.auth.login(this.loginForm.value).then(async (res) => {
      let toast = await this.toastCtrl.create({
        duration: 3000,
        message: 'Successfully logged in!'
      });
      toast.present();
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

 
  async forgotPassword(){
    const alert = await this.alertCtrl.create({
      header: 'Forgot Password',
      buttons: [{
        text: 'Cancel',
      },
      {
        text: 'Reset',
        handler: data => {
          this.auth.resetPassword(data.email)
        },
      }],
      message: 'To reset the password, please enter your current email!',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email ID',
        }],
    });
    await alert.present();
  }


  togglePassword() {
    this.showPassword = !this.showPassword;
    if (this.passwordToggleIcon == 'eye-outline') {
      this.passwordToggleIcon = 'eye-off-outline';
    } else {
      this.passwordToggleIcon = 'eye-outline';
    }
  }

}