import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  @Input() data: string = '';
  @Input() indexOfData: number = 0;
  @Input() nodeId: string = '';
  videoSrc: string = '';

  constructor() {}

  ngOnInit(): void {
    this.videoSrc = JSON.parse(this.data)[0];
  }

  getSrc() {
    return 'assets/tempFiles/' + this.videoSrc;
  }
}
