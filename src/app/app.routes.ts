import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MisPedidosComponent } from './components/mis-pedidos/mis-pedidos.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login-module/login/login.component';
import { DetallesPedidoComponent } from './components/detalles-pedido/detalles-pedido.component';
import { config } from '../config/page-config';
import { RegisterComponent } from './components/login-module/register/register.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard'


export const routes: Routes = [
{ path: '', pathMatch: 'full', component: MisPedidosComponent, ...canActivate(() => redirectUnauthorizedTo([config.login.route])) },
{ path: config.login.route, component: LoginComponent },
{ path: config.register.route, component: RegisterComponent},
{ path: config.mispedidos.route, component: MisPedidosComponent, ...canActivate(() => redirectUnauthorizedTo([config.login.route])) },
{ path: config.detallespedido.route, component: DetallesPedidoComponent, ...canActivate(() => redirectUnauthorizedTo([config.login.route]))}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}