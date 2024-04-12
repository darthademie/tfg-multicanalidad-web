import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"bbdd-multicanalidad","appId":"1:632604922699:web:56c5d5c55c2436cb5a4ece","databaseURL":"https://bbdd-multicanalidad-default-rtdb.europe-west1.firebasedatabase.app","storageBucket":"bbdd-multicanalidad.appspot.com","apiKey":"AIzaSyDmXf1E4k5Hf5XbtxSbbo5reZB7taGUtbw","authDomain":"bbdd-multicanalidad.firebaseapp.com","messagingSenderId":"632604922699","measurementId":"G-5052ZK4VYZ"}))), importProvidersFrom(provideAuth(() => getAuth()))]
};
