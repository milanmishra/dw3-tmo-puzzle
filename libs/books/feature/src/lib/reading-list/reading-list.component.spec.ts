import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  createReadingListItem,
  SharedTestingModule,
} from '@tmo/shared/testing';

import { ReadingListComponent } from './reading-list.component';
import { BooksFeatureModule } from '@tmo/books/feature';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  getReadingList,
  markBookAsFinished,
  removeFromReadingList
} from '@tmo/books/data-access';
import { okReadsConstant } from '@tmo/shared/models';

describe('ReadingListComponent', () => {
  let component: ReadingListComponent;
  let fixture: ComponentFixture<ReadingListComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, SharedTestingModule],
      providers: [
        provideMockStore({
          initialState: {
            readingList: { entities: [] }
          }
        })
      ]
    }).compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingListComponent);
    component = fixture.componentInstance;
    store.overrideSelector(getReadingList, [
      {
        ...createReadingListItem('testing'),
        isAdded: true
      }
    ]);
    fixture.detectChanges();
    spyOn(store, 'dispatch');
  });

  it('should show the reading list when books are added to the reading list', () => {
    const bookCover = fixture.nativeElement.querySelector(
      '[data-testing="book-cover"]'
    );
    const bookTitle = fixture.nativeElement.querySelector(
      '[data-testing="book-title"]'
    );
    const bookAuthorName = fixture.nativeElement.querySelector(
      '[data-testing="book-author-name"]'
    );

    expect(bookCover).toBeTruthy();
    expect(bookTitle.innerHTML.trim()).toBe('Book testing');
    expect(bookAuthorName.innerHTML.trim()).toBe('Author testing');
  });

  it('should dispatch removeFromReadingList action and remove book from the reading list when remove button is clicked', () => {
    const bookItem = { ...createReadingListItem('testing'), isAdded: true };
    const removeButton = fixture.nativeElement.querySelector(
      '[data-testing="remove-book"]'
    ) as HTMLButtonElement;

    removeButton.click();

    expect(store.dispatch).toHaveBeenCalledWith(
      removeFromReadingList({
        item: bookItem
      })
    );
  });

  it('should show the empty text in the reading list when no books are added to the reading list', () => {
    store.overrideSelector(getReadingList, []);

    store.refreshState();
    fixture.detectChanges();
    const emptyText = fixture.nativeElement.querySelector(
      '[data-testing="empty-text"]'
    );

    expect(emptyText.innerHTML.trim()).toBe(
      okReadsConstant.READING_LIST.EMPTY_LIST_TEXT
    );
  });

  it('should dispatch markedAsFinished action and mark book as finished when the check button is clicked', () => {
    const readingList = { ...createReadingListItem('testing'), isAdded: true };
    const markAsFinishedBtn = fixture.nativeElement.querySelector(
      '[data-testing="mark-as-finished"]'
    );

    markAsFinishedBtn.click();

    expect(store.dispatch).toHaveBeenCalledWith(
      markBookAsFinished({
        item: readingList
      })
    );
  });
});
