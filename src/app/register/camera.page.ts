import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { WebcamInitError, WebcamImage, WebcamUtil, WebcamComponent } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';

const FONT = '16px open-sans';
const COLOR = '#0074df';
const SNAPSHOT_INTERVAL = 500;

@Component({
  selector: 'camera-page',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss']
})
export class CameraPage implements OnInit, AfterViewInit {

  @Input() option: string;

     // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = false;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public errors: WebcamInitError[] = [];

  public facingMode: string = 'environment';

  // latest snapshot
  public webcamImage: WebcamImage = null;

  @ViewChild('canvas', {read: ElementRef, static: false}) canvas: ElementRef<any>;

  @ViewChild('cameraWeb') cameraWeb: WebcamComponent;

  

  

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  constructor(public modalController: ModalController,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef) {}

  async closeModal() {
    //const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(this.webcamImage.imageAsDataUrl);
  }

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });

      //@ts-ignore
      //document.querySelector(".camera-switch").style.display = "none";

      /*
      if(this.option){
        this.facingMode=this.option;
      }
      */
        

  }

  private renderPredictions(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = FONT;
    ctx.textBaseline = 'top';


    const x = 80;
      const y = 100;
      //const width = 322;
      //const height = 208;

      const width = 360;
      const height = 550;

      ctx.strokeStyle = COLOR;
      ctx.lineWidth = 4;
      ctx.setLineDash([10,5]);
      ctx.strokeRect(x, y, width, height);

      console.log("ok render");
  }

  ngAfterViewInit() {
    
    

  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    console.info('showNextWebcam ', directionOrDeviceId);
    this.nextWebcam.next(directionOrDeviceId);
  }

  public get videoOptions(): MediaTrackConstraints {
    console.info('videoOptions this.facingMode ', this.facingMode);
    const result: MediaTrackConstraints = {};
    if (this.facingMode && this.facingMode !== '') {
      result.facingMode = this.facingMode ;
      console.info('result.facingMode ', result.facingMode);
    }

    return result;
  }

  async showFaceModeWebcam() {
    console.info('this.facingMode ', this.facingMode);
    console.info('this.cameraWeb ', this.cameraWeb);
    if(this.facingMode==='environment'){
      this.facingMode = 'user';
    }else{
      this.facingMode = 'environment';
    }

    this.cameraWeb.switchToVideoInput(null);

    console.info('this.cameraWeb ', this.cameraWeb);

    

    this.cdr.detectChanges();

    /*

    let result = { facingMode: this.facingMode, type:'facingMode' }

    await this.modalController.dismiss(result);
    */
    
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;

    this.closeModal();

  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.renderPredictions();
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }


  

}