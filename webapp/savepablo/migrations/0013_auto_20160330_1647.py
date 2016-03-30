# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('savepablo', '0012_auto_20160330_1405'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='p1',
            field=models.OneToOneField(related_name='+', to='savepablo.MyUser'),
        ),
        migrations.AlterField(
            model_name='game',
            name='p2',
            field=models.OneToOneField(related_name='+', to='savepablo.MyUser'),
        ),
        migrations.AlterField(
            model_name='myuser',
            name='friends',
            field=models.ManyToManyField(related_name='friends_rel_+', to='savepablo.MyUser'),
        ),
    ]
