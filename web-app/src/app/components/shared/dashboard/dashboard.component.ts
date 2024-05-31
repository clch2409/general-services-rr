import { Component, HostListener, OnInit } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  rol: string = '';

  constructor(private storageService: StorageService, private authService: AuthService) {
    this.storageService.comprobarSesion();
  }

  ngOnInit(): void {
    console.log(this.rol);
  }

  ngAfterViewInit(): void{
    this.rol = this.storageService.obtenerRol();
    this.storageService.comprobarSesion();
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
  }
}
