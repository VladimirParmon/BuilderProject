import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { FullscreenService } from 'src/app/services/fullscreen.service';
import { imageDescription } from 'src/constants/models';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {
  @Input() imageData: string = '';
  @Input() indexOfData: number = 0;
  @Input() nodeId: string = '';
  images: imageDescription[] = [];
  currentPicIndex: number = 0;

  constructor(private fullscreenService: FullscreenService) {}

  ngOnInit(): void {
    this.images = JSON.parse(this.imageData) as imageDescription[];
  }

  getImageSrc(imageName: string): string {
    return 'assets/tempFiles/' + imageName;
  }

  moveSlides(command: 'left' | 'right', event: any): void {
    event.stopImmediatePropagation();
    const currentIndex = this.currentPicIndex;
    const correction = command === 'left' ? -1 : +1;
    const newIndex = currentIndex + correction;
    if (newIndex < 0 || newIndex > this.images.length - 1) return;
    this.currentPicIndex = newIndex;
  }

  goFullscreen(event: MouseEvent) {
    if (!this.fullscreenService.isFullScreen) {
      this.fullscreenService.openFullscreen(event.target as HTMLElement);
    } else {
      this.fullscreenService.closeFullscreen();
    }
  }
}
