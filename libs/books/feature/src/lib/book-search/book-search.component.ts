import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  getBooksError,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book, okReadsConstant } from '@tmo/shared/models';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit, OnDestroy {
  books$ = this.store.select(getAllBooks);
  getBooksError$ = this.store.select(getBooksError);
  bookSearchConstants = okReadsConstant;
  private destroyed$ = new Subject<boolean>();

  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.searchForm.controls['term'].valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((searchTerm) => {
        if (searchTerm) {
          this.store.dispatch(searchBooks({ term: searchTerm }));
        } else {
          this.store.dispatch(clearSearch());
        }
      });
  }

  addBookToReadingList(book: Book): void {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample(): void {
    this.searchForm.controls.term.setValue(
      this.bookSearchConstants.BOOK_SEARCH.JAVASCRIPT
    );
  }

  searchBooks(): void {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchForm.value.term }));
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
