import { TestBed } from '@angular/core/testing';

import { TreeDNDService } from './treeDND.service';

describe('TreeDNDService', () => {
  let service: TreeDNDService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeDNDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
