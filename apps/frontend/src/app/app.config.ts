import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { routes } from './app.routes';
import { habitsFeature } from './habits/store/habit.reducer';
import { createHabitEffect, loadHabitsEffect, syncLoadHabitsEffect } from './habits/store/habit.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ [habitsFeature.name]: habitsFeature.reducer }),
    provideEffects({ loadHabitsEffect, createHabitEffect, syncLoadHabitsEffect }),
  ]
};
