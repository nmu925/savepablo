# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('savepablo', '0016_auto_20160404_1833'),
    ]

    operations = [
        migrations.AddField(
            model_name='myuser',
            name='blah',
            field=models.BooleanField(default=0),
        ),
    ]
