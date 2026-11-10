import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../models/material.model';

@Component({
  selector: 'app-material',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './material.html',
  styleUrl: './material.css'
})
export class MaterialComponent implements OnInit {
  private readonly materialService = inject(MaterialService);
  private readonly fb = inject(FormBuilder);

  materiales = signal<Material[]>([]);
  materialForm: FormGroup;

  constructor() {
    this.materialForm = this.fb.group({
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      cantidad: [0, [Validators.required, Validators.min(0)]],
      unidad: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.cargarMateriales();
  }

  cargarMateriales(): void {
    this.materialService.listar().subscribe({
      next: (data) => this.materiales.set(data),
      error: (err) => console.error('Error al cargar materiales', err)
    });
  }

  guardar(): void {
    if (this.materialForm.invalid) return;

    this.materialService.crear(this.materialForm.value).subscribe({
      next: () => {
        this.cargarMateriales();
        this.materialForm.reset({ cantidad: 0, precio: 0 });
      },
      error: (err) => console.error('Error al crear material', err)
    });
  }

  eliminar(id: string): void {
    this.materialService.eliminar(id).subscribe({
      next: () => this.cargarMateriales(),
      error: (err) => console.error('Error al eliminar material', err)
    });
  }
}