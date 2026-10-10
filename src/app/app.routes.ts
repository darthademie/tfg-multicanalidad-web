import { RouterModule, Routes } from '@angular/router';
import { MisPedidosComponent } from './components/mis-pedidos/mis-pedidos.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login-module/login/login.component';
import { DetallesPedidoComponent } from './components/detalles-pedido/detalles-pedido.component';
import { config } from '../config/page-config';
import { RegisterComponent } from './components/login-module/register/register.component';
import { canActivate, customClaims, redirectUnauthorizedTo } from '@angular/fire/auth-guard'
import { map, pipe } from 'rxjs';
import { AdministracionPedidosComponent } from './components/administracion-pedidos/administracion-pedidos.component';


// ---- 1. DEFINIMOS LAS REGLAS DE ACCESO (GUARDS) ----

/**
 * Guardia para Usuarios Normales:
 * - Si no está logueado -> va al Login.
 * - Si es Admin -> lo expulsa hacia el panel de administración.
 * - Si es usuario normal -> le permite pasar (true).
 */
const userOnlyGuard = (): any => pipe(
  customClaims,
  map(claims => {
    // Si es nulo o un array vacío (comportamiento de Firebase sin loguear), al login
    if (!claims || (Array.isArray(claims) && claims.length === 0)) {
        return [config.login.route]; 
    }
    
    // Forzamos el tipado para evitar el error de índice
    const tokenClaims = claims as Record<string, any>;
    return tokenClaims['admin'] === true ? [config.administracion_pedidos.route] : true;
  })
);

/**
 * Guardia para Administradores (Técnicos):
 * - Si no está logueado -> va al Login.
 * - Si es Técnico -> le permite pasar (true).
 * - Si es usuario normal -> lo expulsa hacia sus pedidos.
 */
const adminOnlyGuard = (): any => pipe(
  customClaims,
  map(claims => {
    if (!claims || (Array.isArray(claims) && claims.length === 0)) {
        return [config.login.route];
    }
    
    const tokenClaims = claims as Record<string, any>;
    return tokenClaims['admin'] === true ? true : [config.mis_pedidos.route];
  })
);


// ---- 2. APLICAR LAS REGLAS EN EL ARRAY DE RUTAS ----

export const routes: Routes = [
  { 
    path: '', 
    pathMatch: 'full', 
    redirectTo: config.mis_pedidos.route // Mejor redirigir que duplicar el componente base
  },
  { 
    path: config.login.route, 
    component: LoginComponent 
  },
  { 
    path: config.register.route, 
    component: RegisterComponent
  },
  
  // -- RUTAS EXCLUSIVAS PARA USUARIOS NORMALES --
  { 
    path: config.mis_pedidos.route, 
    component: MisPedidosComponent, 
    ...canActivate(userOnlyGuard) 
  },
  { 
    path: config.detalles_pedido.route, 
    component: DetallesPedidoComponent, 
    ...canActivate(userOnlyGuard)
  },

  // -- RUTAS EXCLUSIVAS PARA ADMINISTRADORES TECNICOS --
  {
    path: config.administracion_pedidos.route,
    component: AdministracionPedidosComponent,
    ...canActivate(adminOnlyGuard)
  }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}