# Generated by Django 3.2.4 on 2022-06-23 13:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Controlador', '0014_alter_envio_inventario'),
    ]

    operations = [
        migrations.AddField(
            model_name='envio',
            name='Fecha',
            field=models.DateField(blank=True, null=True),
        ),
    ]
