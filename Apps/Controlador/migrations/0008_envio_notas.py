# Generated by Django 3.2.4 on 2022-03-14 21:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Controlador', '0007_auto_20220314_1717'),
    ]

    operations = [
        migrations.AddField(
            model_name='envio',
            name='notas',
            field=models.TextField(blank=True, max_length=99999, null=True),
        ),
    ]
