from lib2to3.pgen2 import token
from django.db.models.functions import Coalesce
from operator import invert
from re import template
import re
from site import ENABLE_USER_SITE
from struct import pack
from turtle import pen
from django.views.generic import TemplateView,FormView,ListView,CreateView,DeleteView,DetailView
from .models import *
from .forms import *
from django.http import JsonResponse
from django.views.decorators.csrf  import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import HttpResponseRedirect
from django.urls  import reverse_lazy
from django.shortcuts import render,redirect
import json
from django.contrib.auth.mixins import LoginRequiredMixin
from datetime import datetime
#funcion para obtener los packs de un envio
def getPacks(envio):
    data=[]

    inventario = envio.Inventario
                
    for i in Pack.objects.filter(Inventario=inventario):
        data.append(i)
    
    return data


#Funcion para eliminar una o varias mulas
def DeleteMulaFunction(data):

    datos_for_return =[]
    datos=[]
    #conviertes la data en una lista(ya que al venir esa data de un objeto json por ajax viene como str y hay que convertirla con el metodo split)
    lista= data.split(',')
    
    #Analizamos que la lista tenga algo, en caso de tenerlo lo eliminamos    
    if len(data) == 0:
        pass 
    else:
        for i in lista:
            mula = Mula.objects.get(pk=i)
            envios = Envio.objects.filter(Mula=mula)
            
            if envios:
                for k in envios:
                    datos.append(k)
            else:
                mula.delete()
            
            if datos:
                datos_for_return.append({'mula':mula.Nombre,'envios':datos})
                datos=[]
        
        return datos_for_return

    
    
#Funcion para eliminar uno o varios envios
def DeleteEnvioFunction(data):

    #conviertes la data en una lista(ya que al venir esa data de un objeto json por ajax viene como str y hay que convertirla con el metodo split)
    lista= data.split(',')
    
    #Analizamos que la lista tenga algo, en caso de tenerlo lo eliminamos    
    if len(data) == 0:
        pass 
    else:
        for i in lista:
            
            envio = Envio.objects.get(pk=i)
            
            inventario = Inventario.objects.get(pk=envio.Inventario.token)

            RestaroSumarViajeALaMula(False,envio.Mula)

        
            envio.delete()


            #eliminando el inventario asociado al envio
            inventario.delete()
            

#Funcion para eliminar uno o varios objetos
def DeleteObjetoFunction(data):

    #conviertes la data en una lista(ya que al venir esa data de un objeto json por ajax viene como str y hay que convertirla con el metodo split)
    lista= data.split(',')
    
    datos=[]
    datos_for_return=[]
    #Analizamos que la lista tenga algo, en caso de tenerlo lo eliminamos    
    if len(data) == 0:
        pass 
    else:
        for i in lista:
            
            #En este ciclo analizamos que los objetos que fueron seleccionados para eliminar no esten asociados a ningun envio
            #Si estan asociados a alguno pues no eliminamos y lo informamos para que el usuario tome las acciones pertinentes 
            obj = Objeto.objects.get(pk=i)
            
            pack = Pack.objects.filter(objeto=obj)

            

            for k in pack:
                x = Envio.objects.get(Inventario=k.Inventario)
                datos.append(x)
            
            if datos:
                datos_for_return.append({'objeto':obj.Nombre,'envios':datos})
                datos=[]
            else:
                obj.delete()
                

        
            if datos_for_return:
              
                return datos_for_return
                
  
            else:
                return False




def RestaroSumarViajeALaMula(restar_o_sumar,mula):
    mula = mula
    if restar_o_sumar:
        
        mula.CantidadDeEnviosRealizados += 1
        
    else:
        mula.CantidadDeEnviosRealizados -= 1
    
    mula.save()

    



