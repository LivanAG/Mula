
from dataclasses import field, fields
from django import forms
from .models import *
from django.forms import ModelForm
from datetime import datetime,timedelta,timezone

class MulaForm(ModelForm):

    def __init__(self,*args,**kwargs):
        super().__init__(*args,**kwargs)
        for i in self.visible_fields():
            i.field.widget.attrs['class'] = 'form-control'

    class Meta:
        model = Mula
        fields =["Nombre","Telefono"]

        widgets = {

            'Nombre': forms.TextInput(attrs={
                'placeholder': 'Nombre',
                'autocomplete':'off'}),

            'Telefono': forms.NumberInput(attrs={
                'placeholder': 'Telefono',
                'autocomplete':'off'}),
                'min': 0,

            

        }
       


class EditarMulaForm(forms.Form):
    def __init__(self,*args,**kwargs):
        super().__init__(*args,**kwargs)
        for i in self.visible_fields():
            i.field.widget.attrs['class'] = 'form-control'


class EnvioForm(ModelForm):

    def __init__(self,*args,**kwargs):
        super().__init__(*args,**kwargs)
        for i in self.visible_fields():
            i.field.widget.attrs['class'] = 'form-control'

    class Meta:
        model = Envio
        fields =["Nombre","Dinero_Total_Invertido","Gasto_total_en_pasajes","Dinero_Total_obtenido","Ganancia","notas","Fecha",'Mula']

        widgets = {

            'Nombre': forms.TextInput(attrs={
                'placeholder': 'Nombre',
                'autocomplete':'off'}),

            'Gasto_total_en_pasajes': forms.NumberInput(attrs={
                'placeholder': '',
                'autocomplete':'off'}),
                'min': 0,

            'Dinero_Total_obtenido': forms.NumberInput(attrs={
                'placeholder': '',
                'autocomplete':'off'}),
            
            'Dinero_Total_Invertido': forms.NumberInput(attrs={
                'placeholder': '',
                'autocomplete':'off'}),

            'Ganancia': forms.NumberInput(attrs={
                'placeholder': '',
                'autocomplete':'off'}),
            
            'Fecha': forms.DateInput(attrs={
                'placeholder': '',
                'autocomplete':'off'})

        }

    def clean(self):
        cleaned_data = super().clean()
        


class CrearObjetoForm(ModelForm):
    def __init__(self,*args,**kwargs):
        super().__init__(*args,**kwargs)
        for i in self.visible_fields():
            i.field.widget.attrs['class'] = 'form-control'
    class Meta:
        model = Objeto
        fields =["Nombre","PrecioDeCompra","PrecioDeVenta"]

        widgets = {

            'Nombre': forms.TextInput(attrs={
                'placeholder': 'Nombre',
                'autocomplete':'off'}),

            'PrecioDeCompra': forms.NumberInput(attrs={
                'placeholder': '',
                'autocomplete':'off'}),

            'PrecioDeVenta': forms.NumberInput(attrs={
                'placeholder': '',
                'autocomplete':'off'}),

        }

    def clean(self):
        cleaned_data = super().clean()     



class CrearGastoForm(ModelForm):
    def __init__(self,*args,**kwargs):
        super().__init__(*args,**kwargs)
        for i in self.visible_fields():
            i.field.widget.attrs['class'] = 'form-control'
    class Meta:
        model = Gasto_Extra
        fields =["Nombre","Cantidad_de_dinero","notas"]

        widgets = {

            'Nombre': forms.TextInput(attrs={
                'placeholder': 'Nombre',
                'autocomplete':'off'}),

            'Cantidad_de_dinero': forms.NumberInput(attrs={
                'placeholder': '',
                'autocomplete':'off'}),

            'notas': forms.Textarea(attrs={
                'placeholder': '',
                'autocomplete':'off'}),

        }

    def clean(self):
        cleaned_data = super().clean()     

    
