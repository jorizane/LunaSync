import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HabitSyncService {
  private readonly habitCreatedSource = new Subject<void>();
  readonly habitCreated$ = this.habitCreatedSource.asObservable();

  notifyHabitCreated(): void {
    this.habitCreatedSource.next();
  }
}
