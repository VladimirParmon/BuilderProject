import { Injectable } from '@angular/core';
import {
  ContentsNode,
  deliveredNodeInfo,
  MediaData,
  Styling,
} from 'src/constants/models';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root',
})
export class TreeDataService {
  contentsData: ContentsNode[] | null = null;

  constructor(private stateService: StateService) {
    this.stateService.treeData$.subscribe((data) => {
      this.contentsData = data;
    });
  }

  findNode(
    id: string,
    currentNode: ContentsNode,
    lastParent?: ContentsNode
  ): { nodeToFind: ContentsNode; parent: ContentsNode | undefined } | false {
    if (id === currentNode.id) {
      return { nodeToFind: currentNode, parent: lastParent };
    } else {
      for (let node of currentNode.children) {
        let lastParent = currentNode;
        let currentChild = node;
        let result = this.findNode(id, currentChild, lastParent);
        if (result !== false) {
          return result;
        }
      }
      return false;
    }
  }

  changeNodeDataSrc(
    nodeId: string,
    newSrc: string,
    indexOfData: number,
    newStyling?: Styling
  ): void {
    if (this.contentsData) {
      for (let node of this.contentsData) {
        if (node.id === nodeId) {
          const dataToFind = node.data.find(
            (element: MediaData) => element.index === indexOfData
          );
          if (dataToFind) {
            dataToFind.src = newSrc;
            if (newStyling) dataToFind.styling = newStyling;
          }
        } else {
          const { nodeToFind } = this.findNode(nodeId, node) || {};
          if (nodeToFind) {
            const dataToFind = nodeToFind.data.find(
              (element: MediaData) => element.index === indexOfData
            );
            if (dataToFind) {
              dataToFind.src = newSrc;
              if (newStyling) dataToFind.styling = newStyling;
            }
          }
        }
      }
    }
  }

  deliverNode(nodeId: string): deliveredNodeInfo | undefined | null {
    if (this.contentsData) {
      for (let node of this.contentsData) {
        const { nodeToFind, parent } = this.findNode(nodeId, node) || {};
        if (nodeToFind) {
          if (parent) {
            const index: number = parent.children.indexOf(nodeToFind);
            const previousNodeId: string | undefined =
              parent.children[index - 1]?.id;
            const nextNodeId: string | undefined =
              parent.children[index + 1]?.id;
            return { nodeToFind, previousNodeId, nextNodeId };
          } else {
            return {
              nodeToFind,
              previousNodeId: undefined,
              nextNodeId: undefined,
            };
          }
        }
      }
      return undefined;
    }
    return null;
  }
}
