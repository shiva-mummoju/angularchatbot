import { Component, OnInit } from '@angular/core';
import { ChatService, Message } from '../chat/chat.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/scan';
import { Inject} from "@angular/core";
import { DOCUMENT } from '@angular/platform-browser'; 
import { AfterViewChecked } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { OnChanges } from '@angular/core';


@Component({
  selector: 'app-typingpad',
  templateUrl: './typingpad.component.html',
  styleUrls: ['./typingpad.component.css']
})
export class TypingpadComponent implements OnInit {

  constructor(public chat: ChatService,@Inject(DOCUMENT) private document: Document) { }


  formValue:string = "";

  ngOnInit() {
  }


  sendMessage(){
    if(this.formValue != '')
    this.chat.converse(this.formValue);
    this.formValue = '';
  }
}
