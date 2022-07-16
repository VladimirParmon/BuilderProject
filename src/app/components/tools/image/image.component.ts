import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FullscreenService } from 'src/app/services/fullscreen.service';
import { StateService } from 'src/app/services/state.service';
import { TreeDataService } from 'src/app/services/tree-data.service';
import { flowOptions, positionOptions, ToolNames } from 'src/constants/enums';
import { imageDescription, Styling } from 'src/constants/models';
import { ChooseFileComponent } from '../../createNew/choose-file/choose-file.component';

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
  @Input() globalEdit: boolean | null = null;
  images: imageDescription[] = [];
  currentPositionX: positionOptions = positionOptions.START;
  currentPositionY: positionOptions = positionOptions.START;
  currentFlow: flowOptions = flowOptions.ROW;
  positions = positionOptions;
  flow = flowOptions;
  isControlsVisible: boolean = true;
  currentPicIndex: number = -1;
  currentPicWidth: number = 0;
  picControl: number = 0;

  constructor(
    public stateService: StateService,
    private treeService: TreeDataService,
    private dialog: MatDialog,
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

  saveChanges() {
    const style: Styling = {
      currentPositionX: this.currentPositionX,
      currentPositionY: this.currentPositionY,
      currentFlow: this.currentFlow,
    };
    this.treeService.changeNodeDataSrc(
      this.nodeId,
      JSON.stringify(this.images),
      this.indexOfData,
      style
    );
    this.isControlsVisible = false;
    this.currentPicIndex = -1;
  }

  getPicWidth(width: number) {
    return width + 'px';
  }

  deletePic() {
    const fileName = this.images.splice(this.currentPicIndex, 1)[0].src;
    this.currentPicIndex = -1;
    this.stateService.deleteFromDisc(JSON.stringify([fileName]));
  }

  setPicControls(index: number, imageWidth: number) {
    if (!this.globalEdit) return;
    if (this.currentPicIndex === index) {
      setTimeout(() => (this.currentPicIndex = -1), 0);
    } else {
      this.currentPicIndex = index;
      this.currentPicWidth = imageWidth;
    }
  }

  resizePic() {
    const pic = this.images.find((pic) => pic.index === this.currentPicIndex);
    if (pic) pic.width = this.currentPicWidth;
  }

  addImage() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = false;
    dialogConfig.position = { top: '15%' };
    dialogConfig.panelClass = ['choose-file-dialog'];
    dialogConfig.data = ToolNames.PICTURE;

    let dialogRef = this.dialog.open(ChooseFileComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((fileData: string) => {
      if (fileData) {
        const pics = JSON.parse(fileData) as imageDescription[];
        const lastIndex = this.images.length;
        pics.forEach((pic, index) => {
          pic.index = lastIndex + index;
          this.images.push(pic);
        });
      }
    });
  }

  moveImage(command: 'left' | 'right'): void {
    let correctionForPicToMove = command === 'left' ? -1 : +1;
    let correctionForNeighbor = command === 'left' ? +1 : -1;
    const picToMove: imageDescription = this.images.splice(
      this.currentPicIndex,
      1
    )[0];
    picToMove.index += correctionForPicToMove;
    this.images.splice(
      this.currentPicIndex + correctionForPicToMove,
      0,
      picToMove
    );
    this.images[this.currentPicIndex].index += correctionForNeighbor;
    this.currentPicIndex += correctionForPicToMove;
  }

  handleClick(event: MouseEvent) {
    if (this.globalEdit) return;
    if (!this.fullscreenService.isFullScreen) {
      this.fullscreenService.openFullscreen(event.target);
    } else {
      this.fullscreenService.closeFullscreen();
    }
  }
}
