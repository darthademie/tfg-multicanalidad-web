import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HorizontalMenuComponent } from '../../common/horizontal-menu/horizontal-menu.component';

@Component({
  selector: 'app-detalles-pedido',
  standalone: true,
  imports: [CommonModule, HorizontalMenuComponent],
  templateUrl: './detalles-pedido.component.html',
  styleUrl: './detalles-pedido.component.scss'
})
export class DetallesPedidoComponent {

  

}
