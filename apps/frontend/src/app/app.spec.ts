import { TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { App } from './app';
import { habitsFeature } from './habits/store/habit.reducer';
import { createHabitEffect, loadHabitsEffect } from './habits/store/habit.effects';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideStore({ [habitsFeature.name]: habitsFeature.reducer }),
        provideEffects({ loadHabitsEffect, createHabitEffect }),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render both views', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Habit Tracker (NgRx)');
    expect(compiled.textContent).toContain('Habit Tracker (Signals)');
  });
});
