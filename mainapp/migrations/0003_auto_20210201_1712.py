# Generated by Django 3.1.4 on 2021-02-01 16:12

from django.db import migrations, models
import django.utils.timezone
from datetime import timedelta


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0002_category_goal'),
    ]

    operations = [
        migrations.AddField(
            model_name='record',
            name='date_end',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='record',
            name='date_start',
            field=models.DateTimeField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='record',
            name='duration',
            field=models.DurationField(default=timedelta(minutes=0)),
            preserve_default=False,
        ),
    ]