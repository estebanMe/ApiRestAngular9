import { Injectable } from '@angular/core';
import {formatDate, DatePipe} from '@angular/common';
import { CLIENTES } from './Clientes.json';
import { Cliente } from './cliente';
import {Observable, of, throwError} from 'rxjs';
import {map, catchError, tap} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';


import { Router } from '@angular/router';

@Injectable()
export class ClienteService {

  private urlEndPoint = 'http://localhost:8080/api/clientes';


  private httpHeaders = new HttpHeaders({'Content-Type' : 'application/json'});
  constructor(private http: HttpClient, private router: Router) { }



  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
     
      tap((response: any) => {
        console.log('ClienteService: tap 1');
        (response.content as Cliente[]).forEach(cliente => console.log(cliente.nombre));
      }),
      map((response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          //let datePipe = new DatePipe('es');
          //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
          //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'es');
          return cliente;
        });
        return response;
      }),
      tap(response => {
        console.log('ClienteService: tap 2');
        (response.content as Cliente[]).forEach(cliente => console.log(cliente.nombre));
      })
    );
  }



  create(cliente: Cliente): Observable<Cliente> {
      return this.http.post<Cliente>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
        catchError(e => {

          if(e.status==400){
             return throwError(e);
          }

          console.error(e);
          Swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      }

      )
    );
  }


  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
        catchError(e => {
          console.error(e);
          if(e.status==400){
            return throwError(e);
         }
          Swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        }
      )
    );
  }

  remove(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
          catchError(e => {
            console.error(e);
            Swal.fire(e.error.mensaje, e.error.error, 'error');
            return throwError(e);
          }
      )
    );
  }

}
