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
        "rowCallback": function( row, data ) {
            if ( data.listo == true ) {
              $(row).addClass("inventario_listo");
              document.getElementById('inventario_listo').style.display="none";
              document.getElementById('inventario_incompleto').style.display="block";
              
            }
            else{
                document.getElementById('inventario_listo').style.display="block";
                document.getElementById('inventario_incompleto').style.display="none";
            }
          },
   
    ajax:{

        url:window.location.pathname,
        type: 'POST',
        data:parametros,
        dataSrc: ""

    },
    columns:[
        

        
       
        {'data': 'token'},
        {'data': 'Nombre'},
        {'data': 'PrecioDeCompra'},
        {'data': 'PrecioDeVenta'},
        {'data': 'Nombre'},
    ],
    
    columnDefs:[
        

        {
            targets: [0],
            class: 'text-center',
            
            render:function(data,type,row){
             
                if(row.cantidad){
                    html = "<input id='checkBox"+ row.token +"' rel='seleccion1' checked type='checkbox'/>"

                }
                else{
                    html = "<input id='checkBox"+ row.token +"' rel='seleccion1'  type='checkbox'/>"

                }
                return  html
            
            }
        },

        {
            targets: [4],
            class: 'text-center',
            
            render:function(data,type,row){
               
                html = "<input type='number' id='number"+ row.token +"' name='Cantidad' value='"+ row.cantidad +"' placeholder='Cantidad' rel='seleccion' autocomplete='off' class='form-control'/>"

                
                
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
        "rowCallback": function( row, data ) {
            if ( data.listo == true ) {
              $(row).addClass("inventario_listo");
              document.getElementById('gastos_extras_listo').style.display="none";
              document.getElementById('gastos_extras_incompletos').style.display="block";
              
            }
            else{
                document.getElementById('gastos_extras_listo').style.display="block";
                document.getElementById('gastos_extras_incompletos').style.display="none";
            }
          },
        
   
    ajax:{

        url:window.location.pathname,
        type: 'POST',
        data:parametros,
        dataSrc: ""

    },
    columns:[
               
        {'data': 'token'},
        {'data': 'Nombre'},
        {'data': 'Cantidad_de_dinero'},
        {'data': 'Nombre'},
    ],
    
    columnDefs:[
        

        {
            targets: [0],
            class: 'text-center',
            
            render:function(data,type,row){
             
                if(row.listo ||row.cantidad){
                    html = "<input id='checkBox"+ row.token +"' rel='seleccion2' checked type='checkbox'/>"

                }
                else{
                    html = "<input id='checkBox"+ row.token +"' rel='seleccion2'  type='checkbox'/>"

                }
                return  html
            
            }
        },

        {
            targets: [3],
            class: 'text-center',
            
            render:function(data,type,row){
               
                html = "<input type='number'  id='number"+ row.token +"'name='Cantidad' value='"+ row.cantidad +"' placeholder='Cantidad' rel='seleccion' autocomplete='off' class='form-control'/>"

                
                html='<button type="button" rel="detail" id=boton'+row.token+' class="btn btn-success">Details</button>'                
                return  html
            
            }
        },

      
    ],

    
 
    initComplete: function(data,settings, json) {
      }

});
}

//Esta funcion devuelve las filas de la tabla que se encuentran marcadas
function filas_seleccionadas(Tabla){
    var tabla = Tabla
    var lista=[];
    var data_return = new FormData();
    var todo_bien = true
    let total_obtenido = 0
    let inversion_total = 0
    let ganancia = 0
    let gastos_extras = 0

    tabla.data().each( function ( value, index ) {
        let token = tabla.row(index).data()['token']
        let cantidad = $('#number'+token).val()
        let PrecioDeCompra = tabla.row(index).data()['PrecioDeCompra']
        let PrecioDeVenta = tabla.row(index).data()['PrecioDeVenta']
        let gasto_extra = tabla.row(index).data()['Cantidad_de_dinero']
        
        if($('#checkBox'+token).is(':checked')){
            //Atencion como dejo un espaciado al final para luego cuando recupere los elementos en mi view poder identificar
            //Donde termina un elemento y donde empieza otro

            lista.push('{"token":"'+token+'","cantidad":"'+cantidad+'"} ')
            
            total_obtenido += PrecioDeVenta * cantidad

            inversion_total += PrecioDeCompra * cantidad

            ganancia = total_obtenido - inversion_total

            gastos_extras += gasto_extra
            if (!cantidad) {
                todo_bien = false

            }
        }
    
    } );
    
    data_return.append('lista',lista)
    data_return.append('todo_bien',todo_bien)

    data_return.append('total_obtenido',total_obtenido)
    data_return.append('inversion_total',inversion_total)
    data_return.append('ganancia',ganancia)

    data_return.append('Gastos_Extras',gastos_extras)
    return data_return;
}




function actualizando_pizzarras_inventario(suma_o_resta,total_invert,total_obt,ganancia){
    var gananc = parseFloat($( "#id_Ganancia" ).val())
    var total_invertido = parseFloat($( "#id_Dinero_Total_Invertido" ).val())
    var total_obtenido = parseFloat($( "#id_Dinero_Total_obtenido" ).val())

    if(suma_o_resta)
    {
        $( "#id_Dinero_Total_Invertido" ).val(total_invertido + parseFloat(total_invert))
        $( "#id_Dinero_Total_obtenido" ).val(total_obtenido + parseFloat(total_obt) )
        $( "#id_Ganancia" ).val(gananc + parseFloat(ganancia) )
    }
    else
    {
        $( "#id_Dinero_Total_Invertido" ).val(total_invertido - parseFloat(total_invert))
        $( "#id_Dinero_Total_obtenido" ).val(total_obtenido - parseFloat(total_obt) )
        $( "#id_Ganancia" ).val(gananc - parseFloat(ganancia) )
    }
}


function actualizando_pizzarras_gastos_extras(suma_o_resta,gasto_extra){
    var gananc = parseFloat($( "#id_Ganancia" ).val())
    var total_invertido = parseFloat($( "#id_Dinero_Total_Invertido" ).val())
    var total_obtenido = parseFloat($( "#id_Dinero_Total_obtenido" ).val())

    if(suma_o_resta)
    {
        $( "#id_Dinero_Total_Invertido" ).val(total_invertido + parseFloat(gasto_extra))
        $( "#id_Ganancia" ).val(gananc - parseFloat(gasto_extra) )
    }
    else
    {
        $( "#id_Dinero_Total_Invertido" ).val(total_invertido - parseFloat(gasto_extra))
        $( "#id_Ganancia" ).val(gananc + parseFloat(gasto_extra) )
    }
}


//Esta funcion devuelve cantidad de filas de la tabla que se encuentran marcadas con un contador
function cantidad_de_filas_seleccionadas(Tabla){
    var tabla = Tabla
    var contador = 0

    console.log("token")

    tabla.data().each( function ( value, index ) {
        let token = tabla.row(index).data()['token']
        
        
        if($('#checkBox'+token).is(':checked')){
            contador = contador + 1
        
        }
    
    } );

        return contador
}

//Esta funcion actualiza el texto del footer que inidca la cantidad de filas marcadas
function actualizar_texto_footer_contador(Tabla,id_elemento,texto){
    contador = cantidad_de_filas_seleccionadas(Tabla)
    document.getElementById(id_elemento).innerHTML= texto + contador;
}


//Esta funcion actualiza el texto del footer que inidca la cantidad de filas marcadas
function Inicializar_Datos_Tablas(){
    CargarTablaEnvios({'action':'listar_inventario','token':token});

    CargarTablaGastosExtras({'action':'listar_gastos_extras','token':token});
   
    $("#selc_todo_gast_ext"). attr("disabled",true)
    $("#selc_todo_invent"). attr("disabled",true)
    
    actualizar_texto_footer_contador(tabla_Envios,'contador_de_objetos','Gastos Seleccionados: ')
    
    actualizar_texto_footer_contador(tabla_Gastos_Extras,'contador_de_gastos','Gastos Seleccionados: ')
}


//Esta funcion actualiza el texto del footer que inidca la cantidad de filas marcadas
function Inicializar_Pizzarras(){
    var x = filas_seleccionadas(tabla_Envios)
       x.append('action','get_valores')
       x.append('token',token)
    
    $.ajax({
        url:window.location.pathname,
        type:"POST",
        data:x,
        dataType:'json',
        processData: false,  // este parametro es obligado ponerlo cuando usas FormData
        contentType: false   // este parametro es obligado ponerlo cuando usas FormData


        }).done(function(data) {

           if(!data.hasOwnProperty('error')){
            
           
            
            var inversion_total=parseFloat(data.Dinero_Total_Invertido)
            var total_obtenido =parseFloat(data.Dinero_Total_obtenido)
            var ganancia=parseFloat(data.Ganancia)
            var pasajes=parseFloat(data.Gasto_total_en_pasajes)
            var fecha = data.Fecha

            $( "#id_Dinero_Total_Invertido" ).val(inversion_total)
            $( "#id_Dinero_Total_obtenido" ).val(total_obtenido)
            $( "#id_Ganancia" ).val(ganancia)
            $( "#id_Gasto_total_en_pasajes" ).val(pasajes)
            $( "#id_Fecha" ).val(fecha)
            
            return false;
           }
           else{
            console.log("erroooooooooooor")
            console.log(data.error)
            
           }
            
           
        })
}

