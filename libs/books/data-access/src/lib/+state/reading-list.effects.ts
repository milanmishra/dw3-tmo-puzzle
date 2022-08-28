import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  catchError,
  concatMap,
  exhaustMap,
  filter,
  map,
  switchMap
} from 'rxjs/operators';
import { ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { okReadsConstant } from '@tmo/shared/models';
import { MatSnackBar } from '@angular/material/snack-bar';

const {
  API: { READING_LIST_API },
  SNACKBAR_CONSTANTS: {
    UNDO,
    BOOK_ADDED_TEXT,
    ADD,
    REMOVE,
    BOOK_ADDED_CLASS,
    BOOK_REMOVED_TEXT,
    BOOK_REMOVED_CLASS,
    DURATION
  }
} = okReadsConstant;
@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>(`${READING_LIST_API}`).pipe(
          map((data) =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError((error) =>
            of(ReadingListActions.loadReadingListError({ error }))
          )
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book, showSnackBar }) => {
        const addedBook = {
          ...book,
          isAdded: true
        };
        return this.http.post(`${READING_LIST_API}`, addedBook).pipe(
          map(() =>
            ReadingListActions.confirmedAddToReadingList({
              book: addedBook,
              showSnackBar
            })
          ),
          catchError((error) =>
            of(ReadingListActions.failedAddToReadingList({ error }))
          )
        );
      })
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item, showSnackBar }) =>
        this.http.delete(`${READING_LIST_API}/${item.bookId}`).pipe(
          map(() =>
            ReadingListActions.confirmedRemoveFromReadingList({
              item,
              showSnackBar
            })
          ),
          catchError((error) =>
            of(ReadingListActions.failedRemoveFromReadingList({ error }))
          )
        )
      )
    )
  );

  undoAddBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.confirmedAddToReadingList),
      filter((action) => action.showSnackBar),
      map((action) =>
        ReadingListActions.showSnackBar({
          actionType: ADD,
          item: { bookId: action.book.id, ...action.book }
        })
      )
    )
  );

  undoRemoveBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.confirmedRemoveFromReadingList),
      filter((action) => action.showSnackBar),
      map((action) =>
        ReadingListActions.showSnackBar({
          actionType: REMOVE,
          item: action.item
        })
      )
    )
  );

  openSnackBar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.showSnackBar),
      switchMap((action) => {
        const title = action.item.title;
        const { actionType, item } = action;
        return this.snackBar
          .open(
            actionType === ADD
              ? `${title} - ${BOOK_ADDED_TEXT}`
              : `${title} - ${BOOK_REMOVED_TEXT}`,
            UNDO,
            {
              duration: DURATION,
              panelClass:
                actionType === ADD ? BOOK_ADDED_CLASS : BOOK_REMOVED_CLASS
            }
          )
          .onAction()
          .pipe(
            map(() =>
              actionType === ADD
                ? ReadingListActions.removeFromReadingList({
                    item,
                    showSnackBar: false
                  })
                : ReadingListActions.addToReadingList({
                    book: { id: item.bookId, ...item },
                    showSnackBar: false
                  })
            )
          );
      })
    )
  );

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}
}
