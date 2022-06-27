function CargarTabla(){

   

    tabla_Objetos = $('#listado_de_Objetos').DataTable({
        
        responsive: true,
        autoWidth: false,
        destroy: true,
        deferRender: true,
        "ordering": false,
        "pageLength": 10,
        "lengthChange": false,
        "language":{
            
        "sProcessing":     "Procesando...",
        "sLengthMenu":     "Mostrar _MENU_ registros",
        "sZeroRecords":    "No se encontraron resultados",
        "sEmptyTable":     "Ningun dato disponible en esta tabla",
        "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
        "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
        "sInfoPostFix":    "",
        "sSearch":         "Buscar:",
        "sUrl":            "",
        "sInfoThousands":  ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sFirst":    "Primero",
            "sLast":     "�ltimo",
            "sNext":     "Siguiente",
            "sPrevious": "Anterior"
        },
        "oAria": {
            "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        },
        "buttons": {
            "copy": "Copiar",
            "colvis": "Visibilidad"
        }
        },
   
    ajax:{

        url:window.location.pathname,
        type: 'POST',
        data:{
            'action':'listar',
        },
        dataSrc: ""

    },
    columns:[
        

        
       
        {'data': 'token'},
        {'data': 'Nombre'},
        {'data': 'PrecioDeCompra'},
        {'data': 'PrecioDeVenta'},
    ],
    
    columnDefs:[
        

        {
            targets: [0],
            class: 'text-center',
            
            render:function(data,type,row){
                html = "<input id='checkBox"+ row.token +"' rel='seleccion' type='checkbox'/>"
                
                
                return  html
            
            }
        },

       
    ],
 
    initComplete: function(settings, json) {
        //alert('tabla cargada')    
      }

});
    
}



//Esta funcion devuelve las filas de la tabla que se encuentran marcadas
function filas_seleccionadas(Tabla){
    var tabla = Tabla
    var lista=[];
    var data_return = new FormData();

   

    tabla.data().each( function ( value, index ) {
        let token = tabla.row(index).data()['token']
        
        if($('#checkBox'+token).is(':checked')){
            lista.push(token)
        
        }
    
    } );
    
    data_return.append('lista',lista)

    return data_return;
}



//Esta funcion devuelve cantidad de filas de la tabla que se encuentran marcadas con un contador
function cantidad_de_filas_seleccionadas(Tabla){
    var tabla = Tabla
    var contador = 0

   

    tabla.data().each( function ( value, index ) {
        let token = tabla.row(index).data()['token']
        
        if($('#checkBox'+token).is(':checked')){
            contador = contador + 1
        
        }
    
    } );

        return contador
}



//Esta funcion actualiza el texto del footer que inidca la cantidad de filas marcadas
function actualizar_texto_footer_contador(Tabla){
    contador = cantidad_de_filas_seleccionadas(Tabla)
    document.getElementById('contador_de_objetos').innerHTML= 'Objetos Seleccionadas: '+ contador;

}


$(function(){

    CargarTabla();


    
    $("#card_header")

    //Boton para abrir el modal de crear objeto
    .on("click","button[id='crear_objeto']",function(){ 

        $("#id_Nombre").val("");
        $("#id_PrecioDeCompra").val(0);
        $("#id_PrecioDeVenta").val(0);
        $("#CrearObjetoModal").modal("show"); 

    })

    

    



    //Boton para eliminar objetos seleccionadas 
    .on("click","input[rel='boton_eliminar']",function(e){
        e.preventDefault();
        var data = filas_seleccionadas(tabla_Objetos)
        data.append('action','delete_objeto')
        
        if(!data.get('lista')==''){

        $.confirm({
            theme: 'material',
            title: 'Cuidado!',
           
        
            content: "Estas a punto de eliminar objetos:",
        
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
                                tabla_Objetos.ajax.reload() 
                                document.getElementById('contador_de_objetos').innerHTML= 'Objetos Seleccionados: 0';
                                document.getElementById('parrafoError').style.display="none";
                                $("#selec_all").prop("checked", false);
                                return false;
                               }
                               else{
                                document.getElementById('parrafoError').innerHTML= data.error.xx;
                                tabla_Objetos.ajax.reload()
                                document.getElementById('contador_de_objetos').innerHTML= 'Objetos Seleccionados: 0';
                                document.getElementById('parrafoError').style.display="block";
                                $("#selec_all").prop("checked", false);
                                
                                
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





    //Boton para seleccionar todos los datos de la tabla
    $("#listado_de_Objetos thead")
    .on("change","input[rel='seleccionar_todo']",function(){
      $("input[rel='seleccion']").prop('checked', $(this).prop("checked"));
      actualizar_texto_footer_contador(tabla_Objetos)
    
    })


    //Funcion para cuando se seleccione un checkbox se actualize la etiqueta del footer de la tabla con la cantidad de mulas seleccionadas
    $("#listado_de_Objetos")
    .on("change","input[rel='seleccion']",function(){
        actualizar_texto_footer_contador(tabla_Objetos)
      })


      
    //Funcion para cuando se seleccione un checkbox se actualize la etiqueta del footer de la tabla con la cantidad de mulas seleccionadas
    $("#CrearObjetoModal")
    $("#form").on("submit",function(e){
    e.preventDefault();
    parametros = new FormData(this);
    parametros.append('action',"crear_objeto");
    

    $.ajax({
        url:window.location.pathname,
        type:"POST",
        data:parametros,
        dataType:'json',
        processData: false,  // este parametro es obligado ponerlo cuando usas FormData
        contentType: false   // este parametro es obligado ponerlo cuando usas FormData
        


        }).done(function(data) {

           if(!data.hasOwnProperty('error')){
            
            
            tabla_Objetos.ajax.reload()
            $("#CrearObjetoModal").modal("hide"); 
            
            return false;
           }
           else{
            console.log(data.error)
           
            
            
           }
            
           
        }).fail(function( jqXHR,textStatus,errorThrown) {
                           
        }).always(function(data) {}); 
    

    
    })
      

})



