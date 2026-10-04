import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HorizontalMenuComponent } from '../../common/horizontal-menu/horizontal-menu.component';
import { Router } from '@angular/router';
import { onValue, ref } from 'firebase/database';
import { db } from '../../../environments/environment';
import { CodEstadoPedido } from '../../shared/enum/cod-estado-pedido.enum';
import { EstadoPedido } from '../../shared/enum/estado-pedido.enum';
import { LogoutButtonComponent } from '../../common/logout-button/logout-button.component';
import { UserService } from '../../shared/services/user.service';
import { StringOrNull } from '../../shared/types/types';

@Component({
  selector: 'app-detalles-pedido',
  standalone: true,
  imports: [CommonModule, HorizontalMenuComponent, LogoutButtonComponent],
  templateUrl: './detalles-pedido.component.html',
  styleUrl: './detalles-pedido.component.scss'
})
export class DetallesPedidoComponent {

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  estadoPedido = EstadoPedido;
  detallesPedido: any = {};

  ngOnInit(): void {
    const params: URLSearchParams = new URLSearchParams(this.router.url.split('?')[1]);
    let idPedido: StringOrNull = params.get('id');
    const uid: string | undefined = this.userService.getUser()?.uid;
    if (uid && idPedido) {
        const pedidoRef = ref(db, `usuarios/${uid}/pedidos/${idPedido}`);
        onValue(pedidoRef, (snapshot) => {
          this.detallesPedido = snapshot.val();
          console.log('Detalles de pedido actualizados:', this.detallesPedido);
      });
    }
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
