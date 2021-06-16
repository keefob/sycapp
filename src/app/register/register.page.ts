import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';

import { LoadingController, AlertController, IonInput } from '@ionic/angular';

import { ModalController } from '@ionic/angular';

import { DomSanitizer } from '@angular/platform-browser';

import { ParameterService } from '../api/parameter.service';
import { CameraPage } from './camera.page';
import { DeliveryService } from '../api/delivery.service';
import { ActivatedRoute, Router,NavigationEnd } from '@angular/router';
import { Observer, Observable, fromEvent } from 'rxjs';

import { of } from "rxjs";
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from "rxjs/operators";

import { PopoverController } from '@ionic/angular';
import { FilterListPage } from './filter-list.page';
import { TranslateService } from '@ngx-translate/core';
//import { stringify } from 'querystring';

import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, AfterViewInit{

  

  textHeader: string = '';

  imageBase64_1: string;

  imageBase64_2: string;

  successImageBase64: string;

  hasCaptureImage: boolean = false;

  showResident: boolean = false;
  showFaceCapture: boolean = false;
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
  observation_reason_visit;


  id;
  address1;
  address2;
  dateOfBirth;
  sex;

  imageBlob1;

  loading: boolean = false;

  plate;

  //@ViewChild('cunit_entityEl', { static: true }) cunit_entityElInput: ElementRef;

  //@ViewChild("cunitEntityElement", { read: ElementRef }) cunit_entityElInput: ElementRef;

  @ViewChild('cunitEntityElement') cunit_entityElInput;  

  paramShowVisitorInformation: boolean = false;

  titleAlert: string;

  titleAparment:string;
  titlePhoto:string;
  titleVisitor:string;
  titleFinish:string;

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  valueQR = '';

  entity : any;

  constructor(
    public alertController: AlertController,
    public loadingController: LoadingController,
    public _DomSanitizationService: DomSanitizer,
    private data: ParameterService,
    public modalController: ModalController,
    private deliveryService: DeliveryService,
    private activatedRoute: ActivatedRoute,
    public popoverController: PopoverController,
    private router: Router,
    private translate: TranslateService) {

      /*
      this.router.events.subscribe((e: any) => {
				// If it is a NavigationEnd event re-initalise the component
				if (e instanceof NavigationEnd) {
				  this.ngOnInit();
				}
        });*/


        translate.get('GLOBAL.ALERT_TITLE').subscribe((res: string) => {
          console.log("GLOBAL.ALERT_TITLE: "+res);
          this.titleAlert = res;
        });

        translate.get('GLOBAL.ALERT_TITLE').subscribe((res: string) => {
          console.log("GLOBAL.ALERT_TITLE: "+res);
          this.titleAlert = res;
        });


        translate.get('REGISTER.FINISH').subscribe((res: string) => {
          console.log("REGISTER.FINISH: "+res);
          this.textFinish = res;
        });

        translate.get('REGISTER.PHOTO').subscribe((res: string) => {
          console.log("REGISTER.PHOTO: "+res);
          this.textTakePhoto = res;
        });



        translate.get('REGISTER.TITLE_APARMENT').subscribe((res: string) => {
          console.log("REGISTER.TITLE_APARMENT: "+res);
          this.titleAparment = res;
        });

        translate.get('REGISTER.TITLE_PHOTO').subscribe((res: string) => {
          console.log("REGISTER.TITLE_PHOTO: "+res);
          this.titlePhoto = res;
        });

        translate.get('REGISTER.TITLE_VISITOR').subscribe((res: string) => {
          console.log("REGISTER.TITLE_VISITOR: "+res);
          this.titleVisitor = res;
        });

        translate.get('REGISTER.TITLE_FINISH').subscribe((res: string) => {
          console.log("REGISTER.TITLE_FINISH: "+res);
          this.titleFinish = res;
        });

        
        
     }


  ngOnInit() {

    console.log("se utiliza el centity: ",localStorage.getItem('centity'));


    this.activatedRoute.queryParams.subscribe(params => {
      const id = params.id;
      this.id_visit_log= params.id;
      this.cunit_entity=params.cunit_entity;

      console.log("id_visit_log: "+this.id_visit_log);
      console.log("cunit_entity: "+this.cunit_entity);


      this.deliveryService.queryEntity(localStorage.getItem('centity')).subscribe(
        listResult => {
          if(listResult.listEntity){
            this.entity = listResult.listEntity[0];
            //console.log("entidad: ",entidad);
          }
          
        }
      );
      


    });

    this.continueResident();

    //this.imageBase64_1 = this.data.imageCameraBase64;
    this.imageBase64_1 = this.data.imageLicenseBase64;
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


  ngAfterViewInit(){


    /*
    console.log("cunit_entityElInput: "+document.getElementsByName("cunit_entityTxt")[0]);



    fromEvent(document.getElementsByName("cunit_entityTxt")[0], 'keyup').pipe(

      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      //, filter(res => res.length > 2)

      // Time in milliseconds between key events
      , debounceTime(800)

      // If previous query is diffent from current   
      , distinctUntilChanged()

      // subscription for response
    ).subscribe((text: string) => {


     this.listFilterUnitEntity = [];


     console.log("this.unitEntityDesc eventHandler: ",text);

    this.listFilterUnitEntity = this.listUnitEntity.filter(
      (object) => {
        //const value = object["description"].toLowerCase();

        return object["description"].toLowerCase().startsWith(text.toLowerCase());
      }
    );

    this.cunit_entity=undefined;

    if(this.popoverComp!==undefined){
      this.popoverComp.remove();
    }
    
    
    if(this.listFilterUnitEntity.length>0){
      this.presentPopover(event);
    }

    });
    */
    
  }
  

  renderObservationReason: boolean = false;

  changeReasonVisit(){
    console.log("Reason selected: "+this.id_reason_visit);

    if(this.id_reason_visit != 1){
      this.renderObservationReason = true;
    }else{
      this.renderObservationReason = false;
    }

  }

  /*
  eventHandler(event) {

    this.listFilterUnitEntity = [];
    console.log(event, event.keyCode, event.keyIdentifier);

    //this.listFilterUnitEntity = this.listUnitEntity;

    //@ts-ignore
    var cunit_entityTxt = document.getElementsByName("cunit_entityTxt")[0].value;

    console.log("this.unitEntityDesc eventHandler",cunit_entityTxt);

    this.listFilterUnitEntity = this.listUnitEntity.filter(
      (object) => {
        //const value = object["description"].toLowerCase();

        return object["description"].toLowerCase().startsWith(cunit_entityTxt.toLowerCase());
      }
    );

    this.cunit_entity=undefined;

    if(this.popoverComp!==undefined){
      this.popoverComp.remove();
    }
    
    
    if(this.listFilterUnitEntity.length>0){
      this.presentPopover(event);
    }
    

  } 

  */
 

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

  facingMode: string;

  async modalCamera() {

    console.log("present modalCamera");

    const modal = await this.modalController.create({
      component: CameraPage,
      componentProps: {
        'option': this.facingMode
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        //let imageBase64 = dataReturned.data;
        console.log('Return Data modalCamera:', dataReturned);

        /*
        if(dataReturned.data){
          if(dataReturned.data.type){
            this.facingMode = dataReturned.data.facingMode;
            //this.modalCamera();
          }
          
        }
        */

        //let base64Image = 'data:image/jpeg;base64,' + dataReturned.data;
        if(this.option == 0){
          this.imageBase64_1 = dataReturned.data;
          //this.option = 2;
          //this.textHeader = 'Take picture of back of ID';
          this.option = 1;
          this.hasCaptureImage = true;
          this.textFinish = "Confirm & Continue"; 
          //textTakePhoto: string = "Take picture of front of ID";
          this.textTakePhoto = "Re-Take picture of front of ID";

          this.translate.get('REGISTER.FINISH').subscribe((res: string) => {
            console.log("REGISTER.FINISH: "+res);
            this.textFinish = res;
          });

          this.translate.get('REGISTER.RE_PHOTO').subscribe((res: string) => {
            console.log("REGISTER.RE_PHOTO: "+res);
            this.textTakePhoto = res;
          });

        }else if(this.option == 2){
          this.imageBase64_2 = dataReturned.data;
          this.option = 1;
          this.hasCaptureImage = true;

          this.textFinish = "Continue"; 
          



          console.log("this.showFaceCapture",this.showFaceCapture);
        }
        

      }
    });

    return await modal.present();
  }

  option: number = 0;

  textFinish: string = "Capture another side";

  textTakePhoto: string = "Take picture of front of ID";

  id_visit_log: number;

  titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  goHome(){

    this.router.navigate(['/home'], { replaceUrl: true });

  }

  continueResident(){
    this.showFaceCapture = false;
    this.showResident=true;
    this.showGuestInformation=false;
    this.textHeader = this.titleAparment;
  }

  continueDeliveryCapture(){
    
    this.showFaceCapture = true;
    this.showResident=false;
    this.showGuestInformation=false;
    this.textHeader = this.titlePhoto;

  }

  continueDelivery(){

    this.showFaceCapture = false;
    this.showResident=false;
    this.showGuestInformation=true;

    this.textHeader = this.titleVisitor;
  }

  continueFinish(){

    this.showFinish = true;
    this.showFaceCapture = true;
    this.showResident=false;
    this.showGuestInformation=false;
    //this.showGuestInformation=false;

    this.textHeader = this.titleFinish;

    //this.entity.automaticallyHomePage="1";

    setTimeout(() => {
      if(this.entity.automaticallyHomePage==='1'){
        this.showFinish = false;
        console.log("entro redirect home...");
        this.goHome();
      }
    }, 2000);

    

  }


  saveResident() {
    this.saveResidentInformation();
  }

  saveResidentInformation() {


    /*

    console.log("continu first",this.cunit_entity);

    if(this.cunit_entity==undefined){
      this.unitEntityDesc="";
      return false;
    }
*/
   

    if(this.id_reason_visit == 1){
      this.observation_reason_visit = "";
    }

    this.deliveryService.registerVisit(
      //"",
      this.id_visit_log,
      this.titleCaseWord(this.resident_name),
      this.titleCaseWord(this.resident_lastname),
      "",//      this.resident_email,
      this.id_reason_visit,
      this.cunit_entity,
      "",//visitor
      "",//visitor
      "",//visitor
      "",//visitor
      null,null,null,null,
      this.observation_reason_visit ?  this.observation_reason_visit : ""
      ,  "0",
      //null,null,null,null,null
      "","","","",""
      ).subscribe(data => {
        
          console.log("data.id_visit_log",data.id_visit_log);

          this.id_visit_log = data.id_visit_log;

          this.valueQR=data.token;

          if(this.entity.disableContactlessPhoto==='0'){
            this.continueDeliveryCapture();
            this.textTakePhoto = this.titlePhoto;
            this.modalCamera();
          }else{

            if(this.entity.disableOcrContactless==='0'){
              this.continueDelivery();
              
            }else{
              this.continueFinish();
            }

            
          }
          
          //this.textTakePhoto = "Take picture of front of ID";

          
          
          //this.continueDelivery();

        });

  }

  

  saveIdentification() {

   
    this.saveDeliveryIdentification();

    //this.showGuestInformation = true;

    
    

  }

  deliveryInformation() {

    this.deliveryService.registerVisit(
      this.id_visit_log,
      this.titleCaseWord(this.resident_name),
      this.titleCaseWord(this.resident_lastname),
      this.resident_email,
      this.id_reason_visit,
      this.cunit_entity,
      this.visitor_mobile_phone_number,
      this.titleCaseWord(this.visitor_name),
      this.titleCaseWord(this.visitor_lastname),
      this.visitor_email,
      this.imageBlob1,this.fileName1,
        "","",
      this.observation_reason_visit,  
      "2",
      this.id,
      "",//this.address1,
      "",
      "",//this.dateOfBirth,
      this.sex,
      this.plate
      ).subscribe(data => {
        
          console.log("data.id_visit_log 2",data.id_visit_log);

          //this.id_visit_log = data.id_visit_log;

          //this.continueDeliveryCapture();
          this.continueFinish();
        });

  }


  saveDelivery() {
    this.deliveryInformation();
    /*
    this.showFinish = true;
    this.showFaceCapture = true;
    this.textHeader = "Finish";
    */
  } 

  

  saveDeliveryIdentification() {

    this.loading = true;

    let imageBlob1;
    let imageBlob2;

    this.blobFromDataURI(this.imageBase64_1).subscribe(data => {

      imageBlob1 = data;
      let fileName1 = 'file1.' +this.getInfoFromBase64(this.imageBase64_1).extension;
      /*

      this.blobFromDataURI(this.imageBase64_2).subscribe(data => {

        imageBlob2 = data;
        let fileName2 = 'file2.' +this.getInfoFromBase64(this.imageBase64_2).extension;


        
  
      },
      (err) => {
        //this.error = err 
        console.log(err);
        
      });
      */
     this.imageBlob1=imageBlob1;
     this.fileName1= fileName1;

      this.deliveryService.registerVisit(
        this.id_visit_log,
        this.titleCaseWord(this.resident_name),
        this.titleCaseWord(this.resident_lastname),
        this.resident_email ? this.resident_email : "",
        this.id_reason_visit,
        this.cunit_entity,
        "",//this.visitor_mobile_phone_number,
        "",//this.titleCaseWord(this.visitor_name),
        "",//this.titleCaseWord(this.visitor_lastname),
        "",//this.visitor_email,
        imageBlob1,fileName1,
        "","",
        this.observation_reason_visit,  
        "1",
        "","","","",""
        ).subscribe(data => {

          console.log("registerVisit 2 data: ",data);

          
          if(data && this.entity.disableOcrContactless==='0'){
            if(data.infoText){
              this.visitor_name = data.infoText?.name;
              this.visitor_lastname = data.infoText?.lastname;

              this.id = data.infoText?.id;

              let addressF = "";

              if(data.infoText?.address1){
                addressF = addressF + data.infoText?.address1;
                if(data.infoText?.address2){
                  addressF = addressF + ' '+data.infoText?.address2;
                }
              }

              this.address1 = addressF;
              this.dateOfBirth = data.infoText?.dateOfBirth ;
              //this.dateOfBirth = data.infoText?.dateOfBirth ? this.getDateStringFromDate(data.infoText?.dateOfBirth) : '';
              this.sex = data.infoText?.sex;
              
            }
          }
          
            
            //if(this.paramShowVisitorInformation){
            if(this.entity.disableOcrContactless==='0'){              
              this.continueDelivery();
            }else{
              this.saveDelivery();
            }
            

            //this.continueFinish();
          
            this.loading = false;

          },(err) => {
            //this.error = err 
            console.log(err);
      
            this.loading = false;
            
          });


    },
    (err) => {
      //this.error = err 
      console.log(err);

      this.loading = false;
      
    });



  }

  

  getDateStringFromDate(dateInStr: any): string {

    if (dateInStr && dateInStr.length > 0) {
      const dateParts = dateInStr.trim().split('/');
      if(dateParts.length> 1){
        const month = this.toInteger(dateParts[0]);
        const day = this.toInteger(dateParts[1]);
        const year = this.toInteger(dateParts[2]);
        return `${year}-${month}-${day}`;
      }

      const dateParts2 = dateInStr.trim().split('-');
      if(dateParts2.length> 1){
        const month = this.toInteger(dateParts2[0]);
        const day = this.toInteger(dateParts2[1]);
        const year = this.toInteger(dateParts2[2]);
        return `${year}-${month}-${day}`;
      }
      
    }

  }

  toInteger(value: any): number {
    return parseInt(`${value}`, 10);
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


  ionViewWillLeave (){
    console.log("nos fuimos de register page, lo voy a limpiar");
  }


}