def procesar_datos(data,tipo,estado):
    
    data_return=[]
    #Aqui los meto dentro de una lista de python especificando que donde quiera que vea un ' ,' es un elemento nuevo
    #El espacio antes de la coma es porque como son diccionarios puede haber muchas comas 
    #entonces configure que me enviara los elementos con un espaciado por medio para poder identificar 
    #que , es la de dentro de un diccionario y que , es la que divide un elemento de otro
    lista= data.split(' ,')
    listaDict=[]

    #Aqui convierto los diccionarios que vienen en str en dicts de python para poder acceder a sus datos
    for j in lista:
        listaDict.append(json.loads(j))



        #si estado == true hacemos referencia que estamos cerrando el registro (de inventario o gastos extras)
        #si estado == false hacemos referencia que estamos abriendo el registro (de inventario o gastos extras)

        # si tipo == true hacemos referencia al trabajo con el inventario
        # si tipo == false hacemos referencia al trabajo con los gastos extras


    if estado:


        #ESTADO = TRUE TIPO = TRUE, CERRANDO INVENTARIO
        if tipo:
            for j in listaDict:
                for i in Objeto.objects.filter(token = j["token"]).values():
                    i['cantidad']=j["cantidad"]
                    i['listo']=True
                    #Pack.objects.create(objeto_id=i['token'],Cantidad_de_ejemplares=i['cantidad'])
                    data_return.append(i)
        
        #ESTADO = TRUE TIPO = FALSE, CERRANDO GASTOS EXTRAS
        else:

            for j in listaDict:
                for i in Gasto_Extra.objects.filter(token = j["token"]).values():
                    i['listo']=True
                    data_return.append(i)
    

    else:

        #ESTADO = FALSE TIPO = TRUE, ABRIENDO INVENTARIO    
        if tipo:

                datos_que_se_encontraban_seleccionados=[]

                for j in listaDict:
                    for i in Objeto.objects.filter(token = j["token"]).values():
                            i['cantidad']=j["cantidad"]
                            i['listo']=False
                            datos_que_se_encontraban_seleccionados.append(i)


                

                todos=[]
                for i in Objeto.objects.all().values():
                    todos.append(i)

                
                for i in todos:
                    for k in datos_que_se_encontraban_seleccionados:
                        if i["token"]==k["token"]:                                                       
                            i['cantidad']=k["cantidad"]
                            i['listo']=False

                data_return=todos
        
        #ESTADO = FALSE TIPO = FALSE, ABRIENDO GASTOS EXTRAS
        else:

            datos_que_se_encontraban_seleccionados=[]

            for j in listaDict:
                for i in Gasto_Extra.objects.filter(token = j["token"]).values():
                        i['cantidad']=j["cantidad"]
                        i['listo']=False
                        datos_que_se_encontraban_seleccionados.append(i)


            

            todos=[]
            for i in Gasto_Extra.objects.all().values():
                todos.append(i)

            
            for i in todos:
                for k in datos_que_se_encontraban_seleccionados:
                    if i["token"]==k["token"]:                                                       
                        i['cantidad']='0'
                        i['listo']=False

            data_return=todos



    return data_return





#Vista Index
class IndexdView (TemplateView):
    template_name= 'Controlador/index.html'


#Vista principal
class DashboardView (TemplateView):
    template_name= 'Controlador/dashboard.html' 

    def get_dinero_mensual(self):
        data=[]
        suma_total=0
        year = datetime.now().year

        for m in range(1,13):
            total = Envio.objects.filter(Fecha__year=year,Fecha__month=m)
            data.append(total)
       
        
        for i in range(0,len(data)):
            if data[i]:
                for k in data[i]:
                    suma_total += k.Ganancia
                data[i]= suma_total
                suma_total=0

            else:
                data[i]=0
            

        return data

    def get_cantidad_total_de_envios(self):
        datos = Envio.objects.all()
        data = len(datos)
        return data

    def get_cantidad_total_de_mulas(self):
        datos = Mula.objects.all()
        data = len(datos)
        return data

    def get_cantidad_total_de_ganancia(self):
        datos = Envio.objects.all()
        ganancia_total =0
        if datos:
            for i in datos:
                ganancia_total += i.Ganancia
      
        return ganancia_total

    def get_cantidad_total_de_inversion(self):
        datos = Envio.objects.all()
        inversion_total =0
        if datos:
            for i in datos:
                inversion_total += i.Dinero_Total_Invertido
      
        return inversion_total

            


    def get_context_data(self,*args,**kwargs):
        context=super().get_context_data(*args,**kwargs)
        context['x']=self.get_dinero_mensual()
        context['cant_envios']=self.get_cantidad_total_de_envios()
        context['cant_mulas']=self.get_cantidad_total_de_mulas()
        context['cant_ganancia']=self.get_cantidad_total_de_ganancia()
        context['cant_invertida']=self.get_cantidad_total_de_inversion()
        
        return context














####### MULAS #######

#Vista que muestra nuestra lista de mulas y las opciones correspondientes con estas
class ListaMulaView (LoginRequiredMixin,ListView):
    template_name= 'Controlador/Mulas/lista_mulas.html'  
    model = Mula
    context_object_name="lista_mulas"

    def get_context_data(self,*args,**kwargs):
        context=super().get_context_data(*args,**kwargs)
        context['form']=MulaForm()
        return context

    #Desactivamos la proteccion csrf_exempt porque al venir la info por ajax no viene con esa proteccion
    @method_decorator(csrf_exempt)
    def dispatch(self,request,*args,**kwargs):
        return super().dispatch(request,*args,**kwargs)



    def post(self,request,*args,**kwargs):
        data=[]
        try:

            #Metodo para cargar nuestra tabla con los datos de la base de datos
            if request.POST['action'] == 'listar':

                for i in Mula.objects.all().values():
                    data.append(i)
               
            #Metodo para cargar nuestra tabla con los datos de la base de datos
            elif request.POST['action'] == 'crear_mula':
                

                nombre = request.POST['Nombre']
                telefono = request.POST['Telefono']
                cantidadDeEnviosRealizados = 0

                mula = Mula.objects.create(
                            Nombre=nombre,
                            Telefono=telefono,
                            CantidadDeEnviosRealizados=cantidadDeEnviosRealizados
                            )
            
            
            #Metodo para eliminar las mulas seccionadas desde los checkbox
            elif request.POST['action'] == 'delete_mula':
                
                data = request.POST['lista']
                x = DeleteMulaFunction(data)

                if x:
                     
                    cadena_x=""
                    cadena="La mula: ("+ x[0]['mula'] + ") es la duena de los envios: "

                    for l in x[0]["envios"]:
                        cadena_x = cadena_x + "("+ l.Nombre +")"
                    

                    cadena_x_2=cadena + cadena_x
                    
                    data = {'error': {'xx': [cadena_x_2]}}     
                    
                      
            else:
               data = {'error': {'xx': ['No has seleccionado ninguna accion']}}

        except Exception as e:
            data ={"error":str(e)}

        


        return JsonResponse(data,safe=False)




#Vista para ver los detalles de una mula existente
class DetailMula(LoginRequiredMixin,DetailView):

    model = Mula
    template_name = 'Controlador/Mulas/detail_mula.html'
    context_object_name = 'mula'

    def get_context_data(self,*args,**kwargs):
        context=super().get_context_data(*args,**kwargs)
        context['url_ok']=reverse_lazy('Controlador:lista_de_mulas')
        return context

    @method_decorator(csrf_exempt)
    def dispatch(self,request,*args,**kwargs):
        return super().dispatch(request,*args,**kwargs)


    def post(self,request,*args,**kwargs):
        data=[]
        try:
            #Metodo para eliminar una mula en singular mediante la vista de detalles
            if request.POST['action'] == 'eliminar_mula':
                data = request.POST['lista']
                x = DeleteMulaFunction(data)  


                if x:
                     
                    cadena_x=""
                    cadena="La mula: ("+ x[0]['mula'] + ") es la duena de los envios: "

                    for l in x[0]["envios"]:
                        cadena_x = cadena_x + "("+ l.Nombre +")"
                    

                    cadena_x_2=cadena + cadena_x
                    
                    data = {'error': {'xx': [cadena_x_2]}}   

            else:
               data = {'error': {'xx': ['No has seleccionado ninguna accion']}}

        except Exception as e:
            data ={"error":str(e)}

        


        return JsonResponse(data,safe=False)



#Vista para editar datos de una mula existente
class EditarMulaView (LoginRequiredMixin,FormView):
    template_name= "Controlador/Mulas/editar_mulas.html"
    form_class=MulaForm

    def get_context_data(self, *args,**kwargs):
        context= super().get_context_data(*args,**kwargs)
        return context

    #Sobrescribimos el metodo get para que cuando carguemos la pagina nuestro form aparezca con los datos antes guardados de nuestra mula
    def get(self, request,pk ,*args, **kwargs):

      mula = Mula.objects.get(pk=pk)
      form = self.form_class(initial={
          'Nombre': mula.Nombre, 
          'Telefono':mula.Telefono,
          'CantidadDeEnviosRealizados':mula.CantidadDeEnviosRealizados
          })

    

      return render(request, self.template_name, {'form': form,'url_ok':reverse_lazy('Controlador:detalles_mula',kwargs={'pk': mula.token}),'token':mula.token})


    def post(self,request,pk,*args,**kwargs):
        data=[]
        try:
            #Metodo desde el cual editamos los valores de nuestra mula
            if request.POST['action'] == 'editar_mula':

                

                form = self.get_form()

                if form.is_valid():
                
                    
                    mula = Mula.objects.get(pk=pk)

                    #Obtenemos los nuevos valores de nuestro form
                    nombre= form.cleaned_data['Nombre']
                    telefono= form.cleaned_data['Telefono']
                    cantidadDeEnviosRealizados= form.cleaned_data['CantidadDeEnviosRealizados']
                    
                    #Sobreescribimos los nuevos valores de nuestro form con los anteriores de nuestra base de datos y guardamos 
                    mula.Nombre = nombre
                    mula.Telefono = telefono
                    mula.CantidadDeEnviosRealizados = cantidadDeEnviosRealizados
                    mula.save()

                    
                else:
                    data['error']=form.errors
                

               
            else:
               data = {'error': {'xx': ['No has seleccionado ninguna accion']}}

        except Exception as e:
            data ={"error":str(e)}

        


        return JsonResponse(data,safe=False)


####### END MULAS #######











####### OBJETO #######

