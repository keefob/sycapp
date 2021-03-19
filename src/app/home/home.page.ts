import { Component, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, PopoverController } from '@ionic/angular';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { DeliveryService } from '../api/delivery.service';
import { FilterListPage } from '../register/filter-list.page';

import { TranslateService } from '@ngx-translate/core';

declare const jQuery: any;


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  titleAlert: string;
  titleSelect: string;
  titleSelectAparment: string;

  constructor(private activatedRoute: ActivatedRoute,
    private deliveryService: DeliveryService,
    public popoverController: PopoverController,
    private router: Router,
    private ngZone: NgZone,
    public alertController: AlertController,
    private translate: TranslateService) {

      translate.get('GLOBAL.ALERT_TITLE').subscribe((res: string) => {
        console.log("GLOBAL.ALERT_TITLE: "+res);
        this.titleAlert = res;
      });

      translate.get('GLOBAL.SELECT').subscribe((res: string) => {
        console.log("GLOBAL.SELECT: "+res);
        this.titleSelect = res;
      });

      translate.get('HOME.SELECT_APARMENT_PLACEHOLDER').subscribe((res: string) => {
        console.log("HOME.SELECT_APARMENT_PLACEHOLDER: "+res);
        this.titleSelectAparment = res;
      });

      

  }

  /*
  ngOnDestroy(): void {
    this.cunit_entity=undefined;
    jQuery('#kt_select2_Department').select2('destroy');
  }
  

  ionViewDidLeave	(){
    this.cunit_entity=undefined;
    jQuery('#kt_select2_Department').select2('destroy');
    console.log("se limipio");
    //this.setDepartment(this.listUnitEntity);
  }
  */

  ngOnInit() {

    let centity = "6";
      localStorage.setItem("centity", centity);
      console.log("se setea centity = "+centity);
      
    const routeSubscription = this.activatedRoute.params.subscribe(params => {
      //const centity = params['centity'];
      
    });

    this.activatedRoute.queryParams.subscribe(params => {
        if(params['centity']){
          localStorage.setItem("centity", params['centity']);
        }        
        console.log("recibió parámetro",localStorage.getItem("centity"));
    });

    this.listUnitEntity = [];
    this.deliveryService.getUnitEntity(parseInt(localStorage.getItem('centity'))).subscribe(
      listResult => {
        this.listUnitEntity = listResult.listUnitEntity;
        console.log("listUnitEntity, ",this.listUnitEntity);
        this.setDepartment(this.listUnitEntity);
      }
    );

    window['detectChangeRef'] = { component: this, zone: this.ngZone, detectChangeControl: (field, value) => this.detectChangeControl(field, value), };

  }

  ngAfterViewInit(){

    
    /*

    console.log("cunit_entityElInput: "+document.getElementsByName("cunit_entityTxt")[0]);



    fromEvent(document.getElementsByName("cunit_entityTxt")[0], 'keyup').pipe(

      // get value
      map((event: any) => {
        return {text: event.target.value, event: event};
      })
      // if character length greater then 2
      //, filter(res => res.length > 2)

      // Time in milliseconds between key events
      , debounceTime(800)

      // If previous query is diffent from current   
      , distinctUntilChanged()

      // subscription for response
    ).subscribe((objectResult: any) => {

      let text = objectResult.text;
      let evt = objectResult.event;

    

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
    
    if(this.listFilterUnitEntity.length==1){
      let unitEntity = this.listFilterUnitEntity[0];
      this.cunit_entity=unitEntity?.cunitEntity;
      this.unitEntityDesc= unitEntity?.description;
      return;
    }
    
    if(this.listFilterUnitEntity.length>0){
      this.presentPopover(evt);
    }

    });

*/



    
    
  }


  detectChangeControl(controlName: string, value: string) {
    
    console.log("se realizó refresh: " + controlName + " - " + value);

    this.cunit_entity=value;

  }


  setDepartment(userList) {

    console.log("kt_select2_Department re: ", jQuery('#kt_select2_Department'));

    let arrayResult = [];

    arrayResult.push({ id: '', text: this.titleSelect }); 

    for (let _item of userList){
      arrayResult.push({ id: _item.cunitEntity, text: _item.description });
    }
    

    console.log("arrayResult, ",arrayResult);
    

    jQuery('#kt_select2_Department').select2({
      language: "es",
      placeholder: this.titleSelectAparment ,
      data: arrayResult
    });


    //jQuery('#select2-search__field').attr( "type", "number" );


    jQuery('#kt_select2_Department').on('select2:select', function (e) {
      var data = e.params.data;
      console.log("kt_select2_Department select: ", data);


      //let unitEntity = this.listFilterUnitEntity[0];
      //this.cunit_entity=data.id;
      //this.unitEntityDesc= unitEntity?.description;

      //@ts-ignore
      window.detectChangeRef.zone.run(() => { window.detectChangeRef.detectChangeControl('cunit_entity', data.id); });

    });

    jQuery('#kt_select2_Department').on('select2:unselect', function (e) {
      var data = e.params.data;
      console.log("kt_select2_Department select2:unselect: ", data);

      //this.cunit_entity=undefined;

      //@ts-ignore
      window.detectChangeRef.zone.run(() => { window.detectChangeRef.detectChangeControl('cunit_entity', ''); });

    });

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

  listUnitEntity: any[] = [];
  listFilterUnitEntity: any[] = [];
  cunit_entity;
  unitEntityDesc: any;



  async presentAlert(mensaje: string) {
    const alert = await this.alertController.create({
      header:  this.titleAlert,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }


  saveResident() {
    this.saveResidentInformation();
  }

  saveResidentInformation() {


    console.log("continu first",this.cunit_entity);

    if(this.cunit_entity==undefined){
      this.presentAlert("Please select an apartment");
      this.unitEntityDesc="";
      return false;
    }


    this.deliveryService.registerVisit(
      "",
      "",
      "",
      "",
      1,
      this.cunit_entity,
      "",
      "",
      "",
      "",//visitor mail
      "","","","","", "0",null,null,null,null,null).subscribe(data => {
        
          console.log("data.id_visit_log",data.id_visit_log);

          let id = data.id_visit_log;

          this.router.navigateByUrl('/register?id='+id+"&cunit_entity="+this.cunit_entity);

          

        });

  }

  ionViewWillLeave (){
    console.log("ionViewWillLeave.... home:");
    this.cunit_entity="";
          this.unitEntityDesc= "";
          //jQuery('#kt_select2_Department').off('select2:select');
          //jQuery('#kt_select2_Department').select2('destroy');
          /*
          jQuery('#kt_select2_Department').off('select2:select');

          jQuery('#kt_select2_Department').trigger({
            type: 'select2:clearing',
            params: {
              data: {
                "id": this.cunit_entity,
                "text": ''
              }
            }
          });
          */

          //this.setDepartment(this.listUnitEntity);

          var option = new Option(undefined, '', true, true);
          jQuery('#kt_select2_Department').append(option).trigger('change');

          // manually trigger the `select2:select` event
          jQuery('#kt_select2_Department').trigger({
            type: 'select2:select',
            params: {
              data: {
                "id": undefined,
                "text": ''
              }
            }
          });

          console.log("ionViewWillLeave.... se aplico");
  }

}

