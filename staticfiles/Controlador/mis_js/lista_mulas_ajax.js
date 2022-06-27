
function CargarTabla(){

   

    tabla_Mulas = $('#listado_de_mulas').DataTable({
        
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
        {'data': 'Telefono'},
        {'data': 'CantidadDeEnviosRealizados'},
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

        {
            targets: [4],
            class: 'text-center',
            
            render:function(data,type,row){
                html = "<a  rel='detalles' class='btn btn-outline-success'><i class='bi bi-eye-fill'></i> </a>"
                
                return  html;
                //return x

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
    document.getElementById('contador_de_mulas').innerHTML= 'Mulas Seleccionadas: '+ contador;

}

$(function(){

    CargarTabla();

    //Esto programa el boton de la tabla para ir a la pagina de detalles del objeto seleccionado
    $("#listado_de_mulas tbody")
    .on("click","a[rel='detalles']",function(){
        
        var tr = tabla_Mulas.cell( $(this).closest("td","li")).index(); // capturamos la fila
        var data = tabla_Mulas.row(tr.row).data(); // Guardamos el objeto que habia en esa fila en data
        location.href ='Detail_Mula/'+data.token;
    })


    //Boton para eliminar mulas seleccionadas 
    $("#card_header")
    .on("click","input[rel='boton_eliminar']",function(e){
        e.preventDefault();
        var data = filas_seleccionadas(tabla_Mulas)
        data.append('action','delete_mula')
        
        if(!data.get('lista')==''){
            

            //aaaaaaaaaaaa
            $.confirm({
                theme: 'material',
                title: 'Cuidado!',
               
            
                content: "Estas a punto de eliminar mulas:",
            
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
                                    tabla_Mulas.ajax.reload() 
                                    document.getElementById('contador_de_mulas').innerHTML= 'Mulas Seleccionadas: 0';
                                    document.getElementById('parrafoError').style.display="none";
                                    $("#selec_all").prop("checked", false);
                                    return false;
                                   }
                                   else{
                                    
                                    document.getElementById('parrafoError').innerHTML= data.error.xx;
                                    tabla_Mulas.ajax.reload()
                                    document.getElementById('parrafoError').style.display="block";
                                    document.getElementById('contador_de_mulas').innerHTML= 'Mulas Seleccionadas: 0';
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
    $("#listado_de_mulas thead")
    .on("change","input[rel='seleccionar_todo']",function(){
      $("input[rel='seleccion']").prop('checked', $(this).prop("checked"));
      actualizar_texto_footer_contador(tabla_Mulas)
    
    })
    
    
    //Funcion para cuando se seleccione un checkbox se actualize la etiqueta del footer de la tabla con la cantidad de mulas seleccionadas
    $("#listado_de_mulas")
    .on("change","input[rel='seleccion']",function(){
        actualizar_texto_footer_contador(tabla_Mulas)
      })

    $("#card_header")
      
    //Boton para abrir el modal de crear objeto
    .on("click","button[id='crear_mula']",function(){ 

        $("#id_Nombre").val("");
        $("#id_Telefono").val('');
        $("#CrearMulaModal").modal("show"); 

    })
        
    
     //Funcion para cuando se seleccione un checkbox se actualize la etiqueta del footer de la tabla con la cantidad de mulas seleccionadas
    $("#CrearMulaModal")
    $("#form").on("submit",function(e){
    e.preventDefault();
    parametros = new FormData(this);
    parametros.append('action',"crear_mula");
    

    $.ajax({
        url:window.location.pathname,
        type:"POST",
        data:parametros,
        dataType:'json',
        processData: false,  // este parametro es obligado ponerlo cuando usas FormData
        contentType: false   // este parametro es obligado ponerlo cuando usas FormData
        


        }).done(function(data) {

           if(!data.hasOwnProperty('error')){
            
            
            tabla_Mulas.ajax.reload()
            $("#CrearMulaModal").modal("hide"); 
            
            return false;
           }
           else{
            console.log(data.error)
           
            
            
           }
            
           
        }).fail(function( jqXHR,textStatus,errorThrown) {
                           
        }).always(function(data) {}); 
    

    
    })
})



