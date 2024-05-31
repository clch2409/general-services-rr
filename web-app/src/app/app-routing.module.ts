
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodyComponent } from './components/shared/body/body.component';
import { LoginComponent } from './components/shared/login/login.component';
import { RecuperarCuentaComponent } from './components/shared/recuperar-cuenta/recuperar-cuenta.component';
import { MiCuentaComponent } from './components/shared/mi-cuenta/mi-cuenta.component';
import { RegisterComponent } from './components/shared/register/register.component';
import { ListadoClientesComponent } from './components/modulo_admin/clientes/listado-clientes/listado-clientes.component';
import { EditarClientesComponent } from './components/modulo_admin/clientes/editar-clientes/editar-clientes.component';
import { ListadoEncargadosComponent } from './components/modulo_admin/encargados/listado-encargados/listado-encargados.component';
import { EditarInsumosComponent } from './components/modulo_admin/insumos/editar-insumos/editar-insumos.component';
import { ListadoInsumosComponent } from './components/modulo_admin/insumos/listado-insumos/listado-insumos.component';
import { EditarProveedoresComponent } from './components/modulo_admin/proveedores/editar-proveedores/editar-proveedores.component';
import { ListadoProveedoresComponent } from './components/modulo_admin/proveedores/listado-proveedores/listado-proveedores.component';
import { DashboardComponent } from './components/shared/dashboard/dashboard.component';
import { EditarEncargadosComponent } from './components/modulo_admin/encargados/editar-encargados/editar-encargados.component';
import { EditarSalonesComponent } from './components/modulo_admin/salones/editar-salones/editar-salones.component';
import { ListadoUsuariosComponent } from './components/modulo_admin/usuarios/listado-usuarios/listado-usuarios.component';
import { NuevoUsuarioComponent } from './components/modulo_admin/usuarios/nuevo-usuario/nuevo-usuario.component';
import { NuevoClienteComponent } from './components/modulo_admin/clientes/nuevo-cliente/nuevo-cliente.component';
import { NuevoEncargadoComponent } from './components/modulo_admin/encargados/nuevo-encargado/nuevo-encargado.component';
import { NuevoInsumoComponent } from './components/modulo_admin/insumos/nuevo-insumo/nuevo-insumo.component';
import { NuevoProveedorComponent } from './components/modulo_admin/proveedores/nuevo-proveedor/nuevo-proveedor.component';
import { EditarRolesComponent } from './components/modulo_admin/roles/editar-roles/editar-roles.component';
import { ListadoRolesComponent } from './components/modulo_admin/roles/listado-roles/listado-roles.component';
import { NuevoRolComponent } from './components/modulo_admin/roles/nuevo-rol/nuevo-rol.component';
import { NuevoSalonComponent } from './components/modulo_admin/salones/nuevo-salon/nuevo-salon.component';
import { ListadoSalonesComponent } from './components/modulo_admin/salones/listado-salones/listado-salones.component';
import { AgregarInsumosComponent } from './components/modulo_admin/salones/agregar-insumos/agregar-insumos.component';
import { MoverInsumosComponent } from './components/modulo_admin/salones/mover-insumos/mover-insumos.component';
import { ListarServicioComponent } from './components/modulo_admin/servicios/listar-servicio/listar-servicio.component';
import { NuevoServicioComponent } from './components/modulo_admin/servicios/nuevo-servicio/nuevo-servicio.component';
import { EditarServicioComponent } from './components/modulo_admin/servicios/editar-servicio/editar-servicio.component';
import { ListarTipoBuffetComponent } from './components/modulo_admin/tipo-buffet/listar-tipo-buffet/listar-tipo-buffet.component';
import { NuevoTipoBuffetComponent } from './components/modulo_admin/tipo-buffet/nuevo-tipo-buffet/nuevo-tipo-buffet.component';
import { EditarTipoBuffetComponent } from './components/modulo_admin/tipo-buffet/editar-tipo-buffet/editar-tipo-buffet.component';
import { ListarTipoEventoComponent } from './components/modulo_admin/tipo-evento/listar-tipo-evento/listar-tipo-evento.component';
import { NuevoTipoEventoComponent } from './components/modulo_admin/tipo-evento/nuevo-tipo-evento/nuevo-tipo-evento.component';
import { EditarTipoEventoComponent } from './components/modulo_admin/tipo-evento/editar-tipo-evento/editar-tipo-evento.component';
import { ListarColaboradoresComponent } from './components/modulo_admin/colaboradores/listar-colaboradores/listar-colaboradores.component';
import { NuevoColaboradorComponent } from './components/modulo_admin/colaboradores/nuevo-colaborador/nuevo-colaborador.component';
import { EditarColaboradorComponent } from './components/modulo_admin/colaboradores/editar-colaborador/editar-colaborador.component';
import { ListadoEventosComponent } from './components/modulo_admin/eventos/listado-eventos/listado-eventos.component';
import { NuevoEventoComponent } from './components/modulo_admin/eventos/nuevo-evento/nuevo-evento.component';
import { EditarEventoComponent } from './components/modulo_admin/eventos/editar-evento/editar-evento.component';


