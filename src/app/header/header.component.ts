// import {MediaMatcher} from '@angular/';
import {ChangeDetectorRef, Component} from '@angular/core';
import {trigger, animate, style, group, animateChild, query, stagger, transition} from '@angular/animations';
/** @title Responsive sidenav */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
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
export class HeaderComponent {
  mobileQuery: MediaQueryList;
  
  fillerNav = Array(50).fill(0).map((_, i) => `Nav Item ${i + 1}`);


  private _mobileQueryListener: () => void;
  // media: MediaMatcher
  constructor(changeDetectorRef: ChangeDetectorRef) {
    // this.mobileQuery = media.matchMedia('(max-width: 600px)');
    // this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    // this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  shouldRun = true;
  prepareRouteTransition(outlet) {
    
    return '*';
  }
}


/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */