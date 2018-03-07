import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-csfest',
  templateUrl: './csfest.component.html',
  styleUrls: ['./csfest.component.css']
})
export class CsfestComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {

    
  }
  do_something(){
    setTimeout(() => {
      this.router.navigate(['/venus']);
   }, 2000);
  }

}
