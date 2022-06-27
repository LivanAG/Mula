$(function(){

    

    $("#form").on("submit",function(e){
        e.preventDefault();
        parametros = new FormData(this);
        parametros.append('action',"editar_mula");

        enviar_con_ajax(window.location.pathname,parametros,'Cuidado!',"Esta a punto de editar esta Mula:","ModalError",function(){
            location.href =url_ok;

        })
    })
       




})