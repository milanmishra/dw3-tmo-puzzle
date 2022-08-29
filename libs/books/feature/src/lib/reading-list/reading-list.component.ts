import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  getReadingList,
  markBookAsFinished,
  removeFromReadingList
} from '@tmo/books/data-access';
import { okReadsConstant, ReadingListItem } from '@tmo/shared/models';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent {
  readingList$ = this.store.select(
    getReadingList
  );
  readingListConstants = okReadsConstant;
  constructor(private readonly store: Store) {}

  removeFromReadingList(item: ReadingListItem): void {
    this.store.dispatch(removeFromReadingList({ item }));
  }

  markBookAsFinished(item: ReadingListItem): void {
    this.store.dispatch(
      markBookAsFinished({
        item
      })
    );
  }
}
