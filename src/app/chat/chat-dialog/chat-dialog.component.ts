import { Component, OnInit, trigger, state, style, transition, animate, ViewEncapsulation, Renderer, AfterViewInit } from '@angular/core';
// import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
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
import { Http } from '@angular/http';

// import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
// import { AngularFire }from 'angularfire2';
// import { AngularFireModule } from 'angularfire2';
// import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireDatabase, } from 'angularfire2/database';
// import * as firebase from 'firebase/app';


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
  n: any;
  sub: any;
  showSearchButton: boolean;
    speechData: string;
    msgcount: number;
  constructor( private http: Http, private af : AngularFireDatabase, @Inject(DOCUMENT) private document: Document,private speechRecognitionService: SpeechRecognitionService,private elementRef: ElementRef,renderer: Renderer) { 
    this.showSearchButton = false;
        this.speechData = "";
        this.msgcount =0;
      
// dragulaService.dro.subscribe
        
  }

  ngOnInit() {
    this.insound.play();
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
  if(msg == ''){
    return;
  }
  // console.log('sendshortmsg has been called');
this.converse(msg);
this.diffpushdown();
}

  sendMessage() {
    if(this.formValue == ''){
      return;
    }
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
                  this.increment_count();
                  // this.myevent.emit();
               });
  }
  // Adds message to source
  update(msg: Message) {
    // this.increment_count();
    this.newpushdown(result => {}); 
    var hook = document.getElementById('chatdialogue'); 


    // code for limiting the count of msgs
    this.msgcount = this.msgcount + 1;
    if(this.msgcount == 70){
      hook.innerHTML = '';
      this.msgcount = 0;
    }

    

    if(msg.sentBy == 'bot'){
      // paper
      var paper_pattern = '[paper_presentation]';
      if(msg.content.includes(paper_pattern)){
        hook.innerHTML = hook.innerHTML + '<img class=" separateimg"  src="../../../assets/paper_new.png" >';
        msg.content = msg.content.replace(paper_pattern,'');
        
        this.newpushdown(result => {}); 
        // console.log('paper presentation key word found');
      }

      // poster presentation
      var poster_pattern = '[poster_presentation]';
      if(msg.content.includes(poster_pattern)){
        hook.innerHTML = hook.innerHTML + '<img class="separateimg"  src="../../../assets/poster_new.jpg" >';
        msg.content = msg.content.replace(poster_pattern,'');
        this.newpushdown(result => {}); 
        
        // console.log('paper presentation key word found');
      }

      // opc
      var opc_pattern = '[online_programming_contest]';
      if(msg.content.includes(opc_pattern)){
        hook.innerHTML = hook.innerHTML + '<img class="separateimg"  src="../../../assets/opc_new.jpeg" >';
        msg.content = msg.content.replace(opc_pattern,'');
        this.newpushdown(result => {}); 
        // console.log('paper presentation key word found');
      }

      // hackathon
      var hackathon_pattern = '[hackathon]';
      if(msg.content.includes(hackathon_pattern)){
        hook.innerHTML = hook.innerHTML + '<img class="separateimg"  src="../../../assets/poster.jpeg" >';
        msg.content = msg.content.replace(hackathon_pattern,'');
        this.newpushdown(result => {}); 
        // console.log('paper presentation key word found');
      }

      // earn your time
      var earnyourtime_pattern = '[earn_your_time]';
      if(msg.content.includes(earnyourtime_pattern)){
        hook.innerHTML = hook.innerHTML + '<img class="separateimg"  src="../../../assets/earnyourtime1.jpeg" >';
        msg.content = msg.content.replace(earnyourtime_pattern,'');
        this.newpushdown(result => {}); 
        // console.log('paper presentation key word found');
      }

      // time is up
      var timeisup_pattern = '[time_is_up]';
      if(msg.content.includes(timeisup_pattern)){
        hook.innerHTML = hook.innerHTML + '<img class="separateimg"  src="../../../assets/timesup.jpeg" >';
        msg.content = msg.content.replace(timeisup_pattern,'');
        this.newpushdown(result => {}); 
        // console.log('paper presentation key word found');
      }

      // brick the code 
      var brick_pattern = '[brick_the_code]';
      if(msg.content.includes(brick_pattern)){
        hook.innerHTML = hook.innerHTML + '<img  class="separateimg" src="../../../assets/brickthecode.jpeg" >';
        msg.content = msg.content.replace(brick_pattern,'');
        this.newpushdown(result => {}); 
        // console.log('paper presentation key word found');
      }

      // crack it 
      var crack_pattern = '[crack_it]';
      if(msg.content.includes(crack_pattern)){
        hook.innerHTML = hook.innerHTML + '<img  class="separateimg" src="../../../assets/crackit.jpeg" >';
        msg.content = msg.content.replace(crack_pattern,'');
        this.newpushdown(result => {}); 
        // console.log('paper presentation key word found');
      }
      // drawthecode
      var drawthecode_pattern = '[draw_the_code]';
      if(msg.content.includes(drawthecode_pattern)){
        hook.innerHTML = hook.innerHTML + '<img  class="separateimg" src="../../../assets/drawthecode.jpeg" >';
        msg.content = msg.content.replace(drawthecode_pattern,'');
        this.newpushdown(result => {}); 
        // console.log('paper presentation key word found');
      }
      // codenladders
      var codenladder_pattern = '[code_n_ladder]';
      if(msg.content.includes(codenladder_pattern)){
        hook.innerHTML = hook.innerHTML + '<img  class="separateimg" src="../../../assets/codenadders.jpeg" >';
        msg.content = msg.content.replace(codenladder_pattern,'');
        this.newpushdown(result => {}); 
        // console.log('paper presentation key word found');
      }
      // tic tac toe
      var tictactoe_pattern = '[tic_tac_toe]';
      if(msg.content.includes(tictactoe_pattern)){
        hook.innerHTML = hook.innerHTML + '<img  class="separateimg" src="../../../assets/tictactoe.jpeg" >';
        msg.content = msg.content.replace(tictactoe_pattern,'');
        this.newpushdown(result => {}); 
        // console.log('paper presentation key word found');
      }
      // wordmagic
      var wordmagic_pattern = '[word_magic]';
      if(msg.content.includes(wordmagic_pattern)){
        hook.innerHTML = hook.innerHTML + '<img  class="separateimg" src="../../../assets/magicwords.jpeg" >';
        msg.content = msg.content.replace(wordmagic_pattern,'');
        this.newpushdown(result => {}); 
        // console.log('paper presentation key word found');
      }
      // crypt your mind
      var crypt_pattern = '[crypt_your_mind]';
      if(msg.content.includes(crypt_pattern)){
        hook.innerHTML = hook.innerHTML + '<img  class="separateimg" src="../../../assets/crypt.png" >';
        msg.content = msg.content.replace(crypt_pattern,'');
        this.newpushdown(result => {}); 
        // console.log('paper presentation key word found');
      }
      // mock interview
      var mock_pattern = '[mock]';
      if(msg.content.includes(mock_pattern)){
        hook.innerHTML = hook.innerHTML + '<img  class="separateimg" src="../../../assets/mock.jpg" >';
        msg.content = msg.content.replace(mock_pattern,'');
        this.newpushdown(result => {}); 
        // console.log('paper presentation key word found');
      }
      // code auction
      var codeauction_pattern = '[code_auction]';
      if(msg.content.includes(codeauction_pattern)){
        hook.innerHTML = hook.innerHTML + '<img  class="separateimg" src="../../../assets/code_auction.jpeg" >';
        msg.content = msg.content.replace(codeauction_pattern,'');
        this.newpushdown(result => {}); 
        // console.log('paper presentation key word found');
      }
      // crack it 
      var snapit_pattern = '[snap_it]';
      if(msg.content.includes(snapit_pattern)){
        hook.innerHTML = hook.innerHTML + '<img  class="separateimg" src="../../../assets/snapit.jpeg" >';
        msg.content = msg.content.replace(snapit_pattern,'');
        this.newpushdown(result => {}); 
        // console.log('paper presentation key word found');
      }

      // sponsors 
      var sponsors_pattern = '[sponsors]';
      if(msg.content.includes(sponsors_pattern)){
        this.sliderforsponsor();
        this.newpushdown(result => {}); 
        return;
      }
      if(msg.content.includes('[newedge]')){
        hook.innerHTML = hook.innerHTML + '<img style="height: auto; width: 300px" class="separateimg" src="../../../assets/newedgelogo.png" >';
        msg.content = msg.content.replace('[newedge]','');
        this.newpushdown(result => {}); 
      }
      if(msg.content.includes('[itversity]')){
        hook.innerHTML = hook.innerHTML + '<img style="height: auto; width: 300px" class="separateimg" src="../../../assets/itversity_logo.png" >';
        msg.content = msg.content.replace('[itversity]','');
        this.newpushdown(result => {}); 
      }
      if(msg.content.includes('PayMiTime is a Mobile App which gives instant discounts to customers based upon their time spent')){
        hook.innerHTML = hook.innerHTML + '<img style="height: auto; width: 300px" class="separateimg" src="../../../assets/paymi.png" >';
        // msg.content = msg.content.replace('[newedge]','');
        this.newpushdown(result => {}); 
      }
      if(msg.content.includes('[vivo]')){
        hook.innerHTML = hook.innerHTML + '<img style="height: auto; width: 300px" class="separateimg" src="../../../assets/vivo.png" >';
        msg.content = msg.content.replace('[vivo]','');
        this.newpushdown(result => {}); 
      }
      if(msg.content.includes('[adtran]')){
        hook.innerHTML = hook.innerHTML + '<img style="height: auto; width: 300px" class="separateimg" src="../../../assets/adtran.png" >';
        msg.content = msg.content.replace('[adtran]','');
        this.newpushdown(result => {}); 
      }
      if(msg.content.includes('[contact]')){
        // this.sliderforcontact();
        this.newpushdown(result => {}); 
        // return;
      }
      if(msg.content.includes('[developers]')){
        this.sliderforteam();
        this.newpushdown(result => {}); 
        return;
      }
      if(msg.content.includes('[circuit]')){
        // hook.innerHTML = hook.innerHTML+ '<div class="server-response separateimg">' + 'How do I look? :p' + '</div>';
        hook.innerHTML = hook.innerHTML + '<img style="height: auto; width: 300px" class="separateimg" src="../../../assets/circuit.jpg" >';
        msg.content = msg.content.replace('[circuit]','');
        this.newpushdown(result => {}); 
        return;
      }








      // for the list of events
      if(msg.content.includes(this.event_patter)){
        // console.log('event pattern found');
        hook.innerHTML = hook.innerHTML+ '<div class="server-response">' + 'Swipe for more events. Click for more information about the event!' + '</div>';
        hook.innerHTML = hook.innerHTML + 
        '<div class="event-pallete">'+
        '<div class=" container event-pallete-item paper"  ><img src="../../../assets/paper_new.png" alt=""><div class="text">Paper Presentation</div></div>'+
        '<div class=" container event-pallete-item poster"  ><img src="../../../assets/poster_new.jpg" alt=""><div class="text">Poster Presentation</div></div>'+
        '<div class=" container event-pallete-item opc"  ><img src="../../../assets/opc_new.jpeg" alt=""><div class="text">OPC</div></div>'+
        // '<div class=" container event-pallete-item hackathon"  ><img src="../../../assets/poster.jpeg" alt=""><div class="text">Hackathon</div></div>'+
        // '<div class=" container event-pallete-item workshop"  ><img src="../../../assets/poster.jpeg" alt=""><div class="text">Workshop</div></div>'+
        '<div class=" container event-pallete-item mock"  ><img src="../../../assets/mock.jpg" alt=""><div class="text">Mock Interview</div></div>'+
        // '<div class=" container event-pallete-item treasure"  ><img src="../../../assets/poster.jpeg" alt=""><div class="text">Treasure Hunt</div></div>'+
        // '<div class=" container event-pallete-item tagteam"  ><img src="../../../assets/poster.jpeg" alt=""><div class="text">TagTeam Coding</div></div>'+
        // '<div class=" container event-pallete-item efficient"  ><img src="../../../assets/poster.jpeg" alt=""><div class="text">Efficient Coding</div></div>'+
        '<div class="container event-pallete-item drawthecode"><img src="../../../assets/drawthecode.jpeg" alt=""><div class="text">Draw The Code</div></div>'+
        '<div class="container event-pallete-item codenladder"><img src="../../../assets/codenadders.jpeg" alt=""><div class="text">Code N Ladders</div></div>'+
        '<div class="container event-pallete-item tictactoe"><img src="../../../assets/tictactoe.jpeg" alt=""><div class="text">Tic Tac Toe</div></div>'+
        '<div class="container event-pallete-item wordmagic"><img src="../../../assets/magicwords.jpeg" alt=""><div class="text">Word Magic</div></div>'+
        '<div class="container event-pallete-item crypt"><img src="../../../assets/crypt.png" alt=""><div class="text">Crypt Your Mind</div></div>'+
        '<div class="container event-pallete-item brick"><img src="../../../assets/brickthecode.jpeg" alt=""><div class="text">Brick The Code</div></div>'+
        // '<div class="container event-pallete-item codingquiz"><img src="../../../assets/brickthecode.png" alt=""><div class="text">Coding Quiz</div></div>'+
        '<div class="container event-pallete-item earnyourtime"><img src="../../../assets/earnyourtime1.jpeg" alt=""><div class="text">Earn Your Time</div></div>'+
        '<div class="container event-pallete-item codeauction"><img src="../../../assets/code_auction.jpeg" alt=""><div class="text">Code Auction</div></div>'+
        '<div class="container event-pallete-item snapit"><img src="../../../assets/snapit.jpeg" alt=""><div class="text">Snappit</div></div>'+
        '<div class="container event-pallete-item timeisup"><img src="../../../assets/timesup.jpeg" alt=""><div class="text">Time Is Up</div></div>'+
        '<div class="container event-pallete-item crackit"><img src="../../../assets/crackit.jpeg" alt=""><div class="text">Crack It</div></div>'+
        '</div>';
        // events with no pictures as of now
        
        
        // <div class="container event-pallete-item"><img src="../../../assets/eventdemo.PNG" alt=""><div class="text">Paper Presentation</div></div>
        // <div class="container event-pallete-item"><img src="../../../assets/eventdemo.PNG" alt=""><div class="text">Paper Presentation</div></div>
        // </div>';

      //  this.elementRef.nativeElement.querySelector('.poster').addEventListener('click',this.event_sendmsg.bind(this));
      
      this.addall();

        this.insound.play();
          return;
        }
      

        if(msg.content.includes('[navigation]')){
          // hook.innerHTML = hook.innerHTML+ '<div class="server-response">'+ '<a href="' + 'https://www.google.com/maps/dir/?api=1&destination=17.380337,78.382667&origin=">' + 'Click here for navigation'+'</a>  ' + '</div>';
          hook.innerHTML = hook.innerHTML + 
          '<div class="event-pallete">'+
          '<div class="event-pallete-item" >' + '<a href="' + 'https://www.google.com/maps/dir/?api=1&destination=17.380337,78.382667&origin=">' + 
          '<img style="height: auto; width: auto"  src="../../../assets/map.png" >'+
          '<div class="text">Click here</div>'+ 
           '</a>' + '</div>'+
          '</div';
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
  this.elementRef.nativeElement.querySelectorAll('.newedge').forEach(element => {
    element.addEventListener('click',this.newedge_sendmsg.bind(this));
  });
  this.elementRef.nativeElement.querySelectorAll('.itversity').forEach(element => {
    element.addEventListener('click',this.itversity_sendmsg.bind(this));
  });this.elementRef.nativeElement.querySelectorAll('.paymitime').forEach(element => {
    element.addEventListener('click',this.paymitime_sendmsg.bind(this));
  });this.elementRef.nativeElement.querySelectorAll('.vivo').forEach(element => {
    element.addEventListener('click',this.vivo_sendmsg.bind(this));
  });this.elementRef.nativeElement.querySelectorAll('.adtran').forEach(element => {
    element.addEventListener('click',this.adtran_sendmsg.bind(this));
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
 newedge_sendmsg(){
  this.converse('I would like to know more about New Edge!');
}
itversity_sendmsg(){
  this.converse('I would like to know more about Itversity!');
}
paymitime_sendmsg(){
  this.converse('I would like to know more about PayMiTime');
}
vivo_sendmsg(){
  this.converse('I would like to know more about Vivo');
  
}
adtran_sendmsg(){
  this.converse('I would like to know more about Adtran');
}

 sliderforteam(){
  var hook = document.getElementById('chatdialogue');
  // code for limiting the count of msgs
  // this.msgcount = this.msgcount + 1;
  // if(this.msgcount == 70){
  //   hook.innerHTML = '';
  //   this.msgcount = 0;
  // }

  hook.innerHTML = hook.innerHTML + '<div class="server-response">' + 'The people who made me a reality!' + '</div>';
  this.diffpushdown();
  setTimeout(() => {
    hook.innerHTML = hook.innerHTML + '<div class="event-pallete">'+
    '<div class=" container event-pallete-item"  ><img  style="height: 200px;width: 100%;"  src="../../../assets/shiva.jpeg" alt=""><div class="text">Shiva</div></div>'+
    '<div class=" container event-pallete-item"   ><img style="height: 200px;width: 100%;" src="../../../assets/abhi.jpeg" alt=""><div class="text">Abhinav</div></div>'+
    '<div class=" container event-pallete-item"  ><img style="height: 200px;width: 100%;" src="../../../assets/somesh.jpeg" alt=""><div class="text">Somesh</div></div>'+
    '<div class=" container event-pallete-item"  ><img style="height: 200px;width: 100%;" src="../../../assets/sandy.jpeg" alt=""><div class="text">Sandilya</div></div>'+
    '<div class=" container event-pallete-item"  ><img style="height: 200px;width: 100%;" src="../../../assets/uttej.jpeg" alt=""><div class="text">Uttej</div></div>'+
    
    '<div class=" container event-pallete-item"  ><img style="height: 200px;width: 100%;" src="../../../assets/raj.jpeg" alt=""><div class="text">Raj</div></div>'+
    '<div class=" container event-pallete-item"  ><img style="height: 200px;width: 100%;" src="../../../assets/manohar.jpg" alt=""><div class="text">Manohar</div></div>'+
    '<div class=" container event-pallete-item"  ><img style="height: 200px;width: 100%;" src="../../../assets/kaushik.jpg" alt=""><div class="text">Kaushik</div></div>'+
    '<div class=" container event-pallete-item"  ><img style="height: 200px;width: 100%;" src="../../../assets/chakr.jpg" alt=""><div class="text">Chakradhar</div></div>'+
    '</div>';
    this.insound.play();
  this.newpushdown(result => {});
  this.addall();
  }, 1000);
  
}

sliderforsponsor(){
  var hook = document.getElementById('chatdialogue');
  // code for limiting the count of msgs
  this.msgcount = this.msgcount + 1;
  if(this.msgcount == 70){
    hook.innerHTML = '';
    this.msgcount = 0;
  }

  // hook.innerHTML = hook.innerHTML + '<div class="server-response">' + 'The ' + '</div>';
  // this.diffpushdown();
  setTimeout(() => {
    hook.innerHTML = hook.innerHTML + '<div class="server-response">' + 'We have got some great sponsors lined up for this year! Keep sliding for more!'  + '</div>';
    hook.innerHTML = hook.innerHTML + '<div class="event-pallete">'+
    '<div class=" container event-pallete-item newedge" style="width: 300px" ><img  style="height: 200px; width: 100%;"  src="../../../assets/newlogo.png" alt=""><div class="text">NEW EDGE</div></div>'+
    '<div class=" container event-pallete-item itversity " style="width: 300px" ><img style="height: 200px ;width: 100%;" src="../../../assets/itversity_logo.png" alt=""><div class="text">ITVERSITY</div></div>'+
    '<div class=" container event-pallete-item paymitime" style="width: 200px"><img style="height: 200px; width: 100%;" src="../../../assets/paymi.png" alt=""><div class="text">PAYMITIME</div></div>'+
    '<div class=" container event-pallete-item vivo" style="width: 200px" ><img style="height: 200px; width: 100%;" src="../../../assets/vivo.png" alt=""><div class="text">VIVO</div></div>'+
    '<div class=" container event-pallete-item adtran" style="width: 200px;" ><img style="margin: 50px 0px 50px 0px;height: 100px; width: 100%;" src="../../../assets/adtran.png" alt=""><div class="text">ADTRAN</div></div>'+
    
    '</div>';
    this.insound.play();
  this.newpushdown(result => {});
  this.addall();
  }, 100);
  
}




 sliderforcontact(){
  var hook = document.getElementById('chatdialogue');
  // code for limiting the count of msgs
 this.msgcount = this.msgcount + 1;
  if(this.msgcount == 70){
    hook.innerHTML = '';
    this.msgcount = 0;
  }

  hook.innerHTML = hook.innerHTML + '<div class="user-request">' + 'Whom should I contact for more details?' + '</div>';
  this.diffpushdown();
  this.increment_count();
  setTimeout(() => {
    hook.innerHTML = hook.innerHTML + '<div class="event-pallete"   >'+
    '<div class=" container event-pallete-item" ><img style="height: 200px;" src="../../../assets/hod2.jpg" alt=""><div class="text">Dr. T. Adilakshmi</div>'+
    '</div>'+
    '<div class=" container event-pallete-item"  ><img style="height: 200px;" src="../../../assets/sashi.jpg" alt=""><div class="text">Mr. M. S. V. Sashi Kumar</div>'+
    '</div>'+
    '<div class=" container event-pallete-item"  ><img  style="height: 200px;"  src="../../../assets/vip.jpeg" alt=""><div class="text">Vipanchith Reddy</div>'+
    '<div class="desc" style="font-size: 14px;" > <i class="fas fa-phone fa-rotate-90 " ></i><a href="tel:7416269757"> 7416269757 </a></div> </div>'+
    '<div class=" container event-pallete-item"  ><img style="height: 200px;" src="../../../assets/saikrishna.jpeg" alt=""><div class="text">Sai Krishna</div>'+
    '<div class="desc" style="font-size: 14px;" ><i class="fas fa-phone fa-rotate-90 " ></i> <a href="tel:9030051070"> 9030051070 </a></div></div>'+
    '<div class=" container event-pallete-item"  ><img style="height: 200px;" src="../../../assets/manasa.jpeg" alt=""><div class="text">Manasa</div>'+
    '<div class="desc" style="font-size: 14px;" ><i class="fas fa-phone fa-rotate-90 " ></i> <a href="tel:9908836686"> 9908836686 </a></div></div>'+
    '<div class=" container event-pallete-item"  ><img style="height: 200px;" src="../../../assets/parthu.jpg" alt=""><div class="text">Parthu</div>'+
    '<div class="desc" style="font-size: 14px;" ><i class="fas fa-phone fa-rotate-90 " ></i> <a href="tel:8121731761"> 8121731761 </a></div></div>'+
    
    '<div class=" container event-pallete-item"  ><img style="height: 200px;" src="../../../assets/honey.jpg" alt=""><div class="text">Honey</div>'+
    '<div class="desc" style="font-size: 14px;" ><i class="fas fa-phone fa-rotate-90 " ></i> <a href="tel:9951152911"> 9951152911 </a></div></div>'+
    
    
    '</div>';
    this.insound.play();
  this.newpushdown(result => {});
  this.addall();
  }, 1000);
 }


 increment_count(){
   this.af.object('/msg').query.ref.transaction((c:number)=>{
     return c +  1;
   })
 }
 displaynumber(){
   this.increment_count();
  var hook = document.getElementById('chatdialogue');
  // code for limiting the count of msgs
 this.n = this.af.list('/');
 hook.innerHTML = hook.innerHTML + '<div class="user-request">' + "What's the total message count?"+ '</div>';
 this.pushdown();
 this.http.get('https://msgcount-d33d7.firebaseio.com/msg.json')
  .subscribe(
    (v) => {
      this.n = v.json();
      
      
      // setTimeout(()=>{
        hook.innerHTML = hook.innerHTML + '<div class="server-response">' + 'Total messsage count till now:  ' + this.n + '</div>';
        this.insound.play();
        this.pushdown();
      // },500);

      // console.log(this.n);
      }
  );

  
  
 }
  }
