# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-03-26 22:51
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('savepablo', '0003_auto_20160326_1850'),
    ]

    operations = [
        migrations.AddField(
            model_name='myuser',
            name='mps',
            field=models.DecimalField(blank=True, decimal_places=1, default=0, max_digits=100),
        ),
    ]