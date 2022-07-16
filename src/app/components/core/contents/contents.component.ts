import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { ContentsNode, ExpandButtonState } from 'src/constants/models';
import { trigger, style, animate, transition } from '@angular/animations';
import { TreeDNDService } from 'src/app/services/treeDND.service';
import { ExpandButtonInnerText } from 'src/constants/enums';
import { TreeDataService } from 'src/app/services/tree-data.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewPageComponent } from '../../createNew/new-page/new-page.component';
import { ConfirmActionComponent } from '../confirm-action/confirm-action.component';
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
  isGlobalEditOn$: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn;
  expandButtonState: ExpandButtonState = {
    expanded: false,
    text: {
      open: ExpandButtonInnerText.OPEN,
      close: ExpandButtonInnerText.CLOSE,
    },
  };
  isDraggable: boolean = false;

  constructor(
    private stateService: StateService,
    public treeService: TreeDNDService,
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

  openAddNewPageDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = false;
    dialogConfig.position = { top: '5%' };
    dialogConfig.panelClass = ['add-page-dialog'];
    dialogConfig.data = 'Создать новую страницу';

    let dialogRef = this.dialog.open(NewPageComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((pageName) => {
      if (pageName) this.treeDataService.addNewPage(pageName);
    });
  }

  openDeletePageDialog(nodeId: string) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = false;
    dialogConfig.position = { top: '5%' };
    dialogConfig.panelClass = ['delete-page-dialog'];

    let dialogRef = this.dialog.open(ConfirmActionComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((yes) => {
      if (yes) this.treeDataService.deletePage(nodeId);
    });
  }

  toggleDND(checkboxValue: boolean) {
    this.isDraggable = checkboxValue;
  }

  toggleGlobalEdit(checkboxValue: boolean) {
    this.isDraggable = false;
    this.stateService.isGlobalEditOn.next(checkboxValue);
  }

  navigate(id: string) {
    this.router.navigate(['/view', id]);
  }

  saveTree(treeData: ContentsNode[] | null) {
    if (treeData) this.stateService.write(treeData);
  }

  generate() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = false;
    dialogConfig.position = { top: '5%' };
    dialogConfig.panelClass = ['add-page-dialog'];
    dialogConfig.data = 'Создать новый сайт';

    let dialogRef = this.dialog.open(NewPageComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((pageName) => {
      if (pageName) this.stateService.generate(pageName);
    });
  }
}
