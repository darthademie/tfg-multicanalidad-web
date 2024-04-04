import { Component } from '@angular/core';
import { ref, set, onValue } from 'firebase/database'
import { db } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { HorizontalMenuComponent } from '../../common/horizontal-menu/horizontal-menu.component';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, HorizontalMenuComponent],
  templateUrl: './mis-pedidos.component.html',
  styleUrl: './mis-pedidos.component.scss'
})

export class MisPedidosComponent {

  pedidos: any[] = [];

  ngOnInit(): void {
    const pedidosRef = ref(db, 'pedidos');
    onValue(pedidosRef, (snapshot) => {
      this.pedidos = snapshot.val().filter((pedido: null) => pedido !== null);
      console.log('Pedidos actualizados:', this.pedidos);
    });
  }

}
