import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { inputTypes, ToolNames } from 'src/constants/enums';
import { imageDescription } from 'src/constants/models';

@Component({
  selector: 'app-choose-file',
  templateUrl: './choose-file.component.html',
  styleUrls: ['./choose-file.component.scss'],
})
export class ChooseFileComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<string>,
    @Inject(MAT_DIALOG_DATA) public dialogRefData: ToolNames
  ) {}

  ngOnInit(): void {}

  files: File[] = [];

  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  fileBrowseHandler(eventTarget: any) {
    this.prepareFilesList(eventTarget.files);
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      this.files.push(item);
    }
  }

  formatBytes(bytes: any, decimals?: any) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  async submitFiles() {
    let promises: Promise<string>[] = [];
    for (let item of this.files) {
      const promise = new Promise<string>((resolve) => {
        const file: File = item;
        const formData = new FormData();
        formData.append('my_file', file);
        this.http
          .post('http://127.0.0.1:3000/upload', formData)
          .subscribe(() => {
            resolve(item.name);
          });
      });
      promises.push(promise);
    }
    const result = await Promise.all(promises);
    switch (this.dialogRefData) {
      case ToolNames.SLIDER:
      case ToolNames.PICTURE:
        {
          let arrayOfPics: imageDescription[] = [];
          result.forEach((picName: string, index: number) => {
            arrayOfPics.push({
              index: index,
              src: picName,
              width: 200,
            });
          });
          this.dialogRef.close(JSON.stringify(arrayOfPics));
        }
        break;
      default:
        this.dialogRef.close(JSON.stringify(result));
    }
  }

  getFileTypes() {
    switch (this.dialogRefData) {
      case ToolNames.SLIDER:
      case ToolNames.PICTURE:
        return inputTypes.IMAGES;
      case ToolNames.AUDIO:
        return inputTypes.AUDIO;
      case ToolNames.PDF:
        return inputTypes.PDF;
      case ToolNames.VIDEO:
        return inputTypes.VIDEO;
      default:
        return '';
    }
  }

  isMultiple() {
    switch (this.dialogRefData) {
      case ToolNames.PRESENTATION:
      case ToolNames.VIDEO:
        return false;
      default:
        return true;
    }
  }
}
