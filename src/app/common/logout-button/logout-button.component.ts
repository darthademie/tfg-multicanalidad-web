import { Component, Input } from '@angular/core';
import { config } from '../../../config/page-config';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
import { StringOrUndefined } from '../../shared/types/types';
import { getAuth, deleteUser } from 'firebase/auth';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  imports: [],
  templateUrl: './logout-button.component.html',
  styleUrl: './logout-button.component.scss'
})
export class LogoutButtonComponent {

  @Input() showDeleteAccount: boolean = false;
  emailName: StringOrUndefined = "";
  
  // Variable de estado para el modal
  mostrarModalBorrado: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.emailName = this.userService.getUser()?.email?.split('@')[0];
  }

  onClick() {
    this.userService.logout()
      .then(() => {
        this.router.navigate([config.login.route]);
      })
      .catch((error: any) => console.log(error));
  }

  // Funciones de control del modal
  abrirModal(): void {
    this.mostrarModalBorrado = true;
  }

  cerrarModal(): void {
    this.mostrarModalBorrado = false;
  }

  // Lógica real que se ejecuta al confirmar en el modal
  async confirmarBorrado(): Promise<void> {
    this.mostrarModalBorrado = false; // Cerramos el modal inmediatamente
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        await deleteUser(user);
        console.log('Cuenta borrada con éxito de Firebase Auth');
        this.router.navigate([config.login.route]); 
      } catch (error: any) {
        console.error('Error al borrar la cuenta:', error);
        
        if (error.code === 'auth/requires-recent-login') {
          alert("Por motivos de seguridad, necesitas volver a iniciar sesión antes de poder borrar tu cuenta. Cierra sesión y vuelve a entrar.");
        } else {
          alert("Hubo un error al intentar borrar la cuenta. Inténtalo de nuevo más tarde.");
        }
      }
    }
  }
}