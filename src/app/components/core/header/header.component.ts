import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {
  contentsMenuState: boolean = false;
  subscription: Subscription;
  constructor(private stateService: StateService) {
    this.subscription = this.stateService.isContentsMenuOpen.subscribe(
      (state) => {
        this.contentsMenuState = state;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleMenu(): void {
    this.stateService.isContentsMenuOpen.next(!this.contentsMenuState);
  }
}
