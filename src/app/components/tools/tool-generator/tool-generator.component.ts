import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToolNames } from 'src/constants/enums';
import { MediaData } from 'src/constants/models';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-tool-generator',
  templateUrl: './tool-generator.component.html',
  styleUrls: ['./tool-generator.component.scss'],
  animations: [
    trigger('fold', [
      transition(':enter', [
        style({ height: 0, width: 0 }),
        animate('0.3s ease', style({ height: '*' })),
        animate('1s ease', style({ width: '*' })),
      ]),
      transition(':leave', [
        style({ height: '*', width: '*' }),
        animate('0.6s ease', style({ width: 0 })),
        animate('0.3s ease', style({ height: 0 })),
      ]),
    ]),
  ],
})
export class ToolGeneratorComponent implements OnInit {
  @Input() tool: MediaData;
  @Input() nodeId: string = '';
  @Output() deleteTool = new EventEmitter<MediaData>();
  names = ToolNames;

  constructor() {
    this.tool = {
      index: 0,
      src: '',
      type: ToolNames.UNDEFINED,
    };
  }

  ngOnInit(): void {}

  handleTextChange(text: string) {
    if (this.tool) this.tool.src = text;
  }
}
