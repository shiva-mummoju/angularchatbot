import { Component, OnInit, trigger, state, style, transition, animate, ViewEncapsulation, Renderer, AfterViewInit } from '@angular/core';
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

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ChatDialogComponent implements OnInit,AfterViewChecked,OnChanges,AfterViewInit {
  // @ViewChild('resultWrapper') private mymsgbox: ElementRef;
  

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
  constructor(@Inject(DOCUMENT) private document: Document,private modalService: NgbModal,private speechRecognitionService: SpeechRecognitionService,private elementRef: ElementRef,renderer: Renderer) { 
    this.showSearchButton = false;
        this.speechData = "";
        this.msgcount =0;

// dragulaService.dro.subscribe
        
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

ngAfterViewInit(){
  // this.elementRef.nativeElement.querySelectorAll('.poster').forEach(element => {
  //   element.addEventListener('click',this.event_sendmsg.bind(this));
  // });
}

ngOnChanges(){
  this.scrollToBottom();
  
}

sendshortmsg(msg){
  // console.log('sendshortmsg has been called');
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
        // this.mymsgbox.nativeElement.scrollTop = this.mymsgbox.nativeElement.scrollHeight;
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
        hook.innerHTML = hook.innerHTML + '<img src="../../../assets/poster.jpeg" >';
        this.newpushdown(result => {}); 
        // console.log('paper presentation key word found');
      }

      // poster presentation
      var poster_pattern = '[poster_presentation]';
      if(msg.content.includes(poster_pattern)){
        hook.innerHTML = hook.innerHTML + '<img src="../../../assets/poster.jpeg" >';
        this.newpushdown(result => {}); 
        // console.log('paper presentation key word found');
      }

      // opc
      var opc_pattern = '[online_programming_contest]';
      if(msg.content.includes(opc_pattern)){
        hook.innerHTML = hook.innerHTML + '<img src="../../../assets/poster.jpeg" >';
        this.newpushdown(result => {}); 
        // console.log('paper presentation key word found');
      }

      // hackathon
      var hackathon_pattern = '[hackathon]';
      if(msg.content.includes(hackathon_pattern)){
        hook.innerHTML = hook.innerHTML + '<img src="../../../assets/poster.jpeg" >';
        this.newpushdown(result => {}); 
        // console.log('paper presentation key word found');
      }

      // earn your time
      var earnyourtime_pattern = '[earn_your_time]';
      if(msg.content.includes(earnyourtime_pattern)){
        hook.innerHTML = hook.innerHTML + '<img src="../../../assets/earnyourtime1.png" >';
        this.newpushdown(result => {}); 
        // console.log('paper presentation key word found');
      }

      // time is up
      var timeisup_pattern = '[time_is_up]';
      if(msg.content.includes(timeisup_pattern)){
        hook.innerHTML = hook.innerHTML + '<img src="../../../assets/timesup.png" >';
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
        // console.log('event pattern found');

        hook.innerHTML = hook.innerHTML + '<div class="event-pallete"><div class=" container event-pallete-item paper"  ><img src="../../../assets/poster.jpeg" alt=""><div class="text">Paper Presentation</div></div><div class=" container event-pallete-item poster"  ><img src="../../../assets/poster.jpeg" alt=""><div class="text">Poster Presentation</div></div><div class=" container event-pallete-item opc"  ><img src="../../../assets/poster.jpeg" alt=""><div class="text">OPC</div></div><div class=" container event-pallete-item hackathon"  ><img src="../../../assets/poster.jpeg" alt=""><div class="text">Hackathon</div></div><div class=" container event-pallete-item workshop"  ><img src="../../../assets/poster.jpeg" alt=""><div class="text">Workshop</div></div><div class=" container event-pallete-item mock"  ><img src="../../../assets/poster.jpeg" alt=""><div class="text">Mock Interview</div></div><div class=" container event-pallete-item treasure"  ><img src="../../../assets/poster.jpeg" alt=""><div class="text">Treasure Hunt</div></div><div class=" container event-pallete-item tagteam"  ><img src="../../../assets/poster.jpeg" alt=""><div class="text">TagTeam Coding</div></div><div class=" container event-pallete-item efficient"  ><img src="../../../assets/poster.jpeg" alt=""><div class="text">Efficient Coding</div></div><div class="container event-pallete-item drawthecode"><img src="../../../assets/drawthecode.png" alt=""><div class="text">Draw The Code</div></div><div class="container event-pallete-item codenladder"><img src="../../../assets/CodeNLadders.png" alt=""><div class="text">Code N Ladders</div></div><div class="container event-pallete-item tictactoe"><img src="../../../assets/tictactoe.jpeg" alt=""><div class="text">Tic Tac Toe</div></div><div class="container event-pallete-item snapit"><img src="../../../assets/tictactoe.jpeg" alt=""><div class="text">Code N Ladders</div></div><div class="container event-pallete-item wordmagic"><img src="../../../assets/magicwords.png" alt=""><div class="text">Word Magic</div></div><div class="container event-pallete-item crypt"><img src="../../../assets/crypt.png" alt=""><div class="text">Crypt Your Mind</div></div><div class="container event-pallete-item brick"><img src="../../../assets/brickthecode.png" alt=""><div class="text">Brick The Code</div></div><div class="container event-pallete-item codingquiz"><img src="../../../assets/brickthecode.png" alt=""><div class="text">Coding Quiz</div></div><div class="container event-pallete-item earnyourtime"><img src="../../../assets/earnyourtime1.png" alt=""><div class="text">Earn Your Time</div></div><div class="container event-pallete-item codeauction"><img src="../../../assets/earnyourtime1.png" alt=""><div class="text">Code Auction</div></div><div class="container event-pallete-item timeisup"><img src="../../../assets/timesup.png" alt=""><div class="text">Time Is Up</div></div><div class="container event-pallete-item crackit"><img src="../../../assets/crackit.png" alt=""><div class="text">Crack It</div></div></div>';
        // <div class="container event-pallete-item"><img src="../../../assets/eventdemo.PNG" alt=""><div class="text">Paper Presentation</div></div>
        // <div class="container event-pallete-item"><img src="../../../assets/eventdemo.PNG" alt=""><div class="text">Paper Presentation</div></div>
        // </div>';

      //  this.elementRef.nativeElement.querySelector('.poster').addEventListener('click',this.event_sendmsg.bind(this));
      
      this.addall();

        this.insound.play();
          return;
        }
      

        if(msg.content.includes('https://www.google.com/maps/dir/?api=1&destination=17.380337,78.382667&origin=')){
          hook.innerHTML = hook.innerHTML + '<div class="server-response">' + '<a href="' + 'https://www.google.com/maps/dir/?api=1&destination=17.380337,78.382667&origin=">' + 'Click here for navigation' + '</a>' + '</div>';
          this.addall();
          this.insound.play();
          return;
        }

     hook.innerHTML = hook.innerHTML+ '<div class="server-response">' + msg.content + '</div>';
     this.newpushdown(result => {}); 
     this.newpushdown(result => {}); 
     this.newpushdown(result => {}); 
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
    this.addall();

  }

addall(){
  this.elementRef.nativeElement.querySelectorAll('.poster').forEach(element => {
    element.addEventListener('click',this.poster_sendmsg.bind(this));
  });
  this.elementRef.nativeElement.querySelectorAll('.paper').forEach(element => {
    element.addEventListener('click',this.paper_sendmsg.bind(this));
  });
  this.elementRef.nativeElement.querySelectorAll('.opc').forEach(element => {
    element.addEventListener('click',this.opc_sendmsg.bind(this));
  });
  this.elementRef.nativeElement.querySelectorAll('.hackathon').forEach(element => {
    element.addEventListener('click',this.hackathon_sendmsg.bind(this));
  });
  this.elementRef.nativeElement.querySelectorAll('.workshop').forEach(element => {
    element.addEventListener('click',this.workshop_sendmsg.bind(this));
  });

  this.elementRef.nativeElement.querySelectorAll('.mock').forEach(element => {
    element.addEventListener('click',this.mockinterview_sendmsg.bind(this));
  });

  this.elementRef.nativeElement.querySelectorAll('.treasure').forEach(element => {
    element.addEventListener('click',this.treasurehunt_sendmsg.bind(this));
  });

  this.elementRef.nativeElement.querySelectorAll('.tagteam').forEach(element => {
    element.addEventListener('click',this.tagteamcoding_sendmsg.bind(this));
  });
  
  this.elementRef.nativeElement.querySelectorAll('.efficient').forEach(element => {
    element.addEventListener('click',this.efficientcoding_sendmsg.bind(this));
  });

  this.elementRef.nativeElement.querySelectorAll('.tictactoe').forEach(element => {
    element.addEventListener('click',this.tictactoe_sendmsg.bind(this));
  });

  this.elementRef.nativeElement.querySelectorAll('.snapit').forEach(element => {
    element.addEventListener('click',this.snapit_sendmsg.bind(this));
  });

  this.elementRef.nativeElement.querySelectorAll('.codingquiz').forEach(element => {
    element.addEventListener('click',this.codingquiz_sendmsg.bind(this));
  });
  this.elementRef.nativeElement.querySelectorAll('.codeauction').forEach(element => {
    element.addEventListener('click',this.codeauction_sendmsg.bind(this));
  });
  this.elementRef.nativeElement.querySelectorAll('.crackit').forEach(element => {
    element.addEventListener('click',this.crackit_sendmsg.bind(this));
  });
  this.elementRef.nativeElement.querySelectorAll('.brick').forEach(element => {
    element.addEventListener('click',this.brick_sendmsg.bind(this));
  });
  this.elementRef.nativeElement.querySelectorAll('.codenladder').forEach(element => {
    element.addEventListener('click',this.codenladder_sendmsg.bind(this));
  });
  this.elementRef.nativeElement.querySelectorAll('.crypt').forEach(element => {
    element.addEventListener('click',this.crypt_sendmsg.bind(this));
  });
  this.elementRef.nativeElement.querySelectorAll('.drawthecode').forEach(element => {
    element.addEventListener('click',this.drawthecode_sendmsg.bind(this));
  });
  this.elementRef.nativeElement.querySelectorAll('.earnyourtime').forEach(element => {
    element.addEventListener('click',this.earnyourtime_sendmsg.bind(this));
  });
  this.elementRef.nativeElement.querySelectorAll('.wordmagic').forEach(element => {
    element.addEventListener('click',this.wordmagic_sendmsg.bind(this));
  });
  this.elementRef.nativeElement.querySelectorAll('.timeisup').forEach(element => {
    element.addEventListener('click',this.timeisup_sendmsg.bind(this));
  });
}

 paper_sendmsg(){
   this.converse('Tell me about Paper Presentation');
   this.diffpushdown();
 }
 poster_sendmsg(){
   this.converse('Tell me about Poster Presentation')
 }
 opc_sendmsg(){
  this.converse('Tell me about Online Programming Contest')
}
hackathon_sendmsg(){
  this.converse('Tell me about Hackathon')
}
workshop_sendmsg(){
  this.converse('Tell me about workshop')
}
mockinterview_sendmsg(){
  this.converse('Tell me about Mock Interviews')
}
treasurehunt_sendmsg(){
  this.converse('Tell me about Treasure Hunt')
}
tagteamcoding_sendmsg(){
  this.converse('Tell me about Tag Team Coding')
}
efficientcoding_sendmsg(){
  this.converse('Tell me about Efficient Coding')
}
tictactoe_sendmsg(){
  this.converse('Tell me about Tic Tac Toe Event')
}
snapit_sendmsg(){
  this.converse('Tell me about Snap It Event')
}
codingquiz_sendmsg(){
  this.converse('Tell me about Coding Quiz Event')
}
codeauction_sendmsg(){
  this.converse('Tell me about the Code Auction Event')
}
 crackit_sendmsg(){
   this.converse('Tell me about Crack It');
 }
 brick_sendmsg(){
   this.converse('Tell me about Brick The Code');
 }
 codenladder_sendmsg(){
   this.converse('Tell me about Code N Ladders');
 }
 crypt_sendmsg(){
   this.converse('Tell me about Crypt Your Mind');
 }
 drawthecode_sendmsg(){
   this.converse('Tell me about Draw The Code');
 }
 earnyourtime_sendmsg(){
   this.converse('Tell me about Earn Your Time');
 }
 wordmagic_sendmsg(){
   this.converse('Tell me about Word Magic');
 }
 timeisup_sendmsg(){
   this.converse('Tell me about Time Is Up');
 }

  }
