import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { AccessProviders } from '../../providers/access-providers';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  your_name: string = "";
  genero: string = "";
  date_birth: string = "";
  email_address: string = "";
  password: string = "";
  confirm_pass: string = "";
  
  disabledButton;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private accsPrvds: AccessProviders
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.disabledButton = false;
  }

  async tryRegister() {
    if(this.your_name == "") {
      this.presentToast('Nome necessário');
    } else if(this.genero == "") {
      this.presentToast('Gênero necessário');
    } else if(this.date_birth == "") {
      this.presentToast('Data de Nascimento Necessária');
    } else if(this.email_address == "") {
      this.presentToast('Email necessário');
    } else if(this.password == "") {
      this.presentToast('Senha necessária');
    } else if(this.confirm_pass != this.password) {
      this.presentToast('A senha não é a mesma');
    } else {
        this.disabledButton = true;
        const loader = await this.loadingCtrl.create({
        message: 'Por Favor Aguarde...........'
        });
        loader.present();

        return new Promise(resolve => {
          let body = {
            aksi: 'proses_register',
            your_name : this.your_name,
            genero : this.genero,
            date_birth : this.date_birth,
            email_address : this.email_address,
            password : this.password
          }
          this.accsPrvds.postData(body, 'proses_api.php').subscribe((res:any)=>{
            if(res.success==true){
              loader.dismiss();
              this.disabledButton = false;
              this.presentToast(res.msg);
              this.router.navigate(['/login']);
            } else {
              loader.dismiss();
              this.disabledButton = false;
              this.presentToast(res.msg);
            }
          },(err)=>{
            loader.dismiss();
            this.disabledButton = false;
            this.presentAlert('Timeout');
          });
        });
    }
  }

  async presentToast(a) {
    const toast = await this.toastCtrl.create({
      message: a,
      duration: 1500,
      position: 'top'
    });
    toast.present();
  }
  async presentAlert(a) {
      const alert = await this.alertCtrl.create({
        header: a,
        backdropDismiss: false,
        buttons: [
          {
            text: 'Fechar',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Tente novamente',
            handler: () => {
              this.tryRegister();
            }
          }
        ]
      });

      await alert.present();
  }

}
