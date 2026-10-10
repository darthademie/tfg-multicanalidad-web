import { Component } from '@angular/core';
import { ref, onValue } from 'firebase/database'
import { db } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { HorizontalMenuComponent } from '../../common/horizontal-menu/horizontal-menu.component';
import { Router } from '@angular/router';
import { config } from '../../../config/page-config';
import { LogoutButtonComponent } from '../../common/logout-button/logout-button.component';
import { UserService } from '../../shared/services/user.service';
import { Pedido } from '../../models/usuario-firebase.model';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, HorizontalMenuComponent, LogoutButtonComponent],
  templateUrl: './mis-pedidos.component.html',
  styleUrl: './mis-pedidos.component.scss'
})

export class MisPedidosComponent {

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  pedidos: Record<string, Pedido>;

  audioButtonDetalles = new Audio("/assets/sounds/buttonVerDetalles.mp3");

  ngOnInit(): void {
    const uid: string | undefined = this.userService.getUser()?.uid;
    if (uid) {
      const pedidosRef = ref(db, `usuarios/${uid}/pedidos`);
      onValue(pedidosRef, (snapshot) => {
      this.pedidos = snapshot.val() as Record<string, Pedido>;
      console.log('Pedidos actualizados:', this.pedidos);
    });
    this.audioButtonDetalles.load();
    }
  }

  verDetalles(id_pedido: string): void {
    this.audioButtonDetalles.play();
    this.router.navigate([config.detalles_pedido.name], { queryParams: { id_pedido: id_pedido } });
  }

}
