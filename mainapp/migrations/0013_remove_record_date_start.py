# Generated by Django 3.1.4 on 2021-02-01 16:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0012_auto_20210201_1738'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='record',
            name='date_start',
        ),
    ]
