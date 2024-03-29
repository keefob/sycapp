import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';

import { TranslateModule } from '@ngx-translate/core';

import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { NgxPrintModule } from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    TranslateModule.forChild(),
    NgxQRCodeModule,
    NgxPrintModule
  ],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}
