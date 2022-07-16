import { Component, Input, OnInit } from '@angular/core';

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

  constructor() {}

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
}
