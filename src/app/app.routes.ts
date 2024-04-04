import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MisPedidosComponent } from './mis-pedidos/mis-pedidos.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [{ path: '', component: AppComponent },
{ path: 'login', component: LoginComponent },
{ path: 'mispedidos', component: MisPedidosComponent }];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}

  // TODO: Hacer pages.config.ts para metérselo al routes y hacer más fácil la navegación
  // mediante el método router.navigate(...);
