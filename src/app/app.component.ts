import { Component } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import {trigger, animate, style, group, animateChild, query, stagger, transition} from '@angular/animations';

// import { routerTransition } from './router.animations';
import { routerNgProbeToken } from '@angular/router/src/router_module';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // animations: [routerTransition],
    animations: [
    trigger('routerAnimations', [
      transition('* => *', [
        query(':enter, :leave',
          style({ position: 'absolute', top: 0, left: 0, right: 0 }), { optional: true }),
        query(':enter', [
          style({ opacity:0, transform: 'translateX(100%)'}),
          query('contributor', [
            style({ opacity:0, transform: 'scale(0)'})
          ], { optional: true })
        ], { optional: true }),

        query(':leave', [
          query('.image', [
            stagger(50, [
              animate('500ms cubic-bezier(.35,0,.25,1)', style({ opacity: 0, transform: 'translateY(-50px)' }))
            ])
          ], { optional: true }),
          animate('800ms cubic-bezier(.35,0,.25,1)', style({ opacity:0, transform: 'translateX(-100%)' }))
        ], { optional: true }),

        group([
          query(':enter', [
            animate('800ms cubic-bezier(.35,0,.25,1)', style('*'))
          ], { optional: true }),
          query(':enter contributor', [
            stagger(200, [
              animate('800ms cubic-bezier(.35,0,.25,1)', style('*'))
            ])
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class AppComponent {

  title = 'CseChatBot';

  prepareRouteTransition(outlet: any) {
    
    return '*';
  }
}
