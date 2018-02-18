import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/scan';
import { Inject} from "@angular/core";
import { DOCUMENT } from '@angular/platform-browser'; 
import { AfterViewChecked } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { OnChanges } from '@angular/core';
import {  OnDestroy} from '@angular/core';
import { SpeechRecognitionService } from '../speech-recognition.service';

// from service
import { ApiAiClient } from 'api-ai-javascript';
// import { OnInit } from '@angular/core';
import { Output } from '@angular/core';
import { environment } from '../../../environments/environment';
import{Howl,Howler} from 'howler';

// import { connect } from 'tls';

export class Message {
  constructor(public content: string, public sentBy: string) {
  }
}


@Component({
  selector: 'chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css'],
})



export class ChatDialogComponent implements OnInit,AfterViewChecked,OnChanges {
  @ViewChild('resultWrapper') private mymsgbox: ElementRef;

  // from service
    // using howler for playing sounds
    insound = new Howl({
      src: ['../../../assets/in.mp3']
    });
   readonly token = environment.dialogflow.Acumen;
   readonly client = new ApiAiClient({ accessToken: this.token });


   messages: Message[] = [];
  formValue: string;
  sub: any;
  showSearchButton: boolean;
    speechData: string;
    msgcount: number;
  constructor(@Inject(DOCUMENT) private document: Document,private speechRecognitionService: SpeechRecognitionService) { 
    this.showSearchButton = false;
        this.speechData = "";
        this.msgcount =0;
  }

  ngOnInit() {
    const userMessage = new Message('Hey there..', 'bot');
    this.messages.push(userMessage);
  }
  ngOnDestroy() {
    this.speechRecognitionService.DestroySpeechObject();
}

activateSpeechSearchMovie(): void {
  if(this.showSearchButton == false){
      this.showSearchButton = true;
  this.speechRecognitionService.record()
      .subscribe(
      //listener
      (value) => {
          this.speechData = value;
          this.sendshortmsg(value);
          this.speechRecognitionService.DestroySpeechObject();
          this.showSearchButton = true;
              },
      //errror
      (err) => {
          console.log(err);
          if (err.error == "no-speech") {
            this.showSearchButton = false;
              // console.log("--restatring service--");
              // this.activateSpeechSearchMovie();
          }
      },
      //completion
      () => {
          this.showSearchButton = false;
          // console.log("--complete--");
          // this.activateSpeechSearchMovie();
      });
    }else{
      this.showSearchButton = false;
      this.speechRecognitionService.DestroySpeechObject();
    }
}
  ngAfterViewChecked() {        
    this.scrollToBottom();        
} 

ngOnChanges(){
  this.scrollToBottom();
}

sendshortmsg(msg){
this.converse(msg);
this.diffpushdown();
}

  sendMessage() {
    this.converse(this.formValue);
    this.formValue = '';
    this.diffpushdown();
    document.getElementById('resultWrapper').scrollTop = document.getElementById('resultWrapper').scrollHeight;
  
  }

  scrollToBottom():void {
      try{
        this.mymsgbox.nativeElement.scrollTop = this.mymsgbox.nativeElement.scrollHeight;
      }catch(err){}
  }

  pushdown(){

    document.getElementById('resultWrapper').scrollTop = document.getElementById('resultWrapper').scrollHeight;
    // console.log('Pushdown called in chat');
  }

  newpushdown(callback){
   
     setTimeout(() => callback(document.getElementById('resultWrapper').scrollTop = document.getElementById('resultWrapper').scrollHeight), 125); 
    
  }
  diffpushdown(){
    document.getElementById('resultWrapper').scrollTop = document.getElementById('resultWrapper').scrollHeight;
    // console.log('diffPushdown called in chat');
  }




  converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    return this.client.textRequest(msg)
               .then(res => {
                  const speech = res.result.fulfillment.speech;
                  const botMessage = new Message(speech, 'bot');
                  this.update(botMessage);
                  // this.myevent.emit();
               });
  }
  // Adds message to source
  update(msg: Message) {
    this.newpushdown(result => {}); 
    this.msgcount = this.msgcount + 1;
    if(this.msgcount > 20){
      this.messages.shift();
      this.msgcount = this.msgcount - 1;
    }
    this.messages.push(msg);
    if( msg.sentBy == 'bot'){
      this.insound.play();
    } 

    this.formValue = '';
    this.diffpushdown();
  }

 
  }
