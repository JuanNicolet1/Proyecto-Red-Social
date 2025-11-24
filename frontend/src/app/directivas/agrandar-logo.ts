import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAgrandarLogo]'
})
export class AgrandarLogo {

  constructor(private er: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.er.nativeElement.style.transform = 'scale(1.15)';
    this.er.nativeElement.style.transition = '0.2s ease';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.er.nativeElement.style.transform = 'scale(1)';
  }

}
