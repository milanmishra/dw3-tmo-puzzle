import { initialState, reducer, State } from './books.reducer';
import * as BooksActions from './books.actions';
import { createBook } from '@tmo/shared/testing';

describe('Books Reducer', () => {
  describe('valid Books actions', () => {
    it('searchBooksSuccess should return set of list of known Books', () => {
      const books = [createBook('A'), createBook('B'), createBook('C')];
      const action = BooksActions.searchBooksSuccess({ books });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(3);
    });

    it('searchBooksFailure should return error', () => {
      const error = 'Something went wrong!';
      const action = BooksActions.searchBooksFailure({ error });

      const result: State = reducer(initialState, action);

      expect(result.error).toBe(error);
    });

    it('clearSearch should return the initial state', () => {
      const action = BooksActions.clearSearch();

      const result: State = reducer(initialState, action);

      expect(result.searchTerm).toBe('');
      expect(result.loaded).toBe(false);
      expect(result.error).toBe(null);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
