import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';

import { ChatModule } from './chat/chat.module';
import { HeaderComponent } from './header/header.component';
import { TypingpadComponent } from './typingpad/typingpad.component';
import { FormsModule } from '@angular/forms';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TypingpadComponent
  ],
  imports: [
    BrowserModule,
    ChatModule,
    FormsModule,
    // BrowserAnimationModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
