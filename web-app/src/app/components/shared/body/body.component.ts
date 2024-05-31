import { Component, HostListener, OnInit } from '@angular/core';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  isFixed: boolean = false;

  constructor(private storageService: StorageService) { }

  ngOnInit(): void {
  }

  cerrarSesion(): void {
    this.storageService.cerrarSesion();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isFixed = window.pageYOffset > 0;
  }
}
