import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HorizontalMenuComponent } from '../../common/horizontal-menu/horizontal-menu.component';
import { Router } from '@angular/router';
import { onValue, ref } from 'firebase/database';
import { db } from '../../../environments/environment';
import { CodEstadoPedido } from '../../shared/enum/cod-estado-pedido.enum';
import { EstadoPedido } from '../../shared/enum/estado-pedido.enum';

@Component({
  selector: 'app-detalles-pedido',
  standalone: true,
  imports: [CommonModule, HorizontalMenuComponent],
  templateUrl: './detalles-pedido.component.html',
  styleUrl: './detalles-pedido.component.scss'
})
export class DetallesPedidoComponent {

  constructor(
    private router: Router
  ) {}

  estadoPedido = EstadoPedido;
  detallesPedido: any = {};

  ngOnInit(): void {
    const params: URLSearchParams = new URLSearchParams(this.router.url.split('?')[1]);
    const id = params.get('id');
    const pedidosRef = ref(db, 'pedidos/' + id);
    onValue(pedidosRef, (snapshot) => {
      this.detallesPedido = snapshot.val();
      console.log('Detalles de pedido actualizados:', this.detallesPedido);
    });
  }

  isEstadoActivo(estadoPedido: number): boolean {
    const codEstado = this.detallesPedido.estado[estadoPedido].codEstado;
    return codEstado === CodEstadoPedido.Activo;
  }

  isEstadoCompletado(estadoPedido: number): boolean {
    const codEstado = this.detallesPedido.estado[estadoPedido].codEstado;
    return codEstado === CodEstadoPedido.Completado;
  }

}
