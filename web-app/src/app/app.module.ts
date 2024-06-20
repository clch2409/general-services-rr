import { NgModule } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { EditarRolesComponent } from './components/modulo_admin/roles/editar-roles/editar-roles.component';
import { ListadoRolesComponent } from './components/modulo_admin/roles/listado-roles/listado-roles.component';
import { EditarEncargadosComponent } from './components/modulo_admin/encargados/editar-encargados/editar-encargados.component';
import { EditarSalonesComponent } from './components/modulo_admin/salones/editar-salones/editar-salones.component';
import { ListadoSalonesComponent } from './components/modulo_admin/salones/listado-salones/listado-salones.component';
import { ListadoUsuariosComponent } from './components/modulo_admin/usuarios/listado-usuarios/listado-usuarios.component';
import { NuevoUsuarioComponent } from './components/modulo_admin/usuarios/nuevo-usuario/nuevo-usuario.component';
import { NuevoClienteComponent } from './components/modulo_admin/clientes/nuevo-cliente/nuevo-cliente.component';
import { NuevoEncargadoComponent } from './components/modulo_admin/encargados/nuevo-encargado/nuevo-encargado.component';
import { NuevoInsumoComponent } from './components/modulo_admin/insumos/nuevo-insumo/nuevo-insumo.component';
import { NuevoProveedorComponent } from './components/modulo_admin/proveedores/nuevo-proveedor/nuevo-proveedor.component';
import { NuevoRolComponent } from './components/modulo_admin/roles/nuevo-rol/nuevo-rol.component';
import { NuevoSalonComponent } from './components/modulo_admin/salones/nuevo-salon/nuevo-salon.component';
import { DashboardComponent } from './components/shared/dashboard/dashboard.component';
import { BodyComponent } from './components/shared/body/body.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon'
import { MatCommonModule } from '@angular/material/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
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
import { NuevoEventoComponent } from './components/modulo_admin/eventos/nuevo-evento/nuevo-evento.component';
import { ListadoEventosComponent } from './components/modulo_admin/eventos/listado-eventos/listado-eventos.component';
import { EditarEventoComponent } from './components/modulo_admin/eventos/editar-evento/editar-evento.component';
import { AsignarServiciosComponent } from './components/modulo_admin/eventos/asignar-servicios/asignar-servicios.component';
import { NuevoCargoComponent } from './components/modulo_admin/cargos/nuevo-cargo/nuevo-cargo.component';
import { EditarCargoComponent } from './components/modulo_admin/cargos/editar-cargo/editar-cargo.component';
import { ListarCargosComponent } from './components/modulo_admin/cargos/listar-cargos/listar-cargos.component';
import { AsignarColaboradorComponent } from './components/modulo_admin/eventos/asignar-colaborador/asignar-colaborador.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    BodyComponent,
    LoginComponent,
    RecuperarCuentaComponent,
    MiCuentaComponent,
    RegisterComponent,
    ListadoClientesComponent,
    EditarClientesComponent,
    NuevoClienteComponent,
    ListadoEncargadosComponent,
    EditarEncargadosComponent,
    NuevoEncargadoComponent,
    EditarInsumosComponent,
    ListadoInsumosComponent,
    NuevoInsumoComponent,
    MoverInsumosComponent,
    EditarProveedoresComponent,
    ListadoProveedoresComponent,
    NuevoProveedorComponent,
    EditarRolesComponent,
    ListadoRolesComponent,
    NuevoRolComponent,
    EditarSalonesComponent,
    ListadoSalonesComponent,
    NuevoSalonComponent,
    NuevoUsuarioComponent,
    ListadoUsuariosComponent,
    AgregarInsumosComponent,
    ListarServicioComponent,
    NuevoServicioComponent,
    EditarServicioComponent,
    ListarTipoBuffetComponent,
    NuevoTipoBuffetComponent,
    EditarTipoBuffetComponent,
    ListarTipoEventoComponent,
    NuevoTipoEventoComponent,
    EditarTipoEventoComponent,
    ListarColaboradoresComponent,
    NuevoColaboradorComponent,
    EditarColaboradorComponent,
    NuevoEventoComponent,
    ListadoEventosComponent,
    EditarEventoComponent,
    AsignarServiciosComponent,
    AsignarColaboradorComponent,
    NuevoCargoComponent,
    EditarCargoComponent,
    ListarCargosComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatCommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatExpansionModule,
    MatTableModule
  ],
  providers: [AuthService, provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
