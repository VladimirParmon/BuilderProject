import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
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
export class ViewComponent implements OnDestroy {
  nodeId: string | null = null;
  previousNodeId: string | undefined;
  nextNodeId: string | undefined;
  node: ContentsNode | undefined;
  dataChangesSubscription$: Subscription;
  routerChangesSubscription$: Subscription;

  pageName: string = '';

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
  }

  ngOnDestroy(): void {
    this.dataChangesSubscription$.unsubscribe();
    this.routerChangesSubscription$.unsubscribe();
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
}
