import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import Quill from 'quill';
import {
  EditorChangeContent,
  EditorChangeSelection,
  QuillEditorComponent,
} from 'ngx-quill';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
//import { ViewEncapsulation } from '@angular/core';

// const font = Quill.import('formats/font');
// font.whitelist = ['mirza', 'roboto', 'aref', 'serif', 'sansserif', 'monospace'];
// Quill.register(font, true);

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit, OnChanges {
  @Input() initialValue: string = '';
  @Output() quillTextChange = new EventEmitter<string>();
  @Input() globalEdit: boolean | null = true;

  isToolbarHidden: boolean = false;
  modules = {};

  quillForm: FormGroup;

  constructor(private sanitizer: DomSanitizer, private fb: FormBuilder) {
    this.quillForm = this.fb.group({
      html: new FormControl(),
    });
  }

  ngOnChanges(): void {
    if (!this.globalEdit) {
      this.isToolbarHidden = true;
    }
  }

  ngOnInit(): void {
    this.quillForm.setValue({ html: this.initialValue });
    if (this.initialValue) this.isToolbarHidden = true;
  }

  save() {
    this.isToolbarHidden = true;
    const text = this.quillForm.get('html')?.value;
    this.quillTextChange.emit(text);
  }
}
