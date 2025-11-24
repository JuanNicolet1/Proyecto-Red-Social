import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDislike]'
})
export class Dislike {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  @HostListener('click')
  animar() {
  this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 0.8s cubic-bezier(.25,1.5,.5,1)');
  this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(-20px) scale(1.3)');

  setTimeout(() => {
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0) scale(1)');
  }, 800);
}


}
