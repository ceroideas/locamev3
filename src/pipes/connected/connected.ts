import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the ConnectedPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'connected',
})
export class ConnectedPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string) {
    return (new Date(value) > new Date());
  }
}
