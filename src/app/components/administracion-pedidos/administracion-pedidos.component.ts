import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ref, onValue, push, update } from 'firebase/database'; // Cambiamos 'set' por 'update' global
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from '../../../environments/environment';
import { config } from '../../../config/page-config';

import { HorizontalMenuComponent } from '../../common/horizontal-menu/horizontal-menu.component';
import { LogoutButtonComponent } from '../../common/logout-button/logout-button.component';
import { Pedido } from '../../models/usuario-firebase.model';
import { UserService } from '../../shared/services/user.service'; 

interface PedidoGlobal extends Pedido {
  idPedido: string;
  uidUsuario: string;
  identificadorUsuario: string;
}

@Component({
  selector: 'app-administracion-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule, HorizontalMenuComponent, LogoutButtonComponent],
  templateUrl: './administracion-pedidos.component.html',
  styleUrl: './administracion-pedidos.component.scss'
})
export class AdministracionPedidosComponent implements OnInit {
  
  pedidosGlobales: PedidoGlobal[] = [];
  mostrarFormulario: boolean = false;
  
  correoDestino: string = '';
  nuevoDispositivo: string = '';
  mensajeEstado: string = '';
  procesando: boolean = false;

  audioButtonDetalles = new Audio("/assets/sounds/buttonVerDetalles.mp3");

  constructor(
    private router: Router,
    private userService: UserService 
  ) {}

  ngOnInit(): void {
    const tecnicoUid = this.userService.getUser()?.uid;
    
    if (tecnicoUid) {
      this.audioButtonDetalles.load();
      
      const usuariosRef = ref(db, `usuarios`);
      onValue(usuariosRef, (snapshot) => {
        const usuarios = snapshot.val();
        this.pedidosGlobales = []; 
        
        if (usuarios) {
          for (const [uid, userData] of Object.entries<any>(usuarios)) {
            
            // NUEVO FILTRO: Comprobamos la propiedad del usuario a nivel raíz
            if (userData.tecnico_asignado === tecnicoUid && userData.pedidos) {
              
              for (const [idPedido, pedido] of Object.entries<any>(userData.pedidos)) {
                this.pedidosGlobales.push({
                  ...pedido,
                  idPedido: idPedido,
                  uidUsuario: uid,
                  identificadorUsuario: userData.correo || userData.nombre + ' ' + userData.apellidos || 'Usuario Desconocido'
                });
              }
              
            }
          }
        }
      });
    }
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.mensajeEstado = '';
  }

  async asignarPedido(): Promise<void> {
    const tecnicoUid = this.userService.getUser()?.uid;
    
    if (!this.correoDestino || !this.nuevoDispositivo || !tecnicoUid) return;

    this.procesando = true;
    this.mensajeEstado = 'Buscando usuario en Firebase Auth...';
    
    const functions = getFunctions();
    const obtenerUidFn = httpsCallable(functions, 'obtenerUidPorCorreo');

    try {
      const resultado = await obtenerUidFn({ email: this.correoDestino });
      const uidDestino = (resultado.data as any).uid;
      
      this.mensajeEstado = 'Usuario validado. Registrando asignación y pedido...';

      // 1. Generar un ID único para el nuevo pedido antes de escribir
      const nuevoPedidoId = push(ref(db, `usuarios/${uidDestino}/pedidos`)).key;

      // 2. Preparar el objeto multipropiedad (Escritura atómica)
      const updates: any = {};
      
      // Inyectar el nuevo pedido
      updates[`usuarios/${uidDestino}/pedidos/${nuevoPedidoId}`] = {
        nombre: this.nuevoDispositivo,
        descripcion: "Pedido manual creado desde el panel técnico",
        estado: [
          { codEstado: 2, descripcion: "Pedido anotado en empresa de paquetería" },
          { codEstado: 0, descripcion: "" },
          { codEstado: 0, descripcion: "" },
          { codEstado: 0, descripcion: "" },
          { codEstado: 0, descripcion: "" }
        ],
        asignado_por: tecnicoUid // Mantenemos esta traza en el pedido por seguridad
      };
      
      // Sobreescribir el técnico asignado en el perfil raíz del usuario
      updates[`usuarios/${uidDestino}/tecnico_asignado`] = tecnicoUid;

      // 3. Ejecutar la actualización global en la base de datos
      await update(ref(db), updates);

      this.mensajeEstado = '✅ Pedido y técnico asignados correctamente.';
      this.correoDestino = '';
      this.nuevoDispositivo = '';
      
      setTimeout(() => this.toggleFormulario(), 2000);

    } catch (error: any) {
      if (error.code === 'functions/not-found') {
        this.mensajeEstado = '❌ No existe ningún usuario con ese correo.';
      } else {
        this.mensajeEstado = `❌ Error: ${error.message}`;
      }
    } finally {
      this.procesando = false;
    }
  }

  verDetalles(id_pedido: string, id_usuario: string): void {
    this.audioButtonDetalles.play();
    this.router.navigate([config.detalles_pedido.name], { queryParams: { id_pedido: id_pedido, id_usuario: id_usuario} });
  }
}