
function CargarTabla(){

   

    tabla_Envios = $('#listado_de_envios').DataTable({
        
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
        {'data': 'Dinero_Total_Invertido'},
        {'data': 'Dinero_Total_obtenido'},
        {'data': 'Ganancia'},
        {'data': 'Ganancia'},
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
            targets: [5],
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
    document.getElementById('contador_de_envios').innerHTML= 'Envios Seleccionados: '+ contador;

}
$(function(){

    CargarTabla();

    //Esto programa el boton de la tabla para ir a la pagina de detalles del objeto seleccionado
    $("#listado_de_envios tbody")
    .on("click","a[rel='detalles']",function(){
        
        var tr = tabla_Envios.cell( $(this).closest("td","li")).index(); // capturamos la fila
        var data = tabla_Envios.row(tr.row).data(); // Guardamos el objeto que habia en esa fila en data
        location.href ='Detail_Envio/'+data.token;
    })


    //Boton para eliminar mulas seleccionadas 
    $("#card_header")
    .on("click","input[rel='boton_eliminar']",function(e){
        e.preventDefault();
        var data = filas_seleccionadas(tabla_Envios)
        data.append('action','delete_envio')
        
        if(!data.get('lista')==''){
            enviar_con_ajax(window.location.pathname,data,'Cuidado!',"Estas a punto de eliminar envios:","ModalError",function(){
                tabla_Envios.ajax.reload() 
                document.getElementById('contador_de_envios').innerHTML= 'Envios Seleccionados: 0';
                $("#selec_all").prop("checked", false);
            })
        }
        
        
        
      
    })

    
    //Boton para seleccionar todos los datos de la tabla
    $("#listado_de_envios thead")
    .on("change","input[rel='seleccionar_todo']",function(){
      $("input[rel='seleccion']").prop('checked', $(this).prop("checked"));
      actualizar_texto_footer_contador(tabla_Envios)
    
    })
    
    //Funcion para cuando se seleccione un checkbox se actualize la etiqueta del footer de la tabla con la cantidad de mulas seleccionadas
    $("#listado_de_envios")
    .on("change","input[rel='seleccion']",function(){
        actualizar_texto_footer_contador(tabla_Envios)
      })
      

})
