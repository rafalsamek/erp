import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideIcons, provideNgIconsConfig } from '@ng-icons/core';
import {
  heroArrowLeft,
  heroArrowPath,
  heroCheckCircle,
  heroFaceFrown,
  heroFaceSmile,
  heroFolderOpen,
  heroNoSymbol,
  heroPlusCircle,
  heroRocketLaunch,
} from '@ng-icons/heroicons/outline';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNgIconsConfig({ size: '1.5em' }),
    provideIcons({
      heroArrowLeft,
      heroArrowPath,
      heroNoSymbol,
      heroPlusCircle,
      heroCheckCircle,
      heroFolderOpen,
      heroRocketLaunch,
      heroFaceFrown,
      heroFaceSmile,
    }),
  ],
};
