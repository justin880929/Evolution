import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'courseProduct'
})
export class CourseProductPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
