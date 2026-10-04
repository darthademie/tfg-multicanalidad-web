
// Define la estructura interna de cada estado de pedido
export interface EstadoPedido {
  codEstado: number;
  descripcion: string;
}

// Define un pedido individual (los dados dentro de -P37-uX316YKwnz5CJAE, etc.)
export interface Pedido {
  descripcion: string;
  nombre: string;
  estado: EstadoPedido[]; 
}

// Define los datos de usuario completos (los dados dentro de GZS8GkKSUcQ117BI4Co5PbBuxZj1)
export interface UsuarioFirebase {
  nombre: string;
  apellidos: string;
  direccion: string;
  // El uso de Record permite claves dinámicas
  pedidos?: Record<string, Pedido>; 
}