import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ContentsNode, newToolInfo } from 'src/constants/models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  isContentsMenuOpen = new BehaviorSubject(false);
  treeData: ContentsNode[] | null = null;
  treeData$ = new BehaviorSubject(this.treeData);

  private _jsonURL = 'assets/treeData.json';

  constructor(private http: HttpClient) {
    this.getJSON().subscribe((data: ContentsNode[]) => {
      this.treeData$.next(data);
    });
  }

  public getJSON(): Observable<any> {
    return this.http.get(this._jsonURL);
  }
}
