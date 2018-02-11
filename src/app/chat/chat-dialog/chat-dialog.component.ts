import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { ChatService, Message } from './../chat.service';
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


// import { connect } from 'tls';


@Component({
  selector: 'chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css'],
})
export class ChatDialogComponent implements OnInit,AfterViewChecked,OnChanges {
  @ViewChild('resultWrapper') private mymsgbox: ElementRef;

  messages: Observable<Message[]>;
  formValue: string;
  sub: any;
  showSearchButton: boolean;
    speechData: string;

  constructor(public chat: ChatService,@Inject(DOCUMENT) private document: Document,private speechRecognitionService: SpeechRecognitionService) { 
    this.showSearchButton = false;
        this.speechData = "";
  }

  ngOnInit() {
    // setInterval(this.pushdown,100);
    
    this.chat.greet();
    // this.chat.checkuser();
    // appends to array after each new message is added to feedSource
    this.messages = this.chat.conversation.asObservable()
        .scan((acc, val) => {
          {
            var temp = acc.concat(val);
            // console.log("inside scan")
            document.getElementById('resultWrapper').scrollTop = document.getElementById('resultWrapper').scrollHeight;
            // document.getElementById('resultWrapper').scrollIntoView(false);
            var mydiv = document.getElementById('resultWrapper');
            mydiv.scrollTop = mydiv.scrollHeight - mydiv.clientHeight;

            return temp;
          }
        }
       );
       this.scrollToBottom();
       this.sub = this.chat.geteventemitter().subscribe((item)=> this.diffpushdown());
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
this.chat.converse(msg);

}

  sendMessage() {
    this.chat.converse(this.formValue);
    this.formValue = '';
    document.getElementById('resultWrapper').scrollTop = document.getElementById('resultWrapper').scrollHeight;
    // document.getElementById('resultWrapper').scrollIntoView(false);
    // console.log('scroll height  = ' + document.getElementById('resultWrapper').scrollHeight);
    // var mydiv = document.getElementById('resultWrapper');
    // mydiv.scrollTop = mydiv.scrollHeight - mydiv.clientHeight;
  
  }

  scrollToBottom():void {
      try{
        this.mymsgbox.nativeElement.scrollTop = this.mymsgbox.nativeElement.scrollHeight;
        // var mydiv = document.getElementById('resultWrapper');
        // mydiv.scrollTop = mydiv.scrollHeight - mydiv.clientHeight;
        // document.getElementById('resultWrapper').scrollIntoView(false);
      }catch(err){}
  }

  pushdown(){
    // document.getElementById('resultWrapper').scrollIntoView();
    // var mydiv = document.getElementById('resultWrapper');
    // mydiv.scrollTop = mydiv.scrollHeight - mydiv.clientHeight;
    // console.log('Pushdown called in chat');
  }
  diffpushdown(){
    document.getElementById('resultWrapper').scrollTop = document.getElementById('resultWrapper').scrollHeight;
    // var mydiv = document.getElementById('resultWrapper');
    // mydiv.scrollTop = mydiv.scrollHeight - mydiv.clientHeight;
    // document.getElementById('resultWrapper').scrollIntoView(false);
    // console.log('diffPushdown called in chat');
  }
 
  }
