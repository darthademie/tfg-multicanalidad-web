import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ref, onValue, push, update } from 'firebase/database'; 
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

interface Dispositivo {
  id: string;
  nombre: string;
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
  dispositivosDisponibles: Dispositivo[] = []; 
  mostrarFormulario: boolean = false;

  correoDestino: string = '';
  idDispositivo: string = '';
  opcionesPersonalizacion: string = ''; 
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

      // Cargar la lista de dispositivos
      const dispositivosRef = ref(db, 'dispositivos');
      onValue(dispositivosRef, (snapshot) => {
        const data = snapshot.val();
        this.dispositivosDisponibles = [];
        if (data) {
          for (const [key, value] of Object.entries(data)) {
            this.dispositivosDisponibles.push({ id: key, nombre: value as string });
          }
        }
      });

      // Cargar los pedidos globales filtrados por el técnico
      const usuariosRef = ref(db, `usuarios`);
      onValue(usuariosRef, (snapshot) => {
        const usuarios = snapshot.val();
        this.pedidosGlobales = []; 

        if (usuarios) {
          for (const [uid, userData] of Object.entries<any>(usuarios)) {
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

    if (!this.correoDestino || !this.idDispositivo || !tecnicoUid) return;

    this.procesando = true;
    this.mensajeEstado = 'Buscando usuario en Firebase Auth...';

    const functions = getFunctions();
    const obtenerUidFn = httpsCallable(functions, 'obtenerUidPorCorreo');

    try {
      const resultado = await obtenerUidFn({ email: this.correoDestino });
      const uidDestino = (resultado.data as any).uid;

      this.mensajeEstado = 'Usuario validado. Registrando asignación y pedido...';

      // 1. Obtener el nombre real del dispositivo a partir de su ID
      const dispSeleccionado = this.dispositivosDisponibles.find(d => d.id === this.idDispositivo);
      const nombreRealDispositivo = dispSeleccionado ? dispSeleccionado.nombre : 'Dispositivo Desconocido';

      // 2. Generar IDs únicos para el pedido y para la cola de procesamiento
      const nuevoPedidoId = push(ref(db, `usuarios/${uidDestino}/pedidos`)).key;
      const idColaProcesamiento = push(ref(db, `cola_procesamiento/ofertas`)).key;
      
      const updates: any = {};

      let descripcionFinal = "Pedido manual creado desde el panel técnico";
      if (this.opcionesPersonalizacion && this.opcionesPersonalizacion.trim() !== '') {
        descripcionFinal += ` - Opciones de personalización: ${this.opcionesPersonalizacion}`;
      }

      // 3A. Inyectar el nuevo pedido en el perfil del usuario (con su nombre bonito)
      updates[`usuarios/${uidDestino}/pedidos/${nuevoPedidoId}`] = {
        nombre: nombreRealDispositivo, 
        descripcion: descripcionFinal,
        estado: [
          { codEstado: 2, descripcion: "Pedido anotado en empresa de paquetería" },
          { codEstado: 0, descripcion: "" },
          { codEstado: 0, descripcion: "" },
          { codEstado: 0, descripcion: "" },
          { codEstado: 0, descripcion: "" }
        ],
        asignado_por: tecnicoUid 
      };

      // 3B. Sobreescribir el técnico asignado en el perfil raíz
      updates[`usuarios/${uidDestino}/tecnico_asignado`] = tecnicoUid;

      // 3C. Enviar la tarea a la cola de procesamiento (con la clave cruda)
      updates[`cola_procesamiento/ofertas/${idColaProcesamiento}`] = {
        uid_fb: uidDestino,
        origin: "web",
        nombre: this.idDispositivo
      };

      // 4. Ejecutar todas las actualizaciones de forma atómica
      await update(ref(db), updates);

      this.mensajeEstado = '✅ Pedido y técnico asignados correctamente.';
      
      this.correoDestino = '';
      this.idDispositivo = '';
      this.opcionesPersonalizacion = '';

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