import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProveedorService } from '../../services/proveedor.service';
import { Proveedor } from '../../models/proveedor.model';

@Component({
  selector: 'app-proveedor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './proveedor.html',
  styleUrl: './proveedor.css'
})
export class ProveedorComponent implements OnInit {
  private readonly proveedorService = inject(ProveedorService);
  private readonly fb = inject(FormBuilder);

  proveedores = signal<Proveedor[]>([]);
  proveedorForm: FormGroup;

  constructor() {
    this.proveedorForm = this.fb.group({
      nombre: ['', Validators.required],
      tel: ['', Validators.required],
      direccion: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.proveedorService.listar().subscribe({
      next: (data) => this.proveedores.set(data),
      error: (err) => console.error('Error al cargar proveedores', err)
    });
  }

  guardar(): void {
    if (this.proveedorForm.invalid) return;

    this.proveedorService.crear(this.proveedorForm.value).subscribe({
      next: () => {
        this.cargarProveedores();
        this.proveedorForm.reset();
      },
      error: (err) => console.error('Error al crear proveedor', err)
    });
  }

  eliminar(id: string): void {
    this.proveedorService.eliminar(id).subscribe({
      next: () => this.cargarProveedores(),
      error: (err) => console.error('Error al eliminar proveedor', err)
    });
  }
}