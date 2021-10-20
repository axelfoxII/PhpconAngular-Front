import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Contactos } from '../interfaces/contactos-interface';
import { EditContacto } from '../interfaces/editContacto.interface';



const URL = environment.urlServer;

@Injectable({
  providedIn: 'root'
})
export class ContactosService {
  
  contactos:any=[];
  constructor(private http:HttpClient) { }

  obtenerContactos() {
    return this.http.get<any>(`/phpServer/index.php`);
  }

  obtenerUnContacto(id:string){

    return this.http.get<any>(`/phpServer/index.php?id=${id}`);

  }

  agregarContacto(formData:Contactos):Observable<any>{

    return this.http.post(`/phpServer/index.php`, JSON.stringify(formData));
    

  }

  editarContacto(id:any, editData:EditContacto){

  

    return this.http.put(`/phpServer/index.php?id=${id}`, JSON.stringify(editData));

  }

  eliminarContacto(id:string){

    
    return this.http.delete(`/phpServer/index.php?id=${id}`);


  }



}
