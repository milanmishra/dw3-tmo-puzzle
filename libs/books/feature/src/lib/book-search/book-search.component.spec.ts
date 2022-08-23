import {
  async,
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule, createBook } from '@tmo/shared/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  getBooksError,
  searchBooks
} from '@tmo/books/data-access';

describe('BookSearchComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [
        provideMockStore({ initialState: { books: { entities: [] } } })
      ]
    }).compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    store.overrideSelector(getAllBooks, [
      { ...createBook('A'), isAdded: false },
      { ...createBook('B'), isAdded: false }
    ]);
    fixture.detectChanges();
    spyOn(store, 'dispatch');
  });

  it('should show example text section when the user has not searched any book', () => {
    store.overrideSelector(getAllBooks, []);
    store.overrideSelector(getBooksError, null);
    const bookListSection = fixture.nativeElement.querySelector(
      '[data-testing="books-list"]'
    );
    const exampleTextSection = fixture.nativeElement.querySelector(
      '[data-testing="example-text-section"]'
    );

    fixture.detectChanges();

    expect(exampleTextSection).not.toBeNull();
    expect(bookListSection).toBeNull();
  });

  it('should dispatch searchBooks action and search books when search term is provided', fakeAsync(() => {
    const term = component.searchForm.controls['term'];
    term.setValue('javascript');

    fixture.detectChanges();
    tick(500);

    expect(store.dispatch).toHaveBeenCalledWith(
      searchBooks({ term: 'javascript' })
    );
    discardPeriodicTasks();
  }));

  it('should show error text when book search api fails', fakeAsync(() => {
    const term = component.searchForm.controls['term'];
    term.setValue('javascript');

    fixture.detectChanges();
    tick(500);
    store.overrideSelector(getBooksError, 'Something went wrong!');
    store.overrideSelector(getAllBooks, []);

    store.refreshState();
    fixture.detectChanges();

    const errorTextSection = fixture.nativeElement.querySelector(
      '[data-testing="error-text"]'
    );

    expect(errorTextSection).not.toBeNull();
  }));

  it('should dispatch addToReadingList action and add book to the reading list when `Want To Read` button is clicked', () => {
    const bookToRead = { ...createBook('A'), isAdded: false };
    store.overrideSelector(getBooksError, null);
    store.overrideSelector(getAllBooks, [
      { ...bookToRead },
      { ...createBook('B'), isAdded: true }
    ]);

    store.refreshState();
    fixture.detectChanges();
    const addBook = fixture.nativeElement.querySelector(
      '[data-testing="add-book"]'
    );
    addBook.click();

    expect(store.dispatch).toHaveBeenCalledWith(
      addToReadingList({ book: bookToRead })
    );
  });

  it('should display valid author name, publishedDate and description, or alternate text when values are present or empty', () => {
    store.overrideSelector(getAllBooks, [
      {
        ...createBook('Test'),
        isAdded: false
      }
    ]);
    store.overrideSelector(getBooksError, null);
    store.refreshState();
    fixture.detectChanges();

    const authorName = fixture.nativeElement.querySelector(
      '[data-testing="book-author-name"]'
    );
    const publishedDate = fixture.nativeElement.querySelector(
      '[data-testing="book-published-date"]'
    );
    const description = fixture.nativeElement.querySelector(
      '[data-testing="book-description"]'
    );

    expect(authorName.innerHTML.trim()).toBe('Author Test');
    expect(publishedDate.innerHTML.trim()).toBe('01/01/2020');
    expect(description.innerHTML.trim()).toBe('Description not avaliable');
  });

  it('should dispatch clearSearch action when user enters search term and then clears it', fakeAsync(() => {
    const term = component.searchForm.controls['term'];
    term.setValue('javascript');

    fixture.detectChanges();
    tick(500);

    expect(store.dispatch).toHaveBeenCalledWith(
      searchBooks({ term: 'javascript' })
    );
    discardPeriodicTasks();

    term.setValue('');
    fixture.detectChanges();
    tick(500);

    expect(store.dispatch).toHaveBeenCalledWith(clearSearch());
  }));
});
