# Generated by Django 3.1.4 on 2021-02-01 16:33

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0009_auto_20210201_1733'),
    ]

    operations = [
        migrations.AlterField(
            model_name='record',
            name='duration',
            field=models.DurationField(default=datetime.timedelta(seconds=1200)),
        ),
    ]