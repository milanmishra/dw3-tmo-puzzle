import { createAction, props } from '@ngrx/store';
import { Book, ReadingListItem } from '@tmo/shared/models';

export const init = createAction('[Reading List] Initialize');

export const loadReadingListSuccess = createAction(
  '[Reading List API] Load list success',
  props<{ list: ReadingListItem[] }>()
);
export const loadReadingListError = createAction(
  '[Reading List API] Load list error',
  props<{ error: string }>()
);

export const addToReadingList = createAction(
  '[Reading List API] Add to list',
  props<{ book: Book }>()
);

export const failedAddToReadingList = createAction(
  '[Reading List API] Failed add to list',
  props<{ error: string }>()
);

export const confirmedAddToReadingList = createAction(
  '[Reading List API] Confirmed add to list',
  props<{ book: Book }>()
);

export const removeFromReadingList = createAction(
  '[Reading List API] Remove from list',
  props<{ item: ReadingListItem }>()
);

export const failedRemoveFromReadingList = createAction(
  '[Reading List API] Failed remove from list',
  props<{ error: string }>()
);

export const confirmedRemoveFromReadingList = createAction(
  '[Reading List API] Confirmed remove from list',
  props<{ item: ReadingListItem }>()
);

export const markBookAsFinished = createAction(
  '[Reading List API] Mark book as finished',
  props<{ item: ReadingListItem }>()
);

export const failedMarkBookAsFinished = createAction(
  '[Reading List API] Failed to mark book as finished',
  props<{ error: string }>()
);

export const confirmedMarkBookAsFinished = createAction(
  '[Reading List API] Confirmed mark book as finished',
  props<{ item: ReadingListItem }>()
);