# Generated by Django 3.2.4 on 2022-03-10 19:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Controlador', '0003_auto_20220310_1451'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='mula',
            name='id',
        ),
        migrations.AlterField(
            model_name='mula',
            name='token',
            field=models.UUIDField(blank=True, default=1, editable=False, primary_key=True, serialize=False),
            preserve_default=False,
        ),
    ]
