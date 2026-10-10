import { PagesConfig } from "../app/models/pages-config.model";

export let config: PagesConfig = {
    login: {
		  name: 'login',
		  route: 'login'
    },
    register: {
		  name: 'register',
		  route: 'register'
    },
    mis_pedidos: {
      name: 'misPedidos',
		  route: 'mis_pedidos'
    },
    detalles_pedido: {
      name: 'detallesPedido',
		  route: 'detallesPedido'
    },
    administracion_pedidos: {
      name: 'administracionPedidos',
		  route: 'administracion_pedidos'
    }
}