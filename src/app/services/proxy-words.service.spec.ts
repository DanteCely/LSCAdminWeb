import { TestBed, inject } from '@angular/core/testing';

import { ProxyWordsService } from './proxy-words.service';

describe('ProxyWordsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProxyWordsService]
    });
  });

  it('should be created', inject([ProxyWordsService], (service: ProxyWordsService) => {
    expect(service).toBeTruthy();
  }));
});
