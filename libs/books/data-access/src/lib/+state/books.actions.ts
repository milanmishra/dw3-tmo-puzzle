import { createAction, props } from '@ngrx/store';
import { Book } from '@tmo/shared/models';

export const searchBooks = createAction(
  '[Books Search API] Search Books',
  props<{ term: string }>()
);

export const searchBooksSuccess = createAction(
  '[Books Search API] Search Books Success',
  props<{ books: Book[] }>()
);

export const searchBooksFailure = createAction(
  '[Books Search API] Search Books Failure',
  props<{ error: any }>()
);

export const clearSearch = createAction('[Books Search API] Clear Search');
