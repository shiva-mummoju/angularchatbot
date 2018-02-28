import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcomescreen',
  templateUrl: './welcomescreen.component.html',
  styleUrls: ['./welcomescreen.component.css']
})
export class WelcomescreenComponent implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
       this.router.navigate(['/chatbot']);
    }, 4000);


  }

}
