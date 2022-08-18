import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  getBooksError,
  searchBooks,
} from '@tmo/books/data-access';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Book, okReadsConstant } from '@tmo/shared/models';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent {
  books$ = this.store.select(getAllBooks);
  getBooksError$ = this.store.select(getBooksError);
  bookSearchConstants = okReadsConstant;
  searchForm = this.fb.group({
    term: new FormControl(null, [Validators.required])
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder
  ) {}

  addBookToReadingList(book: Book): void {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample(): void {
    this.searchForm.controls.term.setValue(
      this.bookSearchConstants.BOOK_SEARCH.JAVASCRIPT
    );
    this.searchBooks();
  }

  searchBooks(): void {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchForm.value.term }));
    }
  }

  resetSearch(): void {
    this.searchForm.controls.term.setValue(null);
    this.store.dispatch(clearSearch());
  }
}
