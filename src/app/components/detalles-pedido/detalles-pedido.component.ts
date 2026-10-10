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
import { config } from '../../../config/page-config';
import { adminRole } from '../../shared/constants/defines';

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

  async ngOnInit(): Promise<void> {
    const params: URLSearchParams = new URLSearchParams(this.router.url.split('?')[1]);
    let idPedido: string | null = params.get('id_pedido');
    let idUsuario: string | null = params.get('id_usuario');

    const currentUser = this.userService.getUser();
    const myUid: string | undefined = currentUser?.uid;

  if (myUid && idPedido) {
    // 1. Determinamos qué ruta de Firebase se va a consultar
    // Si viene idUsuario por la URL, miramos el nodo de ese usuario. Si no, miramos el nuestro.
    const targetUid = idUsuario ? idUsuario : myUid;

    // 2. Validación de seguridad en el Frontend (UX)
    if (targetUid !== myUid) {
      // Intenta ver el pedido de otra persona. Comprobamos si es admin desencriptando su token.
      const tokenResult = await currentUser!.getIdTokenResult();
      const isAdmin = tokenResult.claims[adminRole] === true;

      if (!isAdmin) {
        console.error('Acceso denegado: No tienes rol de administrador para ver pedidos ajenos.');
        // Redirigir al usuario de vuelta a sus pedidos
        this.router.navigate([config.mis_pedidos.route]);
        return; 
      }
    }

    // 3. Si es su propio pedido, o es admin validado, lanzamos la petición a RTDB
    const pedidoRef = ref(db, `usuarios/${targetUid}/pedidos/${idPedido}`);
    
    // Añadimos el callback de error para capturar bloqueos de las Reglas de Seguridad
    onValue(pedidoRef, (snapshot) => {
      if (snapshot.exists()) {
        this.detallesPedido = snapshot.val();
        console.log('Detalles de pedido actualizados:', this.detallesPedido);
      } else {
        console.log('El pedido no existe.');
      }
    }, (error) => {
      console.error('Firebase bloqueó la lectura (Reglas de Seguridad):', error.message);
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
