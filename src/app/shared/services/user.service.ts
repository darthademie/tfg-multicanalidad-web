import { Injectable } from '@angular/core';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { Database, ref, set } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private auth: Auth,
    private db: Database // NUEVO: Inyectamos el servicio de la base de datos
  ) { }

  // Transformamos el método a async para asegurar que ambos pasos terminen correctamente
  async register({ email, password, nombre, apellidos }: any) {
    
    // 1. Creamos la identidad y las credenciales en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const uid = userCredential.user.uid;

    // 2. Creamos el nodo en la Realtime Database con el UID que nos acaba de dar Auth
    const userRef = ref(this.db, `usuarios/${uid}`);
    await set(userRef, {
      nombre: nombre,
      apellidos: apellidos,
      email: email
    });

    // Retornamos el credencial
    return userCredential;
  }

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  
  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logout() {
    return signOut(this.auth);
  }

  getUser() {
    return this.auth.currentUser;
  }
  
}