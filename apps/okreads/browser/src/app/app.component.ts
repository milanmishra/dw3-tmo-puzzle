import { Component } from '@angular/core';
import { okReadsConstant } from '@tmo/shared/models';

@Component({
  selector: 'tmo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  appConstants = okReadsConstant;
}
