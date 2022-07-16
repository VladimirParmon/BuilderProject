import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrls: ['./new-page.component.scss'],
})
export class NewPageComponent implements OnInit {
  pageName: string = '';
  @HostListener('document:keydown.enter')
  onEnter() {
    this.dialogRef.close(this.pageName);
  }

  constructor(
    public dialogRef: MatDialogRef<NewPageComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogRefData: String
  ) {}

  ngOnInit(): void {}
}
