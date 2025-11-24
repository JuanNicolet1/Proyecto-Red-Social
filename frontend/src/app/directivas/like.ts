import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appLike]'
})
export class Like {

  constructor(private er: ElementRef) {}

  @HostListener('click')
  animate() {
    this.er.nativeElement.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
    this.er.nativeElement.style.transform = 'translateY(-20px)';
    this.er.nativeElement.style.opacity = '0';

    setTimeout(() => {
      this.er.nativeElement.style.transform = 'translateY(0)';
      this.er.nativeElement.style.opacity = '1';
    }, 400);
  }
}
