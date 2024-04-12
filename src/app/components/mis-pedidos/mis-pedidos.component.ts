import { Component } from '@angular/core';
import { ref, onValue } from 'firebase/database'
import { db } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { HorizontalMenuComponent } from '../../common/horizontal-menu/horizontal-menu.component';
import { Router } from '@angular/router';
import { config } from '../../../config/page-config';
import { LogoutButtonComponent } from '../../common/logout-button/logout-button.component';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, HorizontalMenuComponent, LogoutButtonComponent],
  templateUrl: './mis-pedidos.component.html',
  styleUrl: './mis-pedidos.component.scss'
})

export class MisPedidosComponent {

  constructor(
    private router: Router
  ) {}

  pedidos: any[] = [];

  audioButtonDetalles = new Audio("/assets/sounds/buttonVerDetalles.mp3");

  ngOnInit(): void {
    const pedidoRef = ref(db, 'pedidos');
    onValue(pedidoRef, (snapshot) => {
      this.pedidos = snapshot.val().filter((pedido: null) => pedido !== null);
      console.log('Pedidos actualizados:', this.pedidos);
    });
    this.audioButtonDetalles.load();
  }

  verDetalles(Id: number): void {
    this.audioButtonDetalles.play();
    this.router.navigate([config.detallespedido.name], { queryParams: { id: Id } });
  }

}
