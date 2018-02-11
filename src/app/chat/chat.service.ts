import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { ApiAiClient } from 'api-ai-javascript';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { OnInit } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import{Howl,Howler} from 'howler';
// import { ViewChild } from '@angular/core';

// import { ChatDialogComponent } from './chat-dialog/chat-dialog.component';

export class Message {
  constructor(public content: string, public sentBy: string) {}
}

@Injectable()
export class ChatService implements OnInit{
  private inaudio;
  private outautio;
  // using howler for playing sounds
   insound = new Howl({
     src: ['../../assets/in.mp3']
   });
   outsound = new Howl({
    src: ['../../assets/out.mp3']
  });
  // @ViewChild(ChatDialogComponent) private mychat: ChatDialogComponent;
  @Output()  myevent = new EventEmitter<void>();
  



  readonly token = environment.dialogflow.Acumen;
  readonly client = new ApiAiClient({ accessToken: this.token });

  conversation = new BehaviorSubject<Message[]>([]);

  constructor() {}

  ngOnInit(){
   
    
  }

  greet(){
    const greet = new Message(" Hey there..",'bot');
    this.update(greet);
  }


  // checkuser(){
  //   const greet = new Message(" How may I help you?",'user');
  //   this.update(greet);
  // }

  // Sends and receives messages via DialogFlow
  converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    return this.client.textRequest(msg)
               .then(res => {
                  const speech = res.result.fulfillment.speech;
                  const botMessage = new Message(speech, 'bot');
                  this.update(botMessage);
                  this.myevent.emit();
               });
  }



  // Adds message to source
  update(msg: Message) {

    this.conversation.next([msg]);
    if( msg.sentBy === 'bot'){
      this.insound.play();
    }
   
    // console.log('About to emit from service');
    this.myevent.emit();
    
  }

  geteventemitter(){
   return  this.myevent;
  }


}