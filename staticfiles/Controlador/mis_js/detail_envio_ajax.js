//Funcion que carga nuestro datatable envios
function CargarTablaEnvios(parametros){

    tabla_Envios = $('#listado_de_objetos').DataTable({
        
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
        data:parametros,
        dataSrc: ""

    },
    columns:[
        

        {'data': 'Nombre'},
        {'data': 'PrecioDeCompra'},
        {'data': 'PrecioDeVenta'},
        {'data': 'Nombre'},
    ],
    
    columnDefs:[
        


        {
            targets: [3],
            class: 'text-center',
            
            render:function(data,type,row){
               
                html = "<input type='number' id='number"+ row.token +"' readonly name='Cantidad' value='"+ row.cantidad +"' placeholder='Cantidad' rel='seleccion' autocomplete='off' class='form-control'/>"

                
                
                return  html
            
            }
        },

      
    ],
 
    initComplete: function(settings, json) {
        //alert('tabla cargada')    
      }

});
}

function CargarTablaGastosExtras(parametros){

    tabla_Gastos_Extras = $('#gastos_extras').DataTable({
        
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
        data:parametros,
        dataSrc: ""

    },
    columns:[
               
       
        {'data': 'Nombre'},
        {'data': 'Cantidad_de_dinero'},
        {'data': 'Nombre'},
    ],
    
    columnDefs:[
        

        

        {
            targets: [2],
            class: 'text-center',
            
            render:function(data,type,row){
               
                html = "<input type='number'  id='number"+ row.token +"'name='Cantidad' value='"+ row.cantidad +"' placeholder='Cantidad' rel='seleccion' autocomplete='off' class='form-control'/>"

                
                html='<button type="button" rel="detail" id=boton'+row.token+' class="btn btn-success">Details</button>'                
                return  html
            
            }
        },

      
    ],

    
 
    initComplete: function(settings, json) {
        //alert('tabla cargada')    
      }

});
}



$(function(){
   
    

    CargarTablaEnvios({'action':'listar_inventario','token':token});

    CargarTablaGastosExtras({'action':'listar_gastos_extras','token':token});

    $("#gasto_extra")
    .on("click","button[rel='detail']",function(){ 

        var tr = tabla_Gastos_Extras.cell( $(this).closest("td","li")).index(); // capturamos la fila
        var data = tabla_Gastos_Extras.row(tr.row).data(); // Guardamos el objeto que habia en esa fila en data
        
        
            var nombre = data.Nombre 
            var dinero = data.Cantidad_de_dinero
            var notas = data.notas
            $('.nombre').html(nombre);
            $('.cant_dinero').html(dinero);
            $('.notas').html(notas);
            $( "#notas_modal" ).val(notas)
            $("#InfoGastoExtraModal").modal("show");
        
        
        
        
    })

    
    $("#botones_de_opciones")
    .on("click","button[rel='eliminar_envio']",function(){
        
        var data = new FormData();
        data.append('action','eliminar_envio')
        data.append('lista',token)

        enviar_con_ajax(window.location.pathname,data,'Cuidado!',"Estas a punto de eliminar un envio:","ModalError",function(){
            location.href =url_ok;
      
        })
    })

    .on("click","button[rel='editar_envio']",function(){
        
        location.href ='/Editar_Envio/'+token;
    })






})