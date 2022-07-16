import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { TreeDataService } from 'src/app/services/tree-data.service';
import { ToolNames } from 'src/constants/enums';
import { ChooseFileComponent } from '../../createNew/choose-file/choose-file.component';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss'],
})
export class AudioComponent implements OnInit {
  @Input() data: string = '';
  @Input() indexOfData: number = 0;
  @Input() nodeId: string = '';
  audiosSrc: string[] = [];
  isGlobalEditOn$: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn;

  constructor(
    private dialog: MatDialog,
    private treeService: TreeDataService,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.audiosSrc = JSON.parse(this.data);
  }

  getFilePath(fileName: string) {
    return 'assets/tempFiles/' + fileName;
  }

  getName(fileName: string) {
    if (fileName.length > 50) return fileName.slice(0, 50) + '...';
    return fileName;
  }

  deleteAudio(index: number) {
    const fileName = this.audiosSrc.splice(index, 1)[0];
    this.saveData();
    this.stateService.deleteFromDisc(JSON.stringify([fileName]));
  }

  addAudio() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = false;
    dialogConfig.position = { top: '15%' };
    dialogConfig.panelClass = ['choose-file-dialog'];
    dialogConfig.data = ToolNames.AUDIO;

    let dialogRef = this.dialog.open(ChooseFileComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((fileData: string) => {
      if (fileData) {
        const audios = JSON.parse(fileData) as string[];
        this.audiosSrc = [...this.audiosSrc, ...audios];
        this.saveData();
      }
    });
  }

  saveData() {
    this.treeService.changeNodeDataSrc(
      this.nodeId,
      JSON.stringify(this.audiosSrc),
      this.indexOfData
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.audiosSrc, event.previousIndex, event.currentIndex);
    this.saveData();
  }
}
