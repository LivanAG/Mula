$(function(){

    $("#botones_de_opciones")
    .on("click","button[rel='editar_mula']",function(){
        
        location.href ='/Editar_Mula/'+token;
    })



    $("#botones_de_opciones")
        .on("click","button[rel='eliminar_mula']",function(e){
        e.preventDefault();
        var data = new FormData();
        data.append('action','eliminar_mula')
        data.append('lista',token)
        
        if(!data.get('lista')==''){
            

            //aaaaaaaaaaaa
            $.confirm({
                theme: 'material',
                title: 'Cuidado!',
               
            
                content: "Estas a punto de eliminar esta mula:",
            
                columnClass:"small",
                typeAnimated:true,
                cancelButtonClass:'btn-primary',
                draggable:true,
            
                buttons: {
                    info: {
                        text:'si',
                        btnClass: 'btn-blue',
                        action: function(){
            
                            $.ajax({
                                url:window.location.pathname,
                                type:"POST",
                                data:data,
                                dataType:'json',
                                processData: false,  // este parametro es obligado ponerlo cuando usas FormData
                                contentType: false   // este parametro es obligado ponerlo cuando usas FormData
                
                
                                }).done(function(data) {
            
                                   if(!data.hasOwnProperty('error')){
                                    location.href =url_ok;
                                    return false;
                                   }
                                   else{
                                    
                                    document.getElementById('parrafoError').innerHTML= data.error.xx;
                                    document.getElementById('parrafoError').style.display="block";
                                    
                                    
                                    
                                   }
                                    
                                   
                                }).fail(function( jqXHR,textStatus,errorThrown) {
                                                   
                                }).always(function(data) {}); 
                
                       
                        
                                    
                    
                        }
                    
                   
                    },
                    danger: {
                        text:'no',
                        btnClass: 'btn-red any-other-class', // multiple classes.
                        
                    }
                }
            });
    
            //aaaaaaaaaaaaaaaaaaa
        }
        
        
        
      
    })

})