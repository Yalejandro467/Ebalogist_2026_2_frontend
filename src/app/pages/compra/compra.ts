import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompraService } from '../../services/compra.service';
import { Compra } from '../../models/compra.model';

@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './compra.html',
  styleUrl: './compra.css'
})
export class CompraComponent implements OnInit {
  private readonly compraService = inject(CompraService);
  private readonly fb = inject(FormBuilder);

  compras = signal<Compra[]>([]);
  compraForm: FormGroup;

  constructor() {
    this.compraForm = this.fb.group({
      valor_total: [0, [Validators.required, Validators.min(0)]],
      estado: ['Pendiente', Validators.required],
      id_proveedor: [null]
    });
  }

  ngOnInit(): void {
    this.cargarCompras();
  }

  cargarCompras(): void {
    this.compraService.listar().subscribe({
      next: (data) => this.compras.set(data),
      error: (err) => console.error('Error al cargar compras', err)
    });
  }

  guardar(): void {
    if (this.compraForm.invalid) return;

    this.compraService.crear(this.compraForm.value).subscribe({
      next: () => {
        this.cargarCompras();
        this.compraForm.reset({ valor_total: 0, estado: 'Pendiente' });
      },
      error: (err) => console.error('Error al crear compra', err)
    });
  }

  eliminar(id: string): void {
    this.compraService.eliminar(id).subscribe({
      next: () => this.cargarCompras(),
      error: (err) => console.error('Error al eliminar compra', err)
    });
  }
}