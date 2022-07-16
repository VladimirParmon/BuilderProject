import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit, OnChanges {
  @Input() initialValue: string = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(): void {}

  ngOnInit(): void {}
}
