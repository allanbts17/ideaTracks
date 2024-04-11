import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private minutes: number = 0;
  private seconds: number = 0;
  stopwatchString: string = '00:00';
  private timerSubscription: Subscription | undefined;

  constructor() { }

  startStopwatch() {
    if (!this.timerSubscription) {
      this.timerSubscription = interval(1000).pipe(
        map(() => {
          this.seconds++;
          if (this.seconds === 60) {
            this.seconds = 0;
            this.minutes++;
          }
          return `${this.addZero(this.minutes)}:${this.addZero(this.seconds)}`;
        })
      ).subscribe(stopwatchString => {
        this.stopwatchString = stopwatchString;
      });
    }
  }

  stopStopwatch() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined;
    }
  }

  resetStopwatch() {
    this.minutes = 0;
    this.seconds = 0;
    this.stopwatchString = '00:00';
  }

  private addZero(value: number): string {
    return value < 10 ? '0' + value : '' + value;
  }

}
