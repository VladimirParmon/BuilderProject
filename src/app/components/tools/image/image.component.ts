import { Component, Input, OnInit } from '@angular/core';
import { FullscreenService } from 'src/app/services/fullscreen.service';
import { StateService } from 'src/app/services/state.service';
import { flowOptions, positionOptions, ToolNames } from 'src/constants/enums';
import { imageDescription, Styling } from 'src/constants/models';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit {
  @Input() imageData: string = '';
  @Input() indexOfData: number = 0;
  @Input() nodeId: string = '';
  @Input() styling: Styling | undefined = {
    currentPositionX: positionOptions.START,
    currentPositionY: positionOptions.START,
    currentFlow: flowOptions.ROW,
  };
  images: imageDescription[] = [];
  currentPositionX: positionOptions = positionOptions.START;
  currentPositionY: positionOptions = positionOptions.START;
  currentFlow: flowOptions = flowOptions.ROW;
  positions = positionOptions;

  constructor(
    public stateService: StateService,
    private fullscreenService: FullscreenService
  ) {}

  ngOnInit(): void {
    this.images = JSON.parse(this.imageData) as imageDescription[];
    if (this.styling) {
      this.currentPositionX = this.styling.currentPositionX;
      this.currentPositionY = this.styling.currentPositionY;
      this.currentFlow = this.styling.currentFlow;
    }
  }

  getImage(imageName: string) {
    return 'assets/tempFiles/' + imageName;
  }

  getPicWidth(width: number) {
    return width + 'px';
  }

  handleClick(event: MouseEvent) {
    if (!this.fullscreenService.isFullScreen) {
      this.fullscreenService.openFullscreen(event.target);
    } else {
      this.fullscreenService.closeFullscreen();
    }
  }
}
