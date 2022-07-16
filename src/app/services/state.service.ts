import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ContentsNode, newToolInfo } from 'src/constants/models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  isContentsMenuOpen = new BehaviorSubject(false);
  isGlobalEditOn = new BehaviorSubject(true);
  treeData: ContentsNode[] | null = null;
  treeData$ = new BehaviorSubject(this.treeData);
  newToolHasBeenAdded: Subject<newToolInfo> = new Subject();

  constructor(private http: HttpClient) {}

  getTreeData() {
    return this.http
      .get<ContentsNode[]>('http://127.0.0.1:3000/getTree')
      .subscribe((data) => {
        let x = data as ContentsNode[];
        this.treeData$.next(x);
      });
  }

  write(TreeData: ContentsNode[]) {
    return this.http
      .post('http://127.0.0.1:3000/writeTree', {
        body: TreeData,
      })
      .subscribe();
  }

  generate(pageName: string) {
    return this.http
      .post('http://127.0.0.1:3000/generate', {
        body: pageName,
      })
      .subscribe();
  }

  deleteFromDisc(files: string) {
    return this.http
      .post('http://127.0.0.1:3000/deleteFiles', {
        body: JSON.parse(files),
      })
      .subscribe();
  }
}
