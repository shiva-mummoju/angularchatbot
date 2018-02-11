import {animate, animateChild, group, query as q, sequence, state, style, transition, trigger} from '@angular/animations';

// this solves them problem
export function query(s, a) {
    return q(s, a, {optional: true});
}

export const routerTransition = trigger('routerTransition', [
  transition('* => *', [
    query(':enter, :leave', style({position: 'fixed', width: '100%'})),
    query(':enter', style({transform: 'translateX(100%)'})),
    sequence([
      query(':leave', animateChild()),
      group([
        query(':leave', [
          style({transform: 'translateX(0%)'}),
          animate('400ms cubic-bezier(.75,-0.48,.26,1.52)',
            style({transform: 'translateX(-100%)'}))
        ]),
        query(':enter', [
          style({transform: 'translateX(100%)'}),
          animate('400ms cubic-bezier(.75,-0.48,.26,1.52)',
            style({transform: 'translateX(0%)'}))
        ])
      ]),
      query(':enter', animateChild())
    ])
  ])
]);