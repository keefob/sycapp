import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';

import { LoadingController, AlertController, IonInput } from '@ionic/angular';

import { ModalController } from '@ionic/angular';

import { DomSanitizer } from '@angular/platform-browser';

import { ParameterService } from '../api/parameter.service';
import { CameraPage } from './camera.page';
import { DeliveryService } from '../api/delivery.service';
import { ActivatedRoute } from '@angular/router';
import { Observer, Observable } from 'rxjs';

import { PopoverController } from '@ionic/angular';
import { FilterListPage } from './filter-list.page';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  showFaceCapture: boolean = false;

  textHeader: string = 'Apartment Information';

  imageBase64_1: string;

  imageBase64_2: string;

  successImageBase64: string;

  hasCaptureImage: boolean = false;

  showGuestInformation: boolean = false;

  showFinish: boolean = false;

  listUnitEntity: any[] = [];
  listFilterUnitEntity: any[] = [];

  listReasonVisit: any[] = [];

  //unitEntity:any;
  unitEntityDesc: any;

  resident_name;
  resident_lastname;
  resident_email;
  id_reason_visit;
  cunit_entity;
  visitor_mobile_phone_number;
  visitor_name;
  visitor_lastname;
  visitor_email;
  file1;fileName1;
  file2;fileName2;

  constructor(
    public alertController: AlertController,
    public loadingController: LoadingController,
    public _DomSanitizationService: DomSanitizer,
    private data: ParameterService,
    public modalController: ModalController,
    private deliveryService: DeliveryService,
    private activatedRoute: ActivatedRoute,
    public popoverController: PopoverController) {
     }

  ngOnInit() {

    this.imageBase64_1 = this.data.imageCameraBase64;
    this.imageBase64_2 = this.data.imageCameraBase64;
    this.successImageBase64 = this.data.successImageBase64;

    //const routeSubscription = this.activatedRoute.params.subscribe(params => {

      this.listUnitEntity = [];
    this.listReasonVisit = [];

    this.deliveryService.getUnitEntity(parseInt(localStorage.getItem('centity'))).subscribe(
      listResult => {
        this.listUnitEntity = listResult.listUnitEntity;
      }
    );

    this.deliveryService.getReasonsVisit().subscribe(
      listResult => {
        //this.listReasonVisit = listResult._embedded.reasonsVisits;
        this.listReasonVisit = listResult.listReasonVisit;
      }
    );

    /*
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
      */
      

    //});


  }

  eventHandler(event) {

    this.listFilterUnitEntity = [];
    console.log(event, event.keyCode, event.keyIdentifier);

    //this.listFilterUnitEntity = this.listUnitEntity;

    console.log("this.unitEntityDesc eventHandler",this.unitEntityDesc);

    this.listFilterUnitEntity = this.listUnitEntity.filter(
      (object) => {
        const value = object["description"].toLowerCase();

        return value.includes(this.unitEntityDesc);
      }
    );

    this.cunit_entity=undefined;

    if(this.popoverComp!==undefined){
      this.popoverComp.remove();
    }
    
    
    if(this.listFilterUnitEntity.length>0){
      this.presentPopover(event);
    }
    
    /*
    if(event.keyCode==13){
      this.presentPopover(event);
    }
    */
    

  } 

  popoverComp: any;

  async presentPopover(ev: any) {
    this.popoverComp = await this.popoverController.create({
      component: FilterListPage,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      showBackdrop: false,
      keyboardClose:false,
      componentProps: {
        'filterList': this.listFilterUnitEntity,
        //'cunit_entityEl' : this.cunit_entityEl
      }
    });
    
    

    this.popoverComp.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data !== null) {
          console.log("retorna popover ",dataReturned.data);
          //unitEntity.cunit_entity
          let unitEntity = dataReturned.data;
          this.cunit_entity=unitEntity?.cunitEntity;
          this.unitEntityDesc= unitEntity?.description;
      }});
    return await this.popoverComp.present();
  }


  continueFirst() {


    console.log("continu first",this.cunit_entity);

    if(this.cunit_entity==undefined){
      this.unitEntityDesc="";
      return false;
    }

    this.showGuestInformation = true;
    this.textHeader = "Visitor Information";
  }

  saveProfile() {



    this.showFaceCapture = true;
    //this.textHeader = 'Take a Picture of your ID';
    this.textHeader = 'Take picture of front of ID';

  }

  async modalCamera() {

    console.log("present modalCamera");

    const modal = await this.modalController.create({
      component: CameraPage,
      componentProps: {
        'option': this.option
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        //let imageBase64 = dataReturned.data;
        //console.log('Return Data modalCamera:'+ dataReturnedLoad);

        //let base64Image = 'data:image/jpeg;base64,' + dataReturned.data;
        if(this.option == 1){
          this.imageBase64_1 = dataReturned.data;
          this.option = 2;
          this.textHeader = 'Take picture of back of ID';
        }else if(this.option == 2){
          this.imageBase64_2 = dataReturned.data;
          this.option = 1;
          this.hasCaptureImage = true;
          this.textFinish = "Finish";
          //this.textHeader = 'Take a Picture of your ID';
          console.log("this.showFaceCapture",this.showFaceCapture);
        }
        

      }
    });

    return await modal.present();
  }

  option: number = 1;

  textFinish: string = "Capture another side";

  saveIdentification() {

    let imageBlob1;
    let imageBlob2;

    this.blobFromDataURI(this.imageBase64_1).subscribe(data => {

      imageBlob1 = data;
      let fileName1 = 'file1.' +this.getInfoFromBase64(this.imageBase64_1).extension;

      this.blobFromDataURI(this.imageBase64_2).subscribe(data => {

        imageBlob2 = data;
        let fileName2 = 'file2.' +this.getInfoFromBase64(this.imageBase64_2).extension;


        this.deliveryService.registerVisit(this.resident_name,
          this.resident_lastname,
          this.resident_email,
          this.id_reason_visit,
          this.cunit_entity,
          this.visitor_mobile_phone_number,
          this.visitor_name,
          this.visitor_lastname,
          this.visitor_email,
          imageBlob1,fileName1,
          imageBlob2,fileName2).subscribe(data => {
            
            this.showFinish = true;
            this.showFaceCapture = true;
            this.textHeader = "Finish";

            });
  
      },
      (err) => {
        //this.error = err 
        console.log(err);
        
      });


    },
    (err) => {
      //this.error = err 
      console.log(err);
      
    });



  }

  blobFromDataURI(base64): Observable<Blob> {

    return Observable.create((observer: Observer<Blob>) => {

      const info = this.getInfoFromBase64(base64);
      const sliceSize = 512;
      const byteCharacters = window.atob(info.rawBase64);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        byteArrays.push(new Uint8Array(byteNumbers));
      }

      var fileblob = new Blob(byteArrays, { type: info.mime });

      observer.next(fileblob);
      observer.complete();

    });
  }

  private getInfoFromBase64(base64: string) {
    const meta = base64.split(',')[0];
    const rawBase64 = base64.split(',')[1].replace(/\s/g, '');
    const mime = /:([^;]+);/.exec(meta)[1];
    const extension = /\/([^;]+);/.exec(meta)[1];

    return {
      mime,
      extension,
      meta,
      rawBase64
    };
  }


}
