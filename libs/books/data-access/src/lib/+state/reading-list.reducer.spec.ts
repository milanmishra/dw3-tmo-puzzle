import * as ReadingListActions from './reading-list.actions';
import {
  initialState,
  readingListAdapter,
  reducer,
  State
} from './reading-list.reducer';
import { createBook, createReadingListItem } from '@tmo/shared/testing';

describe('Reading List Reducer', () => {
  describe('valid Reading List actions', () => {
    let state: State;

    beforeEach(() => {
      state = readingListAdapter.setAll(
        [createReadingListItem('A'), createReadingListItem('B')],
        initialState
      );
    });

    it('loadReadingListSuccess should load books from reading list', () => {
      const list = [
        createReadingListItem('A'),
        createReadingListItem('B'),
        createReadingListItem('C')
      ];
      const action = ReadingListActions.loadReadingListSuccess({ list });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toEqual(3);
    });

    it('confirmedAddToReadingList should add books to the reading list', () => {
      const action = ReadingListActions.confirmedAddToReadingList({
        book: createBook('C')
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A', 'B', 'C']);
    });

    it('confirmedRemoveFromReadingList should remove books from the reading list', () => {
      const action = ReadingListActions.confirmedRemoveFromReadingList({
        item: createReadingListItem('B')
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A']);
    });

    it('failedAddToReadingList should update state with error message and undo book addition to the reading list', () => {
      const error = 'Failed to add book to the reading list';
      const action = ReadingListActions.failedAddToReadingList({
        error
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A', 'B']);
      expect(result.error).toEqual(error);
    });

    it('failedRemoveFromReadingList should update state with error message and undo book removal from the reading list', () => {
      const error = 'Failed to remove book from the reading list!';
      const action = ReadingListActions.failedRemoveFromReadingList({
        error
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A', 'B']);
      expect(result.error).toEqual(error);
    });

    it('confirmedMarkBookAsFinished should mark book as finished in the state', () => {
      const bookFinished = {
        ...createReadingListItem('A'),
        finished: true,
        finishedDate: new Date().toISOString()
      };
      const action = ReadingListActions.confirmedMarkBookAsFinished({
        item: bookFinished
      });

      const result: State = reducer(state, action);

      expect(result.entities['A']?.finished).toBeTruthy();
    });

    it('failedMarkAsFinished should not mark book as finished in the state', () => {
      const error = 'Sorry! Something went wrong';
      const action = ReadingListActions.failedMarkBookAsFinished({
        error
      });

      const result: State = reducer(state, action);

      expect(result.error).toEqual(error);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });
});
