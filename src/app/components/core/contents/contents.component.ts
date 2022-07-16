import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { ContentsNode, ExpandButtonState } from 'src/constants/models';
import { trigger, style, animate, transition } from '@angular/animations';
import { ExpandButtonInnerText } from 'src/constants/enums';
import { TreeDataService } from 'src/app/services/tree-data.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.scss'],
  animations: [
    trigger('animate', [
      transition('void => *', [
        style({ width: '0' }),
        animate(100, style({ width: '*' })),
      ]),
      transition('* => void', [animate(100, style({ width: '0' }))]),
      transition('* => *', animate('300ms ease-out')),
    ]),
    trigger('fold', [
      transition(':enter', [
        style({ height: 0, width: 0, overflow: 'hidden' }),
        animate('0.3s ease', style({ height: '*' })),
        animate('1s ease', style({ width: '*' })),
      ]),
      transition(':leave', [
        style({ height: '*', width: '*', overflow: 'hidden' }),
        animate('0.6s ease', style({ width: 0 })),
        animate('0.3s ease', style({ height: 0 })),
      ]),
    ]),
  ],
})
export class ContentsComponent implements OnInit {
  isMenuOpen$: BehaviorSubject<boolean>;
  expandButtonState: ExpandButtonState = {
    expanded: false,
    text: {
      open: ExpandButtonInnerText.OPEN,
      close: ExpandButtonInnerText.CLOSE,
    },
  };

  constructor(
    private stateService: StateService,
    public treeDataService: TreeDataService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.isMenuOpen$ = this.stateService.isContentsMenuOpen;
  }

  ngOnInit(): void {}

  isTreeExpanded(nodes: ContentsNode[] | null) {
    if (nodes) {
      this.expandButtonState.expanded = !this.expandButtonState.expanded;
      const command = this.expandButtonState.expanded;
      transform(nodes);

      function transform(nodes: ContentsNode[]) {
        for (let node of nodes) {
          node.isExpanded = command;
          if (node.children) transform(node.children);
        }
      }
    }
  }

  navigate(id: string) {
    this.router.navigate(['/view', id]);
  }
}