function hay_gastos_extras_previos(){
    $.ajax({
        url:window.location.pathname,
        type:"POST",
        data:{'action':'listar_gastos_extras','token':token},
        dataType:'json',
        


        }).done(function(data) {

           if(!data.hasOwnProperty('error')){
            
            if(data[0]&&data[0].listo==false)
            {
                
               
            }
            else{
                $("#selc_todo_gast_ext"). attr("disabled",true)
            }
            
            
            return false;
           }
           else{
            console.log(data.error)
           
            
            
           }
            
           
        }).fail(function( jqXHR,textStatus,errorThrown) {
                           
        }).always(function(data) {}); 

}


$(function(){

    
   
    CargarTablaEnvios({'action':'listar_inventario','token':token});

    CargarTablaGastosExtras({'action':'listar_gastos_extras','token':token});

    hay_gastos_extras_previos()
    
    $("#selc_todo_invent"). attr("disabled",true)

    Inicializar_Pizzarras()
    
    
  
    

    

   //Boton para que en la tabla de objetos se queden solamente los objetos que fueron seleccionados
   $("#packs")
   .on("click","button[id='inventario_listo']",function(e){
       e.preventDefault();
       var data = filas_seleccionadas(tabla_Envios)
       data.append('action','inventario_listo')

       var parametros ={
        'action':data.get('action'),
        'lista':data.get('lista'),
        }

       if(!data.get('lista')==''){
           if(data.get('todo_bien')== "true"){
            
            
            enviar_con_ajax(window.location.pathname,data,'Atento!',"Estas a punto de finalizar tu inventario de viaje:","ModalError",function(){ 
                
            CargarTablaEnvios(parametros);

            document.getElementById('parrafo_error').style.display="none";
             
            actualizando_pizzarras_inventario(true,data.get('inversion_total'),data.get('total_obtenido'),data.get('ganancia'))

            
            $("#selc_todo_invent"). attr("disabled",true)
            
            })
            
            }
            else{
                document.getElementById('parrafo_error').style.display="block";  

            }
           }
        
     
   })

   //Boton para que en la tabla de objetos vuelvan a aparecer todos disponibles pero se mantengan seleccioanods los que tu habias elegido antes
   .on("click","button[id='inventario_incompleto']",function(e){
    e.preventDefault();
    var data = filas_seleccionadas(tabla_Envios)
    data.append('action','inventario_incompleto')
    //console.log(data.get('lista'))

    var parametros ={
     'action':data.get('action'),
     'lista':data.get('lista'),
     }
    if(!data.get('lista')==''){
     enviar_con_ajax(window.location.pathname,data,'Atento!',"Estas a punto de volver para editar tu inventario de viaje:","ModalError",function(){ 
         
         CargarTablaEnvios(parametros);
         actualizando_pizzarras_inventario(false,data.get('inversion_total'),data.get('total_obtenido'),data.get('ganancia'))
         $("#selc_todo_invent"). attr("disabled",false)
         
     })
     }
  
   })

   //Boton para seleccionar todos los datos de la tabla
   .on("change","input[rel='seleccionar_todo']",function(){
        $("input[rel='seleccion1']").prop('checked', $(this).prop("checked"));
        actualizar_texto_footer_contador(tabla_Envios,'contador_de_objetos','Gastos Seleccionados: ')
        
        
     
   
   })
   
        
   .on("change","input[rel='seleccion1']",function(){
    actualizar_texto_footer_contador(tabla_Envios,'contador_de_objetos','Gastos Seleccionados: ')
    })

   $("#gasto_extra")

    //Boton para que en la tabla de gastos vuelvan a aparecer todos disponibles pero se mantengan seleccioanods los que tu habias elegido antes
   .on("click","button[id='gastos_extras_listo']",function(e){
    e.preventDefault();
    var data = filas_seleccionadas(tabla_Gastos_Extras)
    data.append('action','gastos_extras_listos')
    

    var parametros ={
     'action':data.get('action'),
     'lista':data.get('lista'),
     }

    if(!data.get('lista')==''){
        
         
         enviar_con_ajax(window.location.pathname,data,'Atento!',"Estas a punto de finalizar los gastos extras de tu viaje:","ModalError",function(){ 
             
            CargarTablaGastosExtras(parametros);
            actualizando_pizzarras_gastos_extras(true,data.get('Gastos_Extras'))
            $("#selc_todo_gast_ext"). attr("disabled",true)
             
         })
         
         
        }
     
  
    })
   
    //Boton para que en la tabla de gastos vuelvan a aparecer todos disponibles pero se mantengan seleccioanods los que tu habias elegido antes
   .on("click","button[id='gastos_extras_incompletos']",function(e){
        e.preventDefault();
        var data = filas_seleccionadas(tabla_Gastos_Extras)
        data.append('action','gastos_extras_incompletos')
        //console.log(data.get('lista'))
    
        var parametros ={
         'action':data.get('action'),
         'lista':data.get('lista'),
         }
        if(!data.get('lista')==''){
         enviar_con_ajax(window.location.pathname,data,'Atento!',"Estas a punto de volver para editar tu inventario de viaje:","ModalError",function(){ 
             
            CargarTablaGastosExtras(parametros);
            actualizando_pizzarras_gastos_extras(false,data.get('Gastos_Extras'))
            $("#selc_todo_gast_ext"). attr("disabled",false) 
         })
         }
      
    })
    
    .on("click","button[rel='detail']",function(){ 

    var tr = tabla_Gastos_Extras.cell( $(this).closest("td","li")).index(); // capturamos la fila
    var data = tabla_Gastos_Extras.row(tr.row).data(); // Guardamos el objeto que habia en esa fila en data
    
    
        
        var nombre = data.Nombre 
        var dinero = data.Cantidad_de_dinero
        var notas = data.notas

        console.log(notas)
        $('.nombre').html(nombre);
        $('.cant_dinero').html(dinero);
        $('.notas').html(notas);
        $( "#notas_modal" ).val(notas)
        $("#InfoGastoExtraModal").modal("show");
    
    
    
    
    }) 

    //Boton para seleccionar todos los datos de la tabla
   .on("change","input[rel='seleccionar_todo']",function(){
    $("input[rel='seleccion2']").prop('checked', $(this).prop("checked"));
    actualizar_texto_footer_contador(tabla_Gastos_Extras,'contador_de_gastos','Gastos Seleccionados: ')
    
  
   })

    .on("change","input[rel='seleccion2']",function(){
        actualizar_texto_footer_contador(tabla_Gastos_Extras,'contador_de_gastos','Gastos Seleccionados: ')
    })


    //Funcionamientos para que se actualizen las pizarras luego de colocar el costo del pasaje
    var valor_pasajes_anterior,valor_pasajes_actual;

    $('#id_Gasto_total_en_pasajes').focus(function() {
        valor_pasajes_anterior = $(this).val();
        if(!valor_pasajes_anterior){valor_pasajes_anterior=0}
        })
 
    
    $("#id_Gasto_total_en_pasajes").change(function() {

        valor_pasajes_actual= parseFloat($( "#id_Gasto_total_en_pasajes" ).val())

        if(!valor_pasajes_actual){valor_pasajes_actual=0}
        var gananc = parseFloat($( "#id_Ganancia" ).val())
        var total_invertido = parseFloat($( "#id_Dinero_Total_Invertido" ).val())



        $( "#id_Dinero_Total_Invertido" ).val(total_invertido - parseFloat(valor_pasajes_anterior) + valor_pasajes_actual)
        $( "#id_Ganancia" ).val(gananc + parseFloat(valor_pasajes_anterior) - valor_pasajes_actual)
        
        


    });

    
    
    $("#form").on("submit",function(e){
        e.preventDefault();
        parametros = new FormData(this);
        parametros.append('action',"editar_envio");

        data_inventario=filas_seleccionadas(tabla_Envios)
        data_gastos_extras=filas_seleccionadas(tabla_Gastos_Extras)

        parametros.append('inventario',data_inventario.get('lista'))
        parametros.append('gastos_extras',data_gastos_extras.get('lista'))

        

        enviar_con_ajax(window.location.pathname,parametros,'Estas a punto de editar este envio!',"Desea continuar?","ModalError",function(){
            location.href =url_ok;

        })
    })
})