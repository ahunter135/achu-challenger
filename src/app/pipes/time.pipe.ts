import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: number): string {
    if (!value) return 0 + " min"
    if (value > 0 && value / 60 < 1) {
      return value + ' min';
    } else {
      let hr = Math.floor(value / 60);
      let min = Math.round(((value / 60) - hr) * 60);
      return hr + ' hr ' + min + " min";
    }
  }

}
