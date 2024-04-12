import { Component } from '@angular/core';
import { config } from '../../../config/page-config';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
import { StringOrUndefined } from '../../shared/types/types';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  imports: [],
  templateUrl: './logout-button.component.html',
  styleUrl: './logout-button.component.scss'
})
export class LogoutButtonComponent {

  emailName: StringOrUndefined = "";

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

}
