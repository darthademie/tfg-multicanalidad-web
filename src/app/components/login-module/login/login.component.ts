import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
// NUEVO: Importamos Validators
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';
import { config } from '../../../../config/page-config';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  title = 'tfg-multicanalidad-web';
  formLogin: FormGroup;
  
  // Variable para controlar errores con el login
  loginError: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    // NUEVO: Añadimos validadores a los controles
    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    // Doble comprobación: si llegan a hackear el HTML y habilitar el botón, el TS lo frena
    if (this.formLogin.invalid) return; 

    // Ocultamos el error de intentos anteriores
    this.loginError = false; 

    this.userService.login(this.formLogin.value)
      .then(response => {
        console.log(response);
        this.router.navigate([config.mis_pedidos.route]);
      })
      .catch(error => {
        console.error(error);
        // Si hay error en la autenticación, mostramos el mensaje rojo
        this.loginError = true; 
      });
  }

  onClick() {
    this.userService.loginWithGoogle()
      .then((response: any) => {
        console.log(response);
        this.router.navigate([config.mis_pedidos.route]);
      })
      .catch((error: any) => console.log(error))
  }
}