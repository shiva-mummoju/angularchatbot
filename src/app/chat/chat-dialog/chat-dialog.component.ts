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
// import { connect } from 'tls';


@Component({
  selector: 'chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css'],
})
export class ChatDialogComponent implements OnInit,AfterViewChecked,OnChanges {
  @ViewChild('msgbox') private mymsgbox: ElementRef;

  messages: Observable<Message[]>;
  formValue: string;
  sub: any;


  constructor(public chat: ChatService,@Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    // setInterval(this.pushdown,100);
    this.chat.greet();

    // appends to array after each new message is added to feedSource
    this.messages = this.chat.conversation.asObservable()
        .scan((acc, val) => {
          {
            var temp = acc.concat(val);
            document.getElementById('msgbox').scrollTop = document.getElementById('msgbox').scrollHeight;
            return temp;
          }
        }
       );
       this.scrollToBottom();
       this.sub = this.chat.geteventemitter().subscribe((item)=> this.pushdown());
  }
  ngAfterViewChecked() {        
    this.scrollToBottom();        
} 

ngOnChanges(){
  this.scrollToBottom();
}

  sendMessage() {
    this.chat.converse(this.formValue);
    this.formValue = '';
    document.getElementById('msgbox').scrollTop = document.getElementById('msgbox').scrollHeight;
  }

  scrollToBottom():void {
      try{
        this.mymsgbox.nativeElement.scrollTop = this.mymsgbox.nativeElement.scrollHeight;
      }catch(err){}
  }

  pushdown(){
    document.getElementById('msgbox').scrollTop = document.getElementById('msgbox').scrollHeight;
    console.log('Pushdown called in chat');
  }
}