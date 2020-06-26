import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController } from '@ionic/angular';
import { AccessProviders } from '../../providers/access-providers';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email_address: string = "";
  password: string = "";
  
  disabledButton;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    private accsPrvds: AccessProviders,
    private storage: Storage
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.disabledButton = false;
  }

  async tryLogin() {
    if(this.email_address == "") {
      this.presentToast('Email necessário');
    } else if(this.password == "") {
      this.presentToast('Senha necessária');
    } else {
        this.disabledButton = true;
        const loader = await this.loadingCtrl.create({
        message: 'Por Favor Aguarde...........'
        });
        loader.present();

        return new Promise(resolve => {
          let body = {
            aksi: 'proses_login',
            email_address : this.email_address,
            password : this.password
          }
          this.accsPrvds.postData(body, 'proses_api.php').subscribe((res:any)=>{
            if(res.success==true){
              loader.dismiss();
              this.disabledButton = false;
              this.presentToast('Login Successfuly');
              this.storage.set('storage_xxx', res.result);
              this.navCtrl.navigateRoot(['/home']);
            } else {
              loader.dismiss();
              this.disabledButton = false;
              this.presentToast('Email e senha inválidos');
            }
          },(err)=>{
            loader.dismiss();
            this.disabledButton = false;
            this.presentToast('Timeout');
          });
        });
    }
  }

  async presentToast(a) {
    const toast = await this.toastCtrl.create({
      message: a,
      duration: 1500  
    });
    toast.present();
  }

  openRegister() {
    this.router.navigate(['/register']);
  }
}
