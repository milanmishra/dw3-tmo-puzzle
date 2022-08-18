import { async, TestBed } from '@angular/core/testing';
import { BooksFeatureModule } from './books-feature.module';

describe('BooksFeatureModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(BooksFeatureModule).toBeDefined();
  });
});
