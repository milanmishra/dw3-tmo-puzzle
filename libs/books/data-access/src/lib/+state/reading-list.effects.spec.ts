import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { createReadingListItem, SharedTestingModule } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { okReadsConstant } from '@tmo/shared/models';
import { Action } from '@ngrx/store';

describe('ToReadEffects', () => {
  let actions: Observable<Action>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('should load reading list when api is success', (done) => {
      actions = of(ReadingListActions.init());

      effects.loadReadingList$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne(`${okReadsConstant.API.READING_LIST_API}`).flush([]);
    });
  });

  describe('markBookAsFinished$', () => {
    it('should mark book as finished when confirmedMarkAsFinished action is dispatched', (done) => {
      const updatedData = {
        ...createReadingListItem('test'),
        finished: true,
        finishedDate: '2021-08-12T09:18:15.626Z'
      };

      actions = of(
        ReadingListActions.markBookAsFinished({
          item: updatedData
        })
      );

      effects.markBookAsFinished$.subscribe((action) => {
        action['item'].finishedDate = '2021-08-12T09:18:15.626Z';
        expect(action).toEqual(
          ReadingListActions.confirmedMarkBookAsFinished({
            item: updatedData
          })
        );
        done();
      });
      httpMock
        .expectOne(`/api/reading-list/test/finished`)
        .flush({ ...updatedData });
    });

    it('should not mark book as finished when api fails', (done) => {
      actions = of(
        ReadingListActions.markBookAsFinished({
          item: createReadingListItem('test')
        })
      );

      effects.markBookAsFinished$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.failedMarkBookAsFinished({
            error: 'Sorry! something went wrong'
          })
        );
        done();
      });

      httpMock
        .expectOne(
          `${okReadsConstant.API.READING_LIST_API}/test/${okReadsConstant.FINISHED}`
        )
        .error(new ErrorEvent('HttpErrorResponse'), {
          status: 500,
          statusText: 'Sorry! something went wrong'
        });
    });
  });
});
