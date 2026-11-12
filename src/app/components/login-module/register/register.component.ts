import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';
import { config } from '../../../../config/page-config';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, OnDestroy {

  formReg: FormGroup;

  constructor(
    private userService: UserService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.formReg = new FormGroup({
      nombre: new FormControl('', Validators.required),
      apellidos: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    
  }

  onSubmit() {
    if (this.formReg.valid) {
      this.userService.register(this.formReg.value)
        .then(response => {
          console.log('Registro exitoso:', response);
          this.router.navigate([config.mis_pedidos.route]);
        })
        .catch(error => console.error('Error en el registro:', error));
    } else {
      console.log('El formulario no es válido');
      this.formReg.markAllAsTouched();
    }
  }

}