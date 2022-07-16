import { CdkDragDrop, CdkDragMove } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ActionCases } from 'src/constants/enums';
import { ContentsNode, DropInfo, Lookup } from 'src/constants/models';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root',
})
export class TreeDNDService {
  contentsData: ContentsNode[] | null = null;

  dropTargetIds: string[] = [];
  nodeLookup: Lookup = {};
  dropActionTodo: DropInfo | null = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private stateService: StateService
  ) {
    this.stateService.treeData$.subscribe((data) => {
      if (data) {
        this.contentsData = data;
        this.prepareDragDrop(data);
      }
    });
  }

  prepareDragDrop(nodes: ContentsNode[]) {
    nodes.forEach((node) => {
      this.dropTargetIds.push(node.id);
      this.nodeLookup[node.id] = node;
      if (node.children) this.prepareDragDrop(node.children);
    });
  }

  dragMoved(event: CdkDragMove) {
    let element = this.document.elementFromPoint(
      event.pointerPosition.x,
      event.pointerPosition.y
    );

    if (!element) {
      this.clearDragInfo();
      return;
    }
    let container = element.classList.contains('node-item')
      ? element
      : element.closest('.node-item');
    if (!container) {
      this.clearDragInfo();
      return;
    }

    const newTargetId: string | null = container.getAttribute('data-id');
    let newAction: ActionCases;
    const targetRect = container.getBoundingClientRect();
    const oneThird = targetRect.height / 3;
    if (event.pointerPosition.y - targetRect.top < oneThird) {
      newAction = ActionCases.BEFORE;
    } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
      newAction = ActionCases.AFTER;
    } else {
      newAction = ActionCases.INSIDE;
    }

    if (newTargetId && newAction) {
      this.dropActionTodo = {
        targetId: newTargetId,
        action: newAction,
      };
      this.showDragInfo();
    } else {
      this.clearDragInfo();
      return;
    }
  }

  drop(event: CdkDragDrop<ContentsNode[] | null, any, any>) {
    if (!this.dropActionTodo) return;

    const draggedItemId: string = event.item.data;
    const parentItemId: string = event.previousContainer.id;
    const targetListId: string = this.getParentNodeId(
      this.dropActionTodo.targetId,
      this.contentsData,
      'main'
    );

    const draggedItem = this.nodeLookup[draggedItemId];

    const oldItemContainer =
      parentItemId != 'main'
        ? this.nodeLookup[parentItemId].children
        : this.contentsData;
    const newContainer =
      targetListId != 'main'
        ? this.nodeLookup[targetListId].children
        : this.contentsData;

    if (oldItemContainer && newContainer) {
      let i = oldItemContainer.findIndex(
        (c: ContentsNode) => c.id === draggedItemId
      );
      oldItemContainer.splice(i, 1);

      switch (this.dropActionTodo.action) {
        case ActionCases.BEFORE:
        case ActionCases.AFTER:
          const targetIndex = newContainer!.findIndex(
            (c: ContentsNode) => c.id === this.dropActionTodo?.targetId
          );
          this.dropActionTodo.action == ActionCases.BEFORE
            ? newContainer!.splice(targetIndex, 0, draggedItem)
            : newContainer!.splice(targetIndex + 1, 0, draggedItem);
          break;

        case ActionCases.INSIDE:
          {
            const destination = this.nodeLookup[this.dropActionTodo.targetId];
            destination.children.push(draggedItem);
            destination.isExpanded = true;
          }
          break;
      }

      if (this.contentsData)
        this.stateService.treeData$.next(this.contentsData);
    }
    this.clearDragInfo(true);
  }

  getParentNodeId(
    id: string,
    nodesToSearch: ContentsNode[] | null,
    parentId: string
  ): string {
    if (nodesToSearch) {
      for (let node of nodesToSearch) {
        if (node.id == id) return parentId;
        let ret = this.getParentNodeId(id, node.children, node.id);
        if (ret !== 'null') return ret;
      }
    }
    return 'null';
  }

  //Visuals------------------------------------------------------------------

  showDragInfo() {
    this.clearDragInfo();
    if (this.dropActionTodo) {
      this.document
        .getElementById('node-' + this.dropActionTodo.targetId)!
        .classList.add('drop-' + this.dropActionTodo.action);
    }
  }

  clearDragInfo(dropped = false) {
    if (dropped) {
      this.dropActionTodo = null;
    }
    this.document
      .querySelectorAll('.drop-before')
      .forEach((element) => element.classList.remove('drop-before'));
    this.document
      .querySelectorAll('.drop-after')
      .forEach((element) => element.classList.remove('drop-after'));
    this.document
      .querySelectorAll('.drop-inside')
      .forEach((element) => element.classList.remove('drop-inside'));
  }
}
