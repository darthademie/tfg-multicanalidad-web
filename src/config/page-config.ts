import { PagesConfig } from "../app/models/pages-config.model";

export let config: PagesConfig = {
    login: {
		  name: 'login',
		  route: 'login'
    },
    mispedidos: {
      name: 'mispedidos',
		  route: 'mispedidos'
    },
    detallespedido: {
      name: 'detallesPedido',
		  route: 'detallesPedido'
    }
}