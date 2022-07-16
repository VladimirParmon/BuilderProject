import { Component, Input, OnInit } from '@angular/core';

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

  constructor() {}

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
}