#Funcion para eliminar uno o varios objetos
def DeleteObjetoFunction(data):

    #conviertes la data en una lista(ya que al venir esa data de un objeto json por ajax viene como str y hay que convertirla con el metodo split)
    lista= data.split(',')
    
    datos=[]
    datos_for_return=[]
    #Analizamos que la lista tenga algo, en caso de tenerlo lo eliminamos    
    if len(data) == 0:
        pass 
    else:
        for i in lista:
            
            #En este ciclo analizamos que los objetos que fueron seleccionados para eliminar no esten asociados a ningun envio
            #Si estan asociados a alguno pues no eliminamos y lo informamos para que el usuario tome las acciones pertinentes 
            obj = Objeto.objects.get(pk=i)
            
            pack = Pack.objects.filter(objeto=obj)

            

            for k in pack:
                x = Envio.objects.get(Inventario=k.Inventario)
                datos.append(x)
            
            if datos:
                datos_for_return.append({'objeto':obj.Nombre,'envios':datos})
                datos=[]
            else:
                obj.delete()
                

        
        if datos_for_return:
              
            return datos_for_return
                
  
        else:
            return False



#Vista que muestra nuestra lista de mulas y las opciones correspondientes con estas
class ListaObjetosView (LoginRequiredMixin,ListView):
    template_name= 'Controlador/Objeto/lista_objetos.html'  
    model = Objeto
    context_object_name="lista_objetos"

    def get_context_data(self,*args,**kwargs):
        context=super().get_context_data(*args,**kwargs)
        context['form']=CrearObjetoForm()
        return context

    #Desactivamos la proteccion csrf_exempt porque al venir la info por ajax no viene con esa proteccion
    @method_decorator(csrf_exempt)
    def dispatch(self,request,*args,**kwargs):
        return super().dispatch(request,*args,**kwargs)



    def post(self,request,*args,**kwargs):
        data=[]
        try:

            #Metodo para cargar nuestra tabla con los datos de la base de datos
            if request.POST['action'] == 'listar':

                for i in Objeto.objects.all().values():
                    data.append(i)


            #Metodo para cargar nuestra tabla con los datos de la base de datos
            elif request.POST['action'] == 'crear_objeto':
                

                nombre = request.POST['Nombre']
                precio_de_compra = request.POST['PrecioDeCompra']
                precio_de_venta = request.POST['PrecioDeVenta']

                obj = Objeto.objects.create(
                            Nombre=nombre,
                            PrecioDeCompra=precio_de_compra,
                            PrecioDeVenta=precio_de_venta
                            )
               
            
            #Metodo para eliminar las mulas seccionadas desde los checkbox
            elif request.POST['action'] == 'delete_objeto':
                
                data = request.POST['lista']
                x = DeleteObjetoFunction(data)

                if x:
                    
                    cadena_x=""
                    cadena="El objeto: ("+ x[0]['objeto'] + ") fue utilizado en el inventario de los envios: "

                    for l in x[0]["envios"]:
                        cadena_x = cadena_x + "("+ l.Nombre +")"
                    

                    cadena_x_2=cadena + cadena_x
                    
                    data = {'error': {'xx': [cadena_x_2]}}
                    
                else:
                    pass
                    
                      
            else:
               data = {'error': {'xx': ['No has seleccionado ninguna accion']}}

        except Exception as e:
            data ={"error":str(e)}

        


        return JsonResponse(data,safe=False)




####### END OBJETO #######









####### GASTO EXTRA #######

#Funcion para eliminar uno o varios objetos
def DeleteGastoFunction(data):

    #conviertes la data en una lista(ya que al venir esa data de un objeto json por ajax viene como str y hay que convertirla con el metodo split)
    lista= data.split(',')
    
    datos=[]
    datos_for_return=[]
    #Analizamos que la lista tenga algo, en caso de tenerlo lo eliminamos    
    if len(data) == 0:
        pass 
    else:
        for i in lista:
            
            #En este ciclo analizamos que los objetos que fueron seleccionados para eliminar no esten asociados a ningun envio
            #Si estan asociados a alguno pues no eliminamos y lo informamos para que el usuario tome las acciones pertinentes 
            gasto = Gasto_Extra.objects.get(pk=i)
            
            envios_a_los_que_pertenece_el_gasto = Envio.objects.filter(Gastos_extras=gasto)
            


            if envios_a_los_que_pertenece_el_gasto:
                    
                for m in envios_a_los_que_pertenece_el_gasto:
                    datos.append(m)
                
                datos_for_return.append({'gasto':gasto.Nombre,'envios':datos})
                datos=[]
            else:
                gasto.delete()



        if datos_for_return:
    
            return datos_for_return
    

        else:
            return False


class ListaGastosExtrasView (LoginRequiredMixin,ListView):
    template_name= 'Controlador/Gasto_Extra/lista_gastos_extras.html'  
    model = Gasto_Extra
    context_object_name="lista_gastos_extras"

    def get_context_data(self,*args,**kwargs):
        context=super().get_context_data(*args,**kwargs)
        context['form']=CrearGastoForm()
        return context

    #Desactivamos la proteccion csrf_exempt porque al venir la info por ajax no viene con esa proteccion
    @method_decorator(csrf_exempt)
    def dispatch(self,request,*args,**kwargs):
        return super().dispatch(request,*args,**kwargs)



    def post(self,request,*args,**kwargs):
        data=[]
        try:

            #Metodo para cargar nuestra tabla con los datos de la base de datos
            if request.POST['action'] == 'listar':

                for i in Gasto_Extra.objects.all().values():
                    data.append(i)


            #Metodo para cargar nuestra tabla con los datos de la base de datos
            elif request.POST['action'] == 'crear_gasto':
                

                nombre = request.POST['Nombre']
                cantidad_de_dinero = request.POST['Cantidad_de_dinero']
                notas = request.POST['notas']

                obj = Gasto_Extra.objects.create(
                            Nombre=nombre,
                            Cantidad_de_dinero=cantidad_de_dinero,
                            notas=notas
                            )
               
            
            #Metodo para eliminar los gastos seccionados desde los checkbox
            elif request.POST['action'] == 'delete_gasto':
                
                data = request.POST['lista']
                x = DeleteGastoFunction(data)

                print(x)
                if x:
                    
                    cadena_x=""
                    cadena="El gasto: ("+ x[0]['gasto'] + ") fue utilizado en los envios: "

                    for l in x[0]["envios"]:
                        cadena_x = cadena_x + "("+ l.Nombre +")"
                    

                    cadena_x_2=cadena + cadena_x
                    
                    data = {'error': {'xx': [cadena_x_2]}}
                    
                else:
                    pass
                    
                      
            else:
               data = {'error': {'xx': ['No has seleccionado ninguna accion']}}

        except Exception as e:
            data ={"error":str(e)}

        


        return JsonResponse(data,safe=False)




class CrearGastoExtraeView(LoginRequiredMixin,CreateView):
    model = Gasto_Extra
    fields = ['Nombre',"Cantidad_de_dinero",'notas']
    template_name= "Controlador/Envios/crear_gasto_extra.html"
    success_url = reverse_lazy("Controlador:Index")

####### END GASTO EXTRA #######








####### ENVIOS #######

#Vista que muestra nuestra lista de envios y las opciones correspondientes con estas
class ListaEnvioView (LoginRequiredMixin,ListView):
    template_name= 'Controlador/Envios/lista_envios.html'  
    model = Envio
    context_object_name="lista_envios"

    def get_context_data(self,*args,**kwargs):
        context=super().get_context_data(*args,**kwargs)
        return context

    #Desactivamos la proteccion csrf_exempt porque al venir la info por ajax no viene con esa proteccion
    @method_decorator(csrf_exempt)
    def dispatch(self,request,*args,**kwargs):
        return super().dispatch(request,*args,**kwargs)



    def post(self,request,*args,**kwargs):
        data=[]
        try:

            #Metodo para cargar nuestra tabla con los datos de la base de datos
            if request.POST['action'] == 'listar':

                for i in Envio.objects.all().values():
                    data.append(i)
               
            
            #Metodo para eliminar las mulas seccionadas desde los checkbox
            elif request.POST['action'] == 'delete_envio':
                
                data = request.POST['lista']
                DeleteEnvioFunction(data)
                      
                    
                      
            else:
               data = {'error': {'xx': ['No has seleccionado ninguna accion']}}

        except Exception as e:
            data ={"error":str(e)}

        


        return JsonResponse(data,safe=False)


#Vista para crear envio
class CrearEnvioView(LoginRequiredMixin,CreateView):
    model = Envio
    #fields = ['Nombre',"Inventario",'Gastos_extras','Hay_que_pagar_ida_y_vuelta',"Gasto_total_en_pasajes",'Dinero_Total_obtenido','Ganancia',"notas"]
    template_name= "Controlador/Envios/crear_envio.html"
    form_class = EnvioForm

    #Desactivamos la proteccion csrf_exempt porque al venir la info por ajax no viene con esa proteccion
    @method_decorator(csrf_exempt)
    def dispatch(self,request,*args,**kwargs):
        return super().dispatch(request,*args,**kwargs)

    def get_context_data(self,*args,**kwargs):
        context=super().get_context_data(*args,**kwargs)
        context['url_ok']=reverse_lazy('Controlador:lista_de_envios')
        return context
    
    def post(self,request,*args,**kwargs):
        data=[]
        try:

            #Metodo para cargar nuestra tabla con los datos de la base de datos
            if request.POST['action'] == 'listar':

                for i in Objeto.objects.all().values():
                    data.append(i)
                
        
                

            #Metodo para cargar nuestra tabla con los datos de la base de datos
            elif request.POST['action'] == 'listar_gastos_extras':

                for i in Gasto_Extra.objects.all().values():
                    data.append(i)
                
                
                
            
            #Metodo para cerrar el inventario
            elif request.POST['action'] == 'inventario_listo':
                
                #Aqui obtengo los datos(como vienen de java script,llegan en formato str)
                datos = request.POST['lista']
                
                datos_x = procesar_datos(datos,True,True)

                data = datos_x
                
                



            #Metodo para cerrar los gastos extras
            elif request.POST['action'] == 'gastos_extras_listos':
                
                
                #Aqui obtengo los datos(como vienen de java script,llegan en formato str)
                datos = request.POST['lista']
                datos_x = procesar_datos(datos,False,True)
                data = datos_x

                
                
                
                
            #Metodo para volver a abrir el inventario
            elif request.POST['action'] == 'inventario_incompleto':
                
                
                #Aqui obtengo los datos(como vienen de java script,llegan en formato str)
                datos = request.POST['lista']
                datos_x = procesar_datos(datos,True,False)
               
                data = datos_x
                
                

            #Metodo para volver a abrir los gastos extras
            elif request.POST['action'] == 'gastos_extras_incompletos':
                
                
                #Aqui obtengo los datos(como vienen de java script,llegan en formato str)
                datos = request.POST['lista']
                datos_x = procesar_datos(datos,False,False)

                  
                data = datos_x
                   
                

            elif request.POST['action'] == 'crear_envio':
                form = self.get_form()

                if form.is_valid():
                    #Aqui obtengo los datos(como vienen de java script,llegan en formato str)
                    datos_inventario = request.POST['inventario']
                    datos_gastos_extras = request.POST['gastos_extras']
                    lista_gastos_extras = []
                    
                    #Aqui analizamos si el envio tiene gastos extras 
                    if datos_gastos_extras:
                        datos_gast_ext = procesar_datos(datos_gastos_extras,False,True)
                        for i in datos_gast_ext:
                            gast_ext = Gasto_Extra.objects.get(token=i['token'])
                            lista_gastos_extras.append(gast_ext)


                    #aqui creamos el envio comprobando primero que se ha seleccionado un inventario correcto
                    if datos_inventario:
                        
                        #Procesamos los datos
                        datos_inv = procesar_datos(datos_inventario,True,True)

                        #Creamos el inventario que vamos a ascociar a nuestro envio y a nuestros packs
                        inventario = Inventario.objects.create()


                        #Creamos nuestros packs
                        for i in datos_inv:
                            pack = Pack.objects.create(objeto_id=i['token'],Cantidad_de_ejemplares=i["cantidad"],Inventario=inventario)
	


                        #Obtenemos la info para crear el envio luego
                        data_obt=form.cleaned_data
        

                        nombre = data_obt["Nombre"]
                        dinero_total_invertido=data_obt["Dinero_Total_Invertido"]
                        gasto_total_en_pasajes=data_obt["Gasto_total_en_pasajes"]
                        if(gasto_total_en_pasajes == False):
                            gasto_total_en_pasajes=0
                        dinero_total_obtenido=data_obt["Dinero_Total_obtenido"]
                        ganancia=data_obt["Ganancia"]
                        notas=data_obt["notas"]
                        fecha = data_obt["Fecha"]
                        mula = data_obt["Mula"]
                        

                        RestaroSumarViajeALaMula(True,mula)
                        #Creamos el envio
                        envio = Envio.objects.create(
                            Nombre=nombre,
                            Inventario=inventario,
                            Gasto_total_en_pasajes=gasto_total_en_pasajes,
                            Dinero_Total_obtenido=dinero_total_obtenido,
                            Dinero_Total_Invertido=dinero_total_invertido,
                            Ganancia=ganancia,
                            notas=notas,
                            Fecha=fecha,
                            Mula=mula

                            )

                        #Agregamos los gastos extras a nuestro envio en caso de tenerlos
                        if lista_gastos_extras:
                            for i in lista_gastos_extras:
                                envio.Gastos_extras.add(i)
                        

                            
                         
                    else:
                        data = {'error': {'xx': ['Debes crear tu inventario de viajes']}}
                    

                    

                    

                    

                    

                    

                    

                    
                    

                else:
                    data['error']=form.errors
                    
                

            else:
               data = {'error': {'xx': ['No has seleccionado ninguna accion']}}

        except Exception as e:
            data ={"error":str(e)}

        


        return JsonResponse(data,safe=False)