const routes: Routes = [
    { path: '', component: BodyComponent, title: 'Inicio' },
    { path: 'login', component: LoginComponent, title: 'Inicio de Sesión' },
    { path: 'recuperar-cuenta', component: RecuperarCuentaComponent, title: 'Recuperar Cuenta' },
    { path: 'mi-cuenta/:token', component: MiCuentaComponent, title: 'Mi Cuenta' },
    { path: 'register', component: RegisterComponent, title: 'Registrarse' },
    {
      path: 'dashboard',
      component: DashboardComponent,
      title: 'Inicio',
      children: [
          { path: 'clientes', component: ListadoClientesComponent, title: 'Listado Clientes' },
          { path: 'nuevo-cliente', component: NuevoClienteComponent, title: 'Registrar Clientes' },
          { path: 'editar-cliente/:cliid', component: EditarClientesComponent, title: 'Editar Clientes' },
          { path: 'encargados', component: ListadoEncargadosComponent, title: 'Listado Encargados' },
          { path: 'editar-encargado/:encid', component: EditarEncargadosComponent, title: 'Editar Encargados' },
          { path: 'nuevo-encargado', component: NuevoEncargadoComponent, title: 'Registrar Encargados' },
          { path: 'editar-insumo/:insid', component: EditarInsumosComponent, title: 'Editar Insumos' },
          { path: 'insumos', component: ListadoInsumosComponent, title: 'Listado Insumos' },
          { path: 'nuevo-insumo', component: NuevoInsumoComponent, title: 'Registrar Insumos' },
          { path: 'add-insumos', component: AgregarInsumosComponent, title: 'Agregar Insumos' },
          { path: 'move-insumos', component: MoverInsumosComponent, title: 'Mover Insumos' },
          { path: 'editar-proveedor/:provid', component: EditarProveedoresComponent, title: 'Editar Proveedores' },
          { path: 'proveedores', component: ListadoProveedoresComponent, title: 'Listado Proveedores' },
          { path: 'nuevo-proveedor', component: NuevoProveedorComponent, title: 'Registrar Proveedor' },
          { path: 'editar-rol/:rolid', component: EditarRolesComponent, title: 'Editar Rol' },
          { path: 'roles', component: ListadoRolesComponent, title: 'Listado Roles' },
          { path: 'nuevo-rol', component: NuevoRolComponent, title: 'Registrar Rol' },
          { path: 'salones', component: ListadoSalonesComponent, title: 'Salones' },
          { path: 'editar-salon/:salid', component: EditarSalonesComponent, title: 'Editar Salones' },
          { path: 'nuevo-salon', component: NuevoSalonComponent, title: 'Registrar Salon' },
          { path: 'usuarios', component: ListadoUsuariosComponent, title: 'Listado Usuarios' },
          { path: 'nuevo-usuario', component: NuevoUsuarioComponent, title: 'Registrar Usuarios' },
          { path: 'servicios', component: ListarServicioComponent, title: 'Listado Servicios' },
          { path: 'nuevo-servicio', component: NuevoServicioComponent, title: 'Registrar Servicio' },
          { path: 'editar-servicio/:serid', component: EditarServicioComponent, title: 'Editar Servicio' },
          { path: 'tipo-buffet', component: ListarTipoBuffetComponent, title: 'Listado Tipo Buffet' },
          { path: 'nuevo-tipo-buffet', component: NuevoTipoBuffetComponent, title: 'Registrar Tipo Buffet' },
          { path: 'editar-tipo-buffet/:bufid', component: EditarTipoBuffetComponent, title: 'Editar Tipo Buffet' },
          { path: 'tipo-evento', component: ListarTipoEventoComponent, title: 'Listado Tipo Evento' },
          { path: 'nuevo-tipo-evento', component: NuevoTipoEventoComponent, title: 'Registrar Tipo Evento' },
          { path: 'editar-tipo-evento/:tevid', component: EditarTipoEventoComponent, title: 'Editar Tipo Evento' },
          { path: 'colaboradores', component: ListarColaboradoresComponent, title: 'Listado Colaboradores' },
          { path: 'nuevo-colaborador', component: NuevoColaboradorComponent, title: 'Registrar Colaborador' },
          { path: 'editar-colaborador/:colid', component: EditarColaboradorComponent, title: 'Editar Colaborador' },
          { path: 'eventos', component: ListadoEventosComponent, title: 'Listado Eventos' },
          { path: 'nuevo-evento', component: NuevoEventoComponent, title: 'Registrar Evento' },
          { path: 'editar-evento/:colid', component: EditarEventoComponent, title: 'Editar Evento' },
      ]
    },
    {
      path: 'cli', component: DashboardComponent, title: 'Área Cliente', children: [
        { path: 'eventos', component: ListadoEventosComponent, title: 'Listado Eventos' },
        { path: 'nuevo-evento', component: NuevoEventoComponent, title: 'Registrar Evento' },
        { path: 'editar-evento/:evenid', component: EditarEventoComponent, title: 'Editar Evento' },
      ]
    },
    {
      path: 'col', component: DashboardComponent, title: 'Área Cliente', children: [
        { path: 'eventos', component: ListadoEventosComponent, title: 'Listado Eventos' },
        { path: 'nuevo-evento', component: NuevoEventoComponent, title: 'Registrar Evento' },
        { path: 'editar-evento/:evenid', component: EditarEventoComponent, title: 'Editar Evento' },
        { path: 'clientes', component: ListadoClientesComponent, title: 'Listado Clientes' },
        { path: 'nuevo-cliente', component: NuevoClienteComponent, title: 'Registrar Clientes' },
        { path: 'editar-cliente/:cliid', component: EditarClientesComponent, title: 'Editar Clientes' },
        { path: 'editar-insumo/:insid', component: EditarInsumosComponent, title: 'Editar Insumos' },
        { path: 'insumos', component: ListadoInsumosComponent, title: 'Listado Insumos' },
        { path: 'nuevo-insumo', component: NuevoInsumoComponent, title: 'Registrar Insumos' },
        { path: 'add-insumos', component: AgregarInsumosComponent, title: 'Agregar Insumos' },
        { path: 'move-insumos', component: MoverInsumosComponent, title: 'Mover Insumos' },
        { path: 'editar-proveedor/:provid', component: EditarProveedoresComponent, title: 'Editar Proveedores' },
        { path: 'proveedores', component: ListadoProveedoresComponent, title: 'Listado Proveedores' },
        { path: 'nuevo-proveedor', component: NuevoProveedorComponent, title: 'Registrar Proveedor' },
        { path: 'salones', component: ListadoSalonesComponent, title: 'Salones' },
        { path: 'editar-salon/:salid', component: EditarSalonesComponent, title: 'Editar Salones' },
        { path: 'nuevo-salon', component: NuevoSalonComponent, title: 'Registrar Salon' },
        { path: 'nuevo-usuario', component: NuevoUsuarioComponent, title: 'Registrar Usuarios' },
        { path: 'servicios', component: ListarServicioComponent, title: 'Listado Servicios' },
        { path: 'nuevo-servicio', component: NuevoServicioComponent, title: 'Registrar Servicio' },
        { path: 'editar-servicio/:serid', component: EditarServicioComponent, title: 'Editar Servicio' },
        { path: 'tipo-buffet', component: ListarTipoBuffetComponent, title: 'Listado Tipo Buffet' },
        { path: 'nuevo-tipo-buffet', component: NuevoTipoBuffetComponent, title: 'Registrar Tipo Buffet' },
        { path: 'editar-tipo-buffet/:bufid', component: EditarTipoBuffetComponent, title: 'Editar Tipo Buffet' },
        { path: 'tipo-evento', component: ListarTipoEventoComponent, title: 'Listado Tipo Evento' },
        { path: 'nuevo-tipo-evento', component: NuevoTipoEventoComponent, title: 'Registrar Tipo Evento' },
        { path: 'editar-tipo-evento/:tevid', component: EditarTipoEventoComponent, title: 'Editar Tipo Evento' },
        { path: 'colaboradores', component: ListarColaboradoresComponent, title: 'Listado Colaboradores' },
        { path: 'nuevo-colaborador', component: NuevoColaboradorComponent, title: 'Registrar Colaborador' },
        { path: 'editar-colaborador/:colid', component: EditarColaboradorComponent, title: 'Editar Colaborador' },
      ]
    },
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
