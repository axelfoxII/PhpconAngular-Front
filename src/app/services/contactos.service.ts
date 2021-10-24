import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contactos } from '../interfaces/contactos-interface';

@Injectable({
  providedIn: 'root'
})
export class ContactosService {

  constructor(private http:HttpClient) { }


 obtenerContactos(){

  return this.http.get<any>('/phpServer/index.php');

 } 

 obtenerUnContacto(id:string){

  return this.http.get<any>(`/phpServer/index.php?id=${id}`);

 }

 agregarContacto(formData:Contactos){

  return this.http.post('/phpServer/index.php', formData);

 }

 editarContacto(id:any, formData:Contactos){

  return this.http.put(`/phpServer/index.php?id=${id}` , formData);

 }

 eliminarContacto(id:string){

  return this.http.delete(`/phpServer/index.php?id=${id}`);

 }

}
