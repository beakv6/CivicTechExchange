# -*- coding: utf-8 -*-
# Generated by Django 1.11.28 on 2020-04-24 21:59
from __future__ import unicode_literals

import democracylab.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('democracylab', '0005_auto_20190503_2237'),
    ]

    operations = [
        migrations.AddField(
            model_name='contributor',
            name='qiqo_uuid',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='contributor',
            name='uuid',
            field=models.CharField(default=democracylab.models.generate_uuid, max_length=32),
        ),
    ]
