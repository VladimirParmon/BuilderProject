import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ContentsNode } from 'src/constants/models';
import treeData from '../../assets/treeData.json';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  isContentsMenuOpen = new BehaviorSubject(false);
  treeData: ContentsNode[] | null = null;
  treeData$ = new BehaviorSubject(this.treeData);

  constructor() {
    this.treeData$.next(treeData);
  }
}
