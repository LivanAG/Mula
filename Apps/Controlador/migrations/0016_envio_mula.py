# Generated by Django 3.2.4 on 2022-06-25 14:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Controlador', '0015_envio_fecha'),
    ]

    operations = [
        migrations.AddField(
            model_name='envio',
            name='Mula',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='Controlador.mula'),
        ),
    ]
