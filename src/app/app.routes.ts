import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MisPedidosComponent } from './components/mis-pedidos/mis-pedidos.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { DetallesPedidoComponent } from './components/detalles-pedido/detalles-pedido.component';
import { config } from './models/page-config';

export const routes: Routes = [{ path: '', component: AppComponent },
{ path: config.login.route, component: LoginComponent },
{ path: config.mispedidos.route, component: MisPedidosComponent },
{ path: config.detallespedido.route, component: DetallesPedidoComponent}];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}