# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('savepablo', '0019_auto_20160418_1825'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='cost',
            field=models.DecimalField(default=0, max_digits=100, decimal_places=0),
        ),
        migrations.AlterField(
            model_name='item',
            name='mps',
            field=models.DecimalField(default=0, max_digits=100, decimal_places=0),
        ),
        migrations.AlterField(
            model_name='mitem',
            name='cost',
            field=models.DecimalField(default=0, max_digits=100, decimal_places=0),
        ),
        migrations.AlterField(
            model_name='mitem',
            name='mps',
            field=models.DecimalField(default=0, max_digits=100, decimal_places=0),
        ),
    ]
