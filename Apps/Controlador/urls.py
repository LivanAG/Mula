from django.contrib import admin
from django.urls import path,include
from .views import *

app_name = "Controlador"

urlpatterns = [
    path('', IndexdView.as_view(),name='index'),
    path('Dashboard', DashboardView.as_view(),name='dashboard'),

    ##### Mulas #####
    path('Lista_Mulas', ListaMulaView.as_view(),name='lista_de_mulas'),
    path('Editar_Mula/<str:pk>', EditarMulaView.as_view(),name='editar_mula'),
    path('Detail_Mula/<str:pk>', DetailMula.as_view(),name='detalles_mula'),

    ##### Objeto #####
    path('Lista_Objetos', ListaObjetosView.as_view(),name='lista_de_objetos'),
    

    ##### Gasto Extra #####
    path('Lista_Gastos_Extras', ListaGastosExtrasView.as_view(),name='lista_gastos_extra'),
    path('Crear_Gasto_Extra', CrearGastoExtraeView.as_view(),name='crear_gasto_extra'),

    ##### Envios #####
    path('Lista_Envios', ListaEnvioView.as_view(),name='lista_de_envios'),
    path('Crear_Envio', CrearEnvioView.as_view(),name='crear_envio'),
    path('Detail_Envio/<str:pk>', DetailEnvioView.as_view(),name='detalles_envio'),
    path('Editar_Envio/<str:pk>', EditarEnvioView.as_view(),name='editar_envio')
    
    #path('Prueba/', ArticleView.as_view(),name='prueba'),
]

