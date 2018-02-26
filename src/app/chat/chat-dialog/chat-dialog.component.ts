import { Component, OnInit, trigger, state, style, transition, animate, ViewEncapsulation } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
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
// declare var $:any;

@Component({
  selector: 'chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ChatDialogComponent implements OnInit,AfterViewChecked,OnChanges {
  @ViewChild('resultWrapper') private mymsgbox: ElementRef;
  

  event_patter:string = '[events]';
  // from service
    // using howler for playing sounds
    insound = new Howl({
      src: ['../../../assets/in.mp3']
    });
   readonly token = environment.dialogflow.Acumen;
   readonly client = new ApiAiClient({ accessToken: this.token });
   closeResult: string;

  //  messages: Message[] = [];
  formValue: string;
  sub: any;
  showSearchButton: boolean;
    speechData: string;
    msgcount: number;
  constructor(@Inject(DOCUMENT) private document: Document,private modalService: NgbModal,private speechRecognitionService: SpeechRecognitionService) { 
    this.showSearchButton = false;
        this.speechData = "";
        this.msgcount =0;
  }

  ngOnInit() {
    const userMessage = new Message('Hey there..', 'bot');
    // this.messages.push(userMessage);
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
  console.log('sendshortmsg has been called');
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


    var hook = document.getElementById('chatdialogue'); 

    if(msg.sentBy == 'bot'){
      
      var paper_pattern = '[paper_presentation]';
      if(msg.content.includes(paper_pattern)){
        hook.innerHTML = hook.innerHTML + '<img src="../../../assets/eventdemo.PNG" >';
        this.newpushdown(result => {}); 
        // console.log('paper presentation key word found');
      }

      // brick the code 
      var brick_pattern = '[brick_the_code]';
      if(msg.content.includes(brick_pattern)){
        hook.innerHTML = hook.innerHTML + '<img src="../../../assets/brickthecode.png" >';
        this.newpushdown(result => {}); 
        // console.log('paper presentation key word found');
      }

      // crack it 
      var crack_pattern = '[crack_it]';
      if(msg.content.includes(crack_pattern)){
        hook.innerHTML = hook.innerHTML + '<img src="../../../assets/crackit.png" >';
        this.newpushdown(result => {}); 
        // console.log('paper presentation key word found');
      }




      // for the list of events
      if(msg.content.includes(this.event_patter)){
        console.log('event pattern found');

        hook.innerHTML = hook.innerHTML + '<div class="event-pallete"><div class=" container event-pallete-item"  ><img src="../../../assets/poster.jpeg" alt=""><div class="text">Poster Presentation</div></div><div class="container event-pallete-item"><img src="../../../assets/crackit.png" alt=""><div class="text">Crack It</div></div><div class="container event-pallete-item"><img src="../../../assets/brickthecode.png" alt=""><div class="text">Brick The Code</div></div><div class="container event-pallete-item"><img src="../../../assets/CodeNLadders.png" alt=""><div class="text">Code N Ladders</div></div><div class="container event-pallete-item"><img src="../../../assets/crypt.png" alt=""><div class="text">Crypt Your Mind</div></div><div class="container event-pallete-item"><img src="../../../assets/drawthecode.png" alt=""><div class="text">Draw The Code</div></div><div class="container event-pallete-item"><img src="../../../assets/earnyourtime1.png" alt=""><div class="text">Earn Your Time</div></div><div class="container event-pallete-item"><img src="../../../assets/magicwords.png" alt=""><div class="text">Word Magic</div></div><div class="container event-pallete-item"><img src="../../../assets/timesup.png" alt=""><div class="text">Time Is Up</div></div></div>';
        // <div class="container event-pallete-item"><img src="../../../assets/eventdemo.PNG" alt=""><div class="text">Paper Presentation</div></div>
        // <div class="container event-pallete-item"><img src="../../../assets/eventdemo.PNG" alt=""><div class="text">Paper Presentation</div></div>
        // </div>';
        this.insound.play();
          return;
        }
      

     hook.innerHTML = hook.innerHTML+ '<div class="server-response">' + msg.content + '</div>';
     this.newpushdown(result => {}); 
    }
    if(msg.sentBy == 'user'){
      document.getElementById('chatdialogue').innerHTML = document.getElementById('chatdialogue').innerHTML + '<div class="user-request">' + msg.content + '</div>';
    }
    if( msg.sentBy == 'bot'){
      this.insound.play();
      this.newpushdown(result => {}); 
    } 

    this.formValue = '';
    this.diffpushdown();
  }



 event_sendmsg(){
   this.converse('HI');
   this.diffpushdown();
 }

  }
