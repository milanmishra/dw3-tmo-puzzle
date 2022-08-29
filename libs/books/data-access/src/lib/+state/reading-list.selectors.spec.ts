import { initialState, readingListAdapter } from './reading-list.reducer';
import {
  booksAdapter,
  initialState as booksInitialState
} from './books.reducer';
import * as ToReadSelectors from './reading-list.selectors';
import { createBook, createReadingListItem } from '@tmo/shared/testing';

describe('Reading List Selectors', () => {
  let state;

  beforeEach(() => {
    state = {
      books: booksAdapter.addMany(
        [createBook('A'), createBook('B'), createBook('C')],
        {
          ...booksInitialState,
          error: 'Unknown error',
          loaded: true,
          finished: false
        }
      ),
      readingList: readingListAdapter.addMany(
        [
          createReadingListItem('A'),
          createReadingListItem('B'),
          createReadingListItem('C')
        ],
        {
          ...initialState,
          error: 'Unknown error',
          loaded: true,
          finished: false
        }
      )
    };
  });

    it('getAllBooks() should return list of all Books', () => {
      const results = ToReadSelectors.getAllBooks(state);

      expect(results.length).toBe(3);
    });

    it('getReadingList() should return the list of Books added to the reading list', () => {
      const results = ToReadSelectors.getReadingList(state);

      expect(results.length).toBe(3);
      expect(results.map(x => x.bookId)).toEqual(['A', 'B', 'C']);
    });

    it("getTotalUnread() should return the current 'loaded' status", () => {
      const result = ToReadSelectors.getTotalUnread(state);

      expect(result).toBe(3);
    });

    it('should return the list of Books with finished property as false when getAllBooks() gets invoked', () => {
      const results = ToReadSelectors.getAllBooks(state)

      expect(results[0].finished).toBeFalsy();
    })
  });
