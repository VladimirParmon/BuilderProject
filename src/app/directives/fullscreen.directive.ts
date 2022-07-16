import { DOCUMENT } from '@angular/common';
import { Directive, HostListener, Inject } from '@angular/core';
import { FullscreenService } from '../services/fullscreen.service';

@Directive({
  selector: '[appFullscreen]',
})
export class FullscreenDirective {
  constructor(private fullscreenService: FullscreenService) {}

  @HostListener('fullscreenchange', ['$event'])
  @HostListener('webkitfullscreenchange', ['$event'])
  @HostListener('mozfullscreenchange', ['$event'])
  @HostListener('MSFullscreenChange', ['$event'])
  fullscreenmodes(event: Event) {
    this.chkScreenMode();
  }

  chkScreenMode() {
    if (document.fullscreenElement) {
      this.fullscreenService.isFullScreen = true;
    } else {
      this.fullscreenService.isFullScreen = false;
    }
  }
}
