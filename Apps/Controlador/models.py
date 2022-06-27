from django.db import models
import uuid
# Create your models here.




class Mula(models.Model):
    token = models.UUIDField(primary_key=True,editable=False,blank=True) 
    Nombre = models.CharField(max_length=30)
    Telefono = models.IntegerField(null=True,blank=True)
    CantidadDeEnviosRealizados = models.IntegerField(null=True,blank=True,default=0)

    def __str__(self):
        return self.Nombre
    
    def save(self,*args,**kwargs):
        if self.pk is None:
            self.token = uuid.uuid4()
        super().save(*args,**kwargs)

 
class Objeto(models.Model):

    
    token = models.UUIDField(primary_key=True,editable=False,blank=True) 
    Nombre = models.CharField(max_length=30)
    PrecioDeCompra = models.FloatField(null=True,blank=True,default=0)
    PrecioDeVenta = models.FloatField(null=True,blank=True,default=0)

    def __str__(self):
        return self.Nombre

    def save(self,*args,**kwargs):
        if self.pk is None:
            self.token = uuid.uuid4()
        super().save(*args,**kwargs)

class Gasto_Extra(models.Model):

    
    token = models.UUIDField(primary_key=True,editable=False,blank=True) 
    Nombre = models.CharField(max_length=30)
    Cantidad_de_dinero = models.FloatField(null=True,blank=True,default=0)
    notas = models.TextField(null=True,blank=True,max_length=99999)

    def __str__(self):
        return self.Nombre

    def save(self,*args,**kwargs):
        if self.pk is None:
            self.token = uuid.uuid4()
        super().save(*args,**kwargs)


class Inventario(models.Model):

    token = models.UUIDField(primary_key=True,editable=False,blank=True) 
    

    def save(self,*args,**kwargs):
        if self.pk is None:
            self.token = uuid.uuid4()
        super().save(*args,**kwargs)


class Pack(models.Model):

    
    token = models.UUIDField(primary_key=True,editable=False,blank=True) 
    objeto=models.ForeignKey(Objeto,on_delete=models.CASCADE)
    Cantidad_de_ejemplares = models.PositiveBigIntegerField(null=True,blank=True,default=0)
    Inventario =  models.ForeignKey(Inventario,on_delete=models.CASCADE)



    def save(self,*args,**kwargs):
        if self.pk is None:
            self.token = uuid.uuid4()
        super().save(*args,**kwargs)





class Envio(models.Model):

    
    token = models.UUIDField(primary_key=True,editable=False,blank=True) 
    Nombre = models.CharField(max_length=30)
    Inventario =  models.ForeignKey(Inventario,blank=True,null=True,on_delete=models.SET_NULL)

    Mula =  models.ForeignKey(Mula,blank=True,null=True,on_delete=models.SET_NULL)

    Gastos_extras =  models.ManyToManyField(Gasto_Extra)
    Gasto_total_en_pasajes= models.FloatField(null=True,blank=True,default=0)
    Dinero_Total_obtenido = models.FloatField(null=True,blank=True,default=0)
    Dinero_Total_Invertido = models.FloatField(null=True,blank=True,default=0)
    Ganancia = models.FloatField(null=True,blank=True,default=0)
    notas = models.TextField(null=True,blank=True,max_length=99999)
    Fecha = models.DateField(null=True,blank=True)
    


    def __str__(self):
        return self.Nombre

    def save(self,*args,**kwargs):
        if self.pk is None:
            self.token = uuid.uuid4()
        super().save(*args,**kwargs)



