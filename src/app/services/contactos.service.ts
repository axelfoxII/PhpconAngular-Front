import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contactos } from '../interfaces/contactos-interface';
import { environment } from 'src/environments/environment';
import { UploadImg } from '../interfaces/cargarImg.interface';


@Injectable({
  providedIn: 'root'
})
export class ContactosService {

  private URL ='http://tuapi.com';
  
  constructor(private http:HttpClient) { }


 obtenerContactos(){

  return this.http.get<any>(`${this.URL}/index.php`);

 } 

 obtenerUnContacto(id:string){

  return this.http.get<any>(`${this.URL}/index.php?id=${id}`);

 }

 agregarContacto(formData:Contactos){

  return this.http.post(`${this.URL}/index.php`,formData);

 }

 editarContacto(id:any, formData:Contactos){
  
  console.log(id)

  return this.http.put(`${this.URL}/index.php?id=${id}`,formData);

 }

 eliminarContacto(id:string){

  return this.http.delete(`${this.URL}/index.php?id=${id}`);

 }

 uploadFile(archivo:UploadImg) {
  
  if (archivo.nombreArchivo == '' && archivo.base64textString == null) {
    return;
  }
      return this.http.post(`${this.URL}/views/img/index.php`, JSON.stringify(archivo));
}

deleteFile(imagen:string) {

    console.log(imagen)
    this.http.get<any>(`${this.URL}/views/img/delete.php?imagen=${JSON.parse(imagen)}`).subscribe(imgDel=>{

      console.log(imgDel);

    })
}
}
