import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { RegisterComponent } from '../register/register.component';
import { RegisterTwoComponent } from '../register-two/register-two.component';
import { PasswordResetComponent } from '../password-reset/password-reset.component';
import { PostLoginComponent } from '../modals/post-login/post-login.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule
  ],
  declarations: [LoginPage, RegisterComponent, RegisterTwoComponent, PasswordResetComponent, PostLoginComponent],
  entryComponents: [PasswordResetComponent]
})
export class LoginPageModule { }
