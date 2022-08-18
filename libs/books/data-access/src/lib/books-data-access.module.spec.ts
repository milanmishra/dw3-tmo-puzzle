import { async, TestBed } from '@angular/core/testing';
import { BooksDataAccessModule } from './books-data-access.module';

describe('BooksDataAccessModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksDataAccessModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(BooksDataAccessModule).toBeDefined();
  });
});
