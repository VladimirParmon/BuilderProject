import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { TreeDataService } from 'src/app/services/tree-data.service';
import {
  ContentsNode,
  imageDescription,
  MediaData,
} from 'src/constants/models';
import { debounceTime, filter } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ToolNames } from 'src/constants/enums';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit, OnDestroy, OnChanges {
  nodeId: string | null = null;
  previousNodeId: string | undefined;
  nextNodeId: string | undefined;
  node: ContentsNode | undefined;
  dataChangesSubscription$: Subscription;
  routerChangesSubscription$: Subscription;
  newToolHasBeenAdded$: Subscription;
  isGlobalEditOn$: BehaviorSubject<boolean> = this.stateService.isGlobalEditOn;

  pageName: string = '';
  isEditorOn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private dataService: TreeDataService,
    private stateService: StateService,
    private router: Router
  ) {
    this.dataChangesSubscription$ = this.stateService.treeData$
      .pipe(debounceTime(100))
      .subscribe(() => {
        this.getInfo();
      });
    this.routerChangesSubscription$ = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.getInfo();
      });
    this.newToolHasBeenAdded$ = this.stateService.newToolHasBeenAdded.subscribe(
      ({ tool, fileData = '' }) => {
        const newTool: MediaData = {
          index: this.node!.data.length,
          type: tool,
          src: fileData,
        };
        this.node?.data.push(newTool);
      }
    );
  }

  ngOnInit(): void {}

  ngOnChanges(): void {}

  ngOnDestroy(): void {
    this.dataChangesSubscription$.unsubscribe();
    this.routerChangesSubscription$.unsubscribe();
    this.newToolHasBeenAdded$.unsubscribe();
  }

  getInfo() {
    this.nodeId = this.route.snapshot.paramMap.get('id');
    if (this.nodeId) {
      const res = this.dataService.deliverNode(this.nodeId);
      if (res) {
        this.node = res.nodeToFind;
        this.previousNodeId = res.previousNodeId;
        this.nextNodeId = res.nextNodeId;
      } else {
        if (res === undefined) this.router.navigate(['']);
      }
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    //moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }

  deleteTool(tool: MediaData) {
    const index = this.node?.data.indexOf(tool);
    if (index !== undefined) this.node?.data.splice(index, 1);
    if (tool.type !== ToolNames.TEXT) {
      if (tool.type === ToolNames.PICTURE || tool.type === ToolNames.SLIDER) {
        const pics = JSON.parse(tool.src);
        const res = pics.map((pic: imageDescription) => {
          return pic.src;
        });
        this.stateService.deleteFromDisc(JSON.stringify(res));
      } else {
        this.stateService.deleteFromDisc(tool.src);
      }
    }
  }

  savePageName() {
    this.isEditorOn = false;
    if (this.node) this.node.name = this.pageName;
  }

  editPageName() {
    this.isEditorOn = true;
    if (this.node) this.pageName = this.node.name;
  }
}
