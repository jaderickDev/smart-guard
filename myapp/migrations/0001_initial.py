# Generated by Django 5.0.7 on 2024-07-30 02:11

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='TrashAlert',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('detected_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('frame_image', models.ImageField(upload_to='alerts/')),
            ],
        ),
    ]