#Vista para ver los detalles de un envio existente
class DetailEnvioView(LoginRequiredMixin,DetailView):

    model = Envio
    template_name = 'Controlador/Envios/detail_envio.html'
    context_object_name = 'envio'

    def get_context_data(self,*args,**kwargs):
        envio = self.get_object()

        #Capturando los packs de mi envio y los gastos extras
        invent= envio.Inventario
        
        packs = Pack.objects.filter(Inventario = invent)

        gastos_extras = envio.Gastos_extras.all()

        context=super().get_context_data(*args,**kwargs)
        context['url_ok']=reverse_lazy('Controlador:lista_de_envios')
        context['packs']=packs
        context['gastos_extras']=gastos_extras

        return context

    @method_decorator(csrf_exempt)
    def dispatch(self,request,*args,**kwargs):
        return super().dispatch(request,*args,**kwargs)

    
    


    def post(self,request,*args,**kwargs):
        data=[]
        try:
            
            if request.POST['action'] == 'listar_inventario':
                envio = Envio.objects.filter(token=request.POST['token'])[0]
                
                packs=getPacks(envio)

                listado_objetos =[]

                for i in packs:
                    for k in Objeto.objects.filter(token=i.objeto.token).values():
                        k['cantidad']=i.Cantidad_de_ejemplares
                        listado_objetos.append(k)


                data = listado_objetos

                
            elif request.POST['action'] == 'listar_gastos_extras':
                envio = Envio.objects.filter(token=request.POST['token'])[0]
                gastos_extras = envio.Gastos_extras.all()
                for k in gastos_extras:
                    for i in Gasto_Extra.objects.filter(token=k.token).values():
                        data.append(i)
                
                

            #Metodo para eliminar una mula en singular mediante la vista de detalles
            elif request.POST['action'] == 'eliminar_envio':
                data = request.POST['lista']
                DeleteEnvioFunction(data)   

            else:
               data = {'error': {'xx': ['No has seleccionado ninguna accion']}}

        except Exception as e:
            data ={"error":str(e)}

        


        return JsonResponse(data,safe=False)


