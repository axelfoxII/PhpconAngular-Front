import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Contactos } from './interfaces/contactos-interface';

import { ContactosService } from './services/contactos.service';

import Swal from 'sweetalert2';

declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})
export class AppComponent implements OnInit {

  contacto:any;
  contactos:any=[];

  public Forma = this.fb.group({
  
    nombre: [''],
    telefono: [''],
    email: [''],
    
  });

  constructor(private contactoSvc: ContactosService, private fb:FormBuilder){

  }

  ngOnInit() {
  this.obtenerContactos();
  }

 obtenerContactos(){

  this.contactoSvc.obtenerContactos().subscribe((res:Contactos)=>{

    this.contactos= res;

    console.log(this.contactos);

  })

}  

agregarContacto(){

   console.log(this.Forma.invalid);

  this.contactoSvc.agregarContacto(this.Forma.value).subscribe(res=>{
    
    Swal.fire({
      icon:'success',
      title:'Exito',
      text:'Contacto creado correctamente',
      showConfirmButton: true
    }).then((result)=>{

      location.reload();

    });
  }, (err)=>{
    
      Swal.fire('Error', 'No se pudo agregar contacto', 'error');

   })

}



obtenerUnContacto(id:string){

  this.contactoSvc.obtenerUnContacto(id).subscribe((res:Contactos)=>{
    
    this.contacto= res;
    
    this.Forma.setValue({
        
      nombre:this.contacto[0]['nombre'],
      telefono:this.contacto[0]['telefono'],
      email: this.contacto[0]['email'],
      
     });

     $('#editar').modal('toggle');
     $('#editar').modal('show')
    
     localStorage.setItem('idContacto', this.contacto[0]['id']);
  
    })



}

editarContacto(){

this.contactoSvc.editarContacto(localStorage.getItem('idContacto'), this.Forma.value).subscribe(res=>{
  Swal.fire({
    icon:'success',
    title:'Exito',
    text:'El contacto se actualizo correctamente',
    confirmButtonText:'Ok'
  }).then((result)=>{

    if (result) {
        
      localStorage.removeItem('idContacto');
   
      location.reload();

    }

  });


},(err)=>{
  
     Swal.fire('Error', 'No se puedo actualizar!!', 'error');

});




}

eliminarContacto(id:string){

 this.contactoSvc.eliminarContacto(id).subscribe(res=>{



  Swal.fire({
    icon:'question',
    title:'Desea eliminar el contacto? ',
    showCancelButton:true,
    confirmButtonText:'Eliminar'
  
  }).then((result)=>{

    if (result.isConfirmed) {
     
      Swal.fire({

        icon:'success',
        title:'El contacto se elimino correctamente', 
        confirmButtonText:'ok',

      }).then((result)=>{
        
        if (result) {
          
          location.reload();

        }


      },(err)=>{
  
        Swal.fire('Error', 'No se puedo Eliminar contacto!!', 'error');
   
   })
     

    }

  });


});



}

}
