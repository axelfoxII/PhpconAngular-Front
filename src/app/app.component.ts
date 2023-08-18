import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Contactos } from './interfaces/contactos-interface';

import { ContactosService } from './services/contactos.service';

import Swal from 'sweetalert2';
import { UploadImg } from './interfaces/cargarImg.interface';
import {v4 as uuidv4} from 'uuid';

declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})
export class AppComponent implements OnInit {

  contacto:any;
  contactos:any=[];
  archivo:UploadImg;
  noimage='../assets/noimage.png';
  formulario!:Contactos;
  imgBorrar:Contactos[]=[];
  uuid=uuidv4();
  
  
  public Forma = this.fb.group({
  
    nombre: [''],
    telefono: [''],
    email: [''],
    imagen:null
    
  });

  constructor(private contactoSvc: ContactosService, private fb:FormBuilder){

    this.archivo = {
			
			nombreArchivo: "",
      base64textString: null
		};

  }

  ngOnInit() {
  this.obtenerContactos();
  }


  
  seleccionarArchivo(event:any) {

    
    var files = event.target.files;
    var file = files[0];
    this.archivo.nombreArchivo = `${this.uuid}-${file.name}`;

    if(files && file) {
      var reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  _handleReaderLoaded(readerEvent:any) {
    var binaryString = readerEvent.target.result;
    this.archivo.base64textString = btoa(binaryString);
  }

 obtenerContactos(){

  this.contactoSvc.obtenerContactos().subscribe((res:Contactos)=>{

    this.contactos= res;

    console.log(this.contactos);

  })

}  

agregarContacto(){
 
   this.formulario ={

    imagen:this.archivo.nombreArchivo,
    nombre:this.Forma.value.nombre,
    telefono:this.Forma.value.telefono,
    email:this.Forma.value.email

   }

   this.contactoSvc.agregarContacto(this.formulario).subscribe(res=>{

    this.upload();
    
    Swal.fire({
      icon:'success',
      title:'Exito',
      text:'Contacto creado correctamente',
      showConfirmButton: true
    }).then((result)=>{

      localStorage.removeItem('imgContacto');
      
      location.reload();

    });
  }, (err)=>{
    
      Swal.fire('Error', 'No se pudo agregar contacto', 'error');

   });

   

}

obtenerUnContacto(id:string){
  
  this.contactoSvc.obtenerUnContacto(id).subscribe((res:Contactos)=>{
    
    this.contacto= res;
    
    console.log(this.contacto)
    
    this.Forma.setValue({
        
      nombre:this.contacto[0]['nombre'],
      telefono:this.contacto[0]['telefono'],
      email: this.contacto[0]['email'],
      imagen:null,
      
      
     });

       
     localStorage.setItem('idContacto', this.contacto[0]['id']);
     localStorage.setItem('imgContacto', this.contacto[0]['imagen']);
     
      
   
 
    })



}

editarContacto(){

  let imgContact = localStorage.getItem('imgContacto') 
  
  if (this.Forma.value.imagen == null) {
    this.formulario ={
       
      imagen:imgContact?.toString(),
      nombre:this.Forma.value.nombre,
      telefono:this.Forma.value.telefono,
      email:this.Forma.value.email
  
     }  
  }else{
    this.formulario ={

      imagen:this.archivo.nombreArchivo,
      nombre:this.Forma.value.nombre,
      telefono:this.Forma.value.telefono,
      email:this.Forma.value.email
  
     }  
  }
  console.log(this.formulario)

  this.contactoSvc.editarContacto(localStorage.getItem('idContacto'), this.formulario).subscribe(res=>{
    Swal.fire({
      icon:'success',
      title:'Exito',
      text:'El contacto se actualizo correctamente',
      confirmButtonText:'Ok'
    }).then((result)=>{
  
      if (result) {


          if(this.formulario.imagen == null ){
            this.upload();
            
          
          }else if(this.formulario.imagen !== null && this.seleccionarArchivo !== null){
            this.upload();
            
          }else{
            this.upload();
            this.deleteImagen(JSON.stringify(localStorage.getItem('imgContacto')))
          }        
          
         
        localStorage.removeItem('idContacto');
        localStorage.removeItem('imgContacto');
        
        location.reload();
     
       
  
      }
  
    });
  
  
  },(err)=>{
    
       Swal.fire('Error', 'No se puedo actualizar!!', 'error');
  
  });
  
  
  
  
  }
  

eliminarContacto(id:any){ 

  this.obtenerUnContacto(id);
 
  Swal.fire({
    icon:'question',
    title:'Desea eliminar el contacto? ',
    showCancelButton:true,
    confirmButtonText:'Eliminar'
  
  }).then((result)=>{
     
    if (result.isConfirmed) {
      this.deleteImagen(JSON.stringify(localStorage.getItem('imgContacto')))  
     this.contactoSvc.eliminarContacto(id).subscribe(res=>{

      Swal.fire({

        icon:'success',
        title:res, 
        confirmButtonText:'ok',

      }).then((resultado)=>{
        
        if (resultado) {
          localStorage.removeItem('idContacto');
          localStorage.removeItem('imgContacto');
          
          location.reload();

        }


      },(err)=>{
  
        Swal.fire('Error', 'No se puedo Eliminar contacto!!', err);
   
   })

     })
     
     

    }

  });




}

upload() {

  this.contactoSvc.uploadFile(this.archivo)?.subscribe(

    (datos:any) => {
     
        console.log(datos)

       
        

      })
   

 
  
}


deleteImagen(imagen:string){

  this.contactoSvc.deleteFile(imagen);

}

cerrarEdit(){

  this.Forma.reset();
  localStorage.removeItem('idContacto')
  localStorage.removeItem('imgContacto')

}



}
