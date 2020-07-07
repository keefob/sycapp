import { Component, OnInit } from '@angular/core';

import { LoadingController, AlertController } from '@ionic/angular';

import { ModalController } from '@ionic/angular';

import { DomSanitizer } from '@angular/platform-browser';

import { ParameterService } from '../api/parameter.service';
import { CameraPage } from './camera.page';
import { DeliveryService } from '../api/delivery.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  showFaceCapture: boolean = false;

  textHeader: string = 'Apartment Information';

  imageBase64: string;
  successImageBase64: string;

  hasCaptureImage: boolean = false;

  showGuestInformation: boolean = false;

  showFinish: boolean = false;

  listUnitEntity: any[] = [];

  listReasonVisit: any[] = [];

  constructor(
    public alertController: AlertController,
    public loadingController: LoadingController,
    public _DomSanitizationService: DomSanitizer,
    private data: ParameterService,
    public modalController: ModalController,
    private deliveryService: DeliveryService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.imageBase64 = this.data.imageCameraBase64;
    this.successImageBase64 = this.data.successImageBase64;

    //const routeSubscription = this.activatedRoute.params.subscribe(params => {

      this.listUnitEntity = [];
    this.listReasonVisit = [];

      this.deliveryService.getToken(this.data.clientId,this.data.clientSecret,
             this.data.user, this.data.pass).subscribe(
        res => {
          if (res) {
            localStorage.setItem("outh2_token", res.access_token);
            this.deliveryService.getUnitEntity(parseInt(localStorage.getItem('centity'))).subscribe(
              listResult => {
                this.listUnitEntity = listResult.listUnitEntity;
              }
            );

            this.deliveryService.getReasonsVisit().subscribe(
              listResult => {
                this.listReasonVisit = listResult._embedded.reasonsVisits;
              }
            );
            

          }
        },
        error => {

        },
        () => {
        }
      );

    //});


  }

  continueFirst(event) {
    this.showGuestInformation = true;
    this.textHeader = "Visitor Information";
  }

  saveProfile(event) {



    this.showFaceCapture = true;
    this.textHeader = 'Take a Picture of your ID';

  }

  async modalCamera() {

    console.log("present modalCamera");

    const modal = await this.modalController.create({
      component: CameraPage
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        //let imageBase64 = dataReturned.data;
        //console.log('Return Data modalCamera:'+ dataReturnedLoad);

        //let base64Image = 'data:image/jpeg;base64,' + dataReturned.data;
        this.imageBase64 = dataReturned.data;

      }
    });

    return await modal.present();
  }

  async captureFace() {

    const loading = await this.loadingController.create({
      message: 'Taking a photo ...'
    });

    await loading.present();


    /*
    setTimeout(() => {



      let base64Image = this.option == 1 ? this.data.id_1_Base64 : this.data.id_2_Base64;
      this.imageBase64 = base64Image;

      this.hasCaptureImage = true;

      if (this.option == 2) {
        this.saveIdentification();
      }


      loading.dismiss();
    }, 3000);
*/


    /*
    this.camera.getPicture(this.cameraOptions).then((imageData) => {
      // this.camera.DestinationType.FILE_URI gives file URI saved in local
      // this.camera.DestinationType.DATA_URL gives base64 URI

      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.imageBase64 = base64Image;

      this.hasCaptureImage = true;

      if(this.option==2){
        this.saveIdentification();
      }

      loading.dismiss();

    }, (err) => {

      console.log(err);

      if (this.data.imageCameraBase64 === this.imageBase64) {
        this.hasCaptureImage = true;
      } else {
        this.hasCaptureImage = false;
      }

      loading.dismiss();

    });
    */


  }

  option: number = 1;

  textFinish: string = "Capture another side";

  saveIdentification() {

    if (this.option == 1) {
      console.log("entro por 1");
      this.showFaceCapture = true;
      this.imageBase64 = this.data.imageCameraBase64;

      this.hasCaptureImage = false;
      this.option = 2;

      this.textFinish = "Finish";

      return;

    }

    if (this.option == 2) {
      console.log("entro por 2");
      this.option = 3;
      /*
      this.showFaceCapture = true;
      this.imageBase64 = this.data.imageCameraBase64;
  
      this.hasCaptureImage = false;
      */

      return;

    }

    if (this.option == 3) {
      this.showFinish = true;
    }



  }

  //imageBase64Id1 = this.data.id_1_Base64;


}
