import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, Subscription } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { ToolsListOption } from 'src/constants/models';
import { ToolNames } from '../../../../constants/enums';
import { ChooseFileComponent } from '../../createNew/choose-file/choose-file.component';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss'],
})
export class ToolsComponent implements OnInit {
  toolsList: ToolsListOption[] = [
    {
      name: ToolNames.TEXT,
      icon: 'border_color',
    },
    {
      name: ToolNames.PICTURE,
      icon: 'photo_library',
    },
    {
      name: ToolNames.PDF,
      icon: 'picture_as_pdf',
    },
    {
      name: ToolNames.VIDEO,
      icon: 'video_library',
    },
    {
      name: ToolNames.AUDIO,
      icon: 'library_music',
    },

    {
      name: ToolNames.SLIDER,
      icon: 'auto_awesome_motion',
    },
    {
      name: ToolNames.PRESENTATION,
      icon: 'picture_in_picture',
    },
  ];

  isGlobalEditOn: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn;
  routerChangesSubscription$: Subscription;
  isToolbarActivated: boolean = false;

  constructor(
    private router: Router,
    private stateService: StateService,
    private dialog: MatDialog
  ) {
    this.routerChangesSubscription$ = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((info) => {
        this.isToolbarActivated = info.url.includes('view') ? true : false;
      });
  }

  ngOnInit(): void {}

  useTool(name: ToolNames): void {
    switch (name) {
      case ToolNames.TEXT:
        this.stateService.newToolHasBeenAdded.next({ tool: ToolNames.TEXT });
        break;
      case ToolNames.AUDIO:
        this.openNewDialog(ToolNames.AUDIO);
        break;
      case ToolNames.PDF:
        this.openNewDialog(ToolNames.PDF);
        break;
      case ToolNames.PICTURE:
        this.openNewDialog(ToolNames.PICTURE);
        break;
      case ToolNames.PRESENTATION:
        //this.stateService.newToolHasBeenAdded.next(ToolNames.PRESENTATION);
        break;
      case ToolNames.VIDEO:
        this.openNewDialog(ToolNames.VIDEO);
        break;
      case ToolNames.SLIDER:
        this.openNewDialog(ToolNames.SLIDER);
        break;
    }
  }

  openNewDialog(toolName: ToolNames) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = false;
    dialogConfig.position = { top: '15%' };
    dialogConfig.panelClass = ['choose-file-dialog'];
    dialogConfig.data = toolName;

    let dialogRef = this.dialog.open(ChooseFileComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((fileData: string) => {
      if (fileData)
        this.stateService.newToolHasBeenAdded.next({
          tool: toolName,
          fileData,
        });
    });
  }
}
