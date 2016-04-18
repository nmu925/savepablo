# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('savepablo', '0017_myuser_blah'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='myuser',
            name='blah',
        ),
    ]
