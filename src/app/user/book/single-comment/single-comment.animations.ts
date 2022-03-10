import { animate, state, style, transition, trigger } from "@angular/animations";

export const animationOptions: any = {
    collapsed: {
        height: "250px"
    },
    notCollapsed: {
        height: "500px"
    }
}


export const singleCommentAnimations: any[] = [
    trigger('collapse', [
        state('collapsed', style({        
          height: "{{height}}"
        }), {
            params: animationOptions.collapsed
        }),
        state("not-collapsed", style({
          height: "{{height}}",          
        }), {
            params: animationOptions.notCollapsed
        }),
        transition('collapsed => not-collapsed', [
          animate('1.5s ease')
        ]),
        transition('not-collapsed => collapsed', [
          animate('0.5s cubic-bezier(.69,.19,.24,.91)')
        ])
      ])
];