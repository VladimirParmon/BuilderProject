import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { TreeDataService } from 'src/app/services/tree-data.service';
import { ToolNames } from 'src/constants/enums';
import { ChooseFileComponent } from '../../createNew/choose-file/choose-file.component';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss'],
})
export class PdfComponent implements OnInit {
  @Input() data: string = '';
  @Input() indexOfData: number = 0;
  @Input() nodeId: string = '';
  PDFnames: string[] = [];
  isGlobalEditOn$: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn;

  constructor(
    private treeService: TreeDataService,
    private dialog: MatDialog,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.PDFnames = JSON.parse(this.data);
  }

  getFilePath(fileName: string) {
    return 'assets/tempFiles/' + fileName;
  }

  getName(fileName: string) {
    const noPDFExtension = fileName.replace(/.pdf/i, '');
    if (fileName.length > 50) return noPDFExtension.slice(0, 50) + '...';
    return noPDFExtension;
  }

  deletePDF(index: number) {
    const fileName = this.PDFnames.splice(index, 1)[0];
    this.saveData();
    this.stateService.deleteFromDisc(JSON.stringify([fileName]));
  }

  addPDF() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = false;
    dialogConfig.position = { top: '15%' };
    dialogConfig.panelClass = ['choose-file-dialog'];
    dialogConfig.data = ToolNames.PDF;

    let dialogRef = this.dialog.open(ChooseFileComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((fileData: string) => {
      if (fileData) {
        const PDFs = JSON.parse(fileData) as string[];
        this.PDFnames = [...this.PDFnames, ...PDFs];
        this.saveData();
      }
    });
  }

  saveData() {
    this.treeService.changeNodeDataSrc(
      this.nodeId,
      JSON.stringify(this.PDFnames),
      this.indexOfData
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.PDFnames, event.previousIndex, event.currentIndex);
    this.saveData();
  }
}