#Vista para editar datos de un envio existente
class EditarEnvioView (LoginRequiredMixin,FormView):
    template_name= "Controlador/Envios/editar_envios.html"
    form_class=EnvioForm


    #Desactivamos la proteccion csrf_exempt porque al venir la info por ajax no viene con esa proteccion
    @method_decorator(csrf_exempt)
    def dispatch(self,request,*args,**kwargs):
        return super().dispatch(request,*args,**kwargs)

    def get_context_data(self, *args,**kwargs):
        context= super().get_context_data(*args,**kwargs)

        return context

    #Sobrescribimos el metodo get para que cuando carguemos la pagina nuestro form aparezca con los datos antes guardados de nuestro envio
    def get(self, request,pk ,*args, **kwargs):

      envio = Envio.objects.get(pk=pk)
      form = self.form_class(initial={
          'Nombre': envio.Nombre, 
          'Gasto_total_en_pasajes':envio.Gasto_total_en_pasajes,
          'Dinero_Total_obtenido':envio.Dinero_Total_obtenido,
          'Dinero_Total_Invertido':envio.Dinero_Total_Invertido,
          'Ganancia':envio.Ganancia,
          'Fecha':envio.Fecha,
          'notas':envio.notas,
          'Mula':envio.Mula
          
          })

     

    

      return render(request, self.template_name, {'form': form,'url_ok':reverse_lazy('Controlador:detalles_envio',kwargs={'pk': envio.token}),'token':envio.token})


    def post(self,request,pk,*args,**kwargs):
        data=[]
        try:

            #Metodo para cargar nuestra tabla con los datos de la base de datos
            if request.POST['action'] == 'listar_inventario':
                envio = Envio.objects.filter(token=request.POST['token'])[0]
                
                packs=getPacks(envio)

                listado_objetos =[]

                for i in packs:
                    for k in Objeto.objects.filter(token=i.objeto.token).values():
                        k['cantidad']=i.Cantidad_de_ejemplares
                        k['listo']=True
                        listado_objetos.append(k)


                data = listado_objetos


            #Metodo para cargar nuestra tabla con los datos de la base de datos
            elif request.POST['action'] == 'listar_gastos_extras':

                envio = Envio.objects.filter(token=request.POST['token'])[0]

                
                gastos_extras = envio.Gastos_extras.all()

                if gastos_extras:
                    for k in gastos_extras:
                        for i in Gasto_Extra.objects.filter(token=k.token).values():
                            i['listo']=True
                            data.append(i)
                else:
                    for i in Gasto_Extra.objects.all().values():
                            i['listo']=False
                            data.append(i)
                



             #Metodo para cerrar el inventario
            elif request.POST['action'] == 'inventario_listo':
                
                #Aqui obtengo los datos(como vienen de java script,llegan en formato str)
                datos = request.POST['lista']
                
                datos_x = procesar_datos(datos,True,True)

                print("Inventario listo")
                print(datos_x)

                data = datos_x
                
                

            #Metodo para cerrar los gastos extras
            elif request.POST['action'] == 'gastos_extras_listos':
                
                
                #Aqui obtengo los datos(como vienen de java script,llegan en formato str)
                datos = request.POST['lista']
                datos_x = procesar_datos(datos,False,True)
                data = datos_x

                
            
            #Metodo para volver a abrir el inventario
            elif request.POST['action'] == 'inventario_incompleto':
                
                
                #Aqui obtengo los datos(como vienen de java script,llegan en formato str)
                datos = request.POST['lista']
                datos_x = procesar_datos(datos,True,False)
               
                data = datos_x
                

            #Metodo para volver a abrir los gastos extras
            elif request.POST['action'] == 'gastos_extras_incompletos':
                
                
                #Aqui obtengo los datos(como vienen de java script,llegan en formato str)
                datos = request.POST['lista']
                datos_x = procesar_datos(datos,False,False)

                  
                data = datos_x
                   





            elif request.POST['action'] == 'editar_envio':
                form = self.get_form()

                if form.is_valid():

                    #Aqui obtengo los datos(como vienen de java script,llegan en formato str)
                    datos_inventario = request.POST['inventario']
                    datos_gastos_extras = request.POST['gastos_extras']
                    lista_gastos_extras = []

                    

                    #Eliminamos los anteriores packs y el inventario antiguo
                    envio = Envio.objects.get(pk=pk)
                    inventario = envio.Inventario
                    
                    paks = Pack.objects.filter(Inventario=inventario)
                    for i in paks:
                        i.delete()

                    inventario.delete()



                   
                    #Aqui analizamos si el envio tiene gastos extras 
                    if datos_gastos_extras:
                        datos_gast_ext = procesar_datos(datos_gastos_extras,False,True)
                        for i in datos_gast_ext:
                            gast_ext = Gasto_Extra.objects.get(token=i['token'])
                            lista_gastos_extras.append(gast_ext)


                    #aqui creamos el envio comprobando primero que se ha seleccionado un inventario correcto
                    if datos_inventario:
                        
                        #Procesamos los datos
                        datos_inv = procesar_datos(datos_inventario,True,True)

                        #Creamos el inventario que vamos a ascociar a nuestro envio y a nuestros packs
                        inventario = Inventario.objects.create()


                        #Creamos nuestros packs
                        for i in datos_inv:
                            pack = Pack.objects.create(objeto_id=i['token'],Cantidad_de_ejemplares=i["cantidad"],Inventario=inventario)
	


                        #Obtenemos la info para editar el envio luego
                        data_obt=form.cleaned_data

                        nombre = data_obt["Nombre"]
                        dinero_total_invertido=data_obt["Dinero_Total_Invertido"]
                        gasto_total_en_pasajes=data_obt["Gasto_total_en_pasajes"]
                        if(gasto_total_en_pasajes == False):
                            gasto_total_en_pasajes=0
                        dinero_total_obtenido=data_obt["Dinero_Total_obtenido"]
                        ganancia=data_obt["Ganancia"]
                        notas=data_obt["notas"]
                        fecha = data_obt["Fecha"]
                        mula = data_obt["Mula"]

                        RestaroSumarViajeALaMula(True,mula)
                        RestaroSumarViajeALaMula(False,envio.Mula)

                        envio.Nombre = nombre
                        envio.Dinero_Total_Invertido = dinero_total_invertido
                        envio.Gasto_total_en_pasajes = gasto_total_en_pasajes
                        envio.Dinero_Total_obtenido = dinero_total_obtenido
                        envio.Ganancia = ganancia
                        envio.notas = notas
                        envio.Inventario = inventario
                        envio.Fecha = fecha
                        envio.Mula = mula
                        envio.save()
                        

                        

                        #Agregamos los gastos extras a nuestro envio en caso de tenerlos
                        if lista_gastos_extras:

                            if envio.Gastos_extras.all():
                                envio.Gastos_extras.clear()
                            
                            for i in lista_gastos_extras:
                                envio.Gastos_extras.add(i)  
                        else:
                            envio.Gastos_extras.clear()




                        

                            
                         
                    else:
                        data = {'error': {'xx': ['Debes crear tu inventario de viajes']}}
                        

                    
          

                else:
                    data['error']=form.errors



                

            #Metodo para cerrar el inventario
            elif request.POST['action'] == 'get_valores':
                
                envio = Envio.objects.filter(token=request.POST['token'])[0]
                
                packs=getPacks(envio)

              
                gasto_total_en_pasajes=envio.Gasto_total_en_pasajes
                dinero_obt=envio.Dinero_Total_obtenido
                dinero_inv=envio.Dinero_Total_Invertido
                ganancia=envio.Ganancia
                fecha=envio.Fecha

                datos={
                    "Gasto_total_en_pasajes":gasto_total_en_pasajes,
                    "Dinero_Total_obtenido":dinero_obt,
                    "Dinero_Total_Invertido":dinero_inv,
                    "Ganancia":ganancia,
                    "Fecha":fecha}
                data = datos
                
            else:
               data = {'error': {'xx': ['No has seleccionado ninguna accion']}}

        except Exception as e:
            data ={"error":str(e)}

        


        return JsonResponse(data,safe=False)

####### END ENVIOS #######