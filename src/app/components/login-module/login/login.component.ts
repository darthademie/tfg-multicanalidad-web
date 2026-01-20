import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  constructor(
    private userService: UserService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.formLogin = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    })
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
  
  }

  onSubmit() {
    this.userService.login(this.formLogin.value)
      .then(response => {
        console.log(response);
        this.router.navigate([config.mispedidos.route]);
      })
      .catch(error => console.log(error));
  }

  onClick() {
    this.userService.loginWithGoogle()
      .then((response: any) => {
        console.log(response);
        this.router.navigate([config.mispedidos.route]);
      })
      .catch((error: any) => console.log(error))
  }

}
