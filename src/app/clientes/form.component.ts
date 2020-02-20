import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import {Router, ActivatedRoute} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  public cliente: Cliente = new Cliente();
  public titulo = 'crear';

  public errores: string [];
  

  // tslint:disable-next-line: no-shadowed-variable
  constructor(private clienteService: ClienteService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id) {
        this.clienteService.getCliente(id).subscribe(
          (cliente) => this.cliente = cliente
        );
      }
    });
  }


   create(): void {
   this. clienteService.create(this.cliente)
       .subscribe(
        cliente => {
            this.router.navigate(['/clientes']);
            Swal.fire('Nuevo cliente', `Cliente ${cliente.nombre} creado cn éxito!`, 'success');
          },
          err => {
            this.errores = err.error.errors as string[];
            console.error('Código del error desde el Backend: ' + err.status);
            console.error(err.error.errors);
          }
       );
    }


    update(): void {
       this.clienteService.update(this.cliente)
       .subscribe(
         cliente => {
           this.router.navigate(['/clientes']);
           Swal.fire('Cliente Actualizado', `Cliente ${cliente.nombre} actualizado con éxito!`, 'success');
         },
         err => {
           this.errores = err.error.errors as string[];
           console.error('Código del error desde el Backend: ' + err.status);
           console.error(err.error.errors);
         }
       );
    }
}
