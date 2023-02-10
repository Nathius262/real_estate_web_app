from django.db import models
from PIL import Image
import os
from django.conf import settings
from mptt.models import MPTTModel, TreeForeignKey
from autoslug import AutoSlugField
from django.urls import reverse
# Create your models here.

def upload_location(instance, filename):
    file_path = 'property/{id}/{name}.jpeg'.format(
        id=instance.id, name=instance.name, filename=filename
    )
    full_path = os.path.join(settings.MEDIA_ROOT, file_path)
    if os.path.exists(full_path):
        os.remove(full_path)
    return file_path

class Category(MPTTModel):
    tag = models.CharField(max_length=100)
    parent = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name="category_parent")
    date_updated = models.DateTimeField(auto_now=True,)

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return self.tag


class Estate(models.Model):
    name = models.CharField(max_length=150, verbose_name="Estate_name", blank=False, null=True)
    image = models.ImageField(upload_to=upload_location)
    category = models.ManyToManyField(Category, blank=False)
    price = models.DecimalField(max_digits=15, decimal_places=2)
    description =models.TextField(blank=False, null=True)
    bedroom = models.PositiveIntegerField(verbose_name="No bedroom", default=1)
    bathroom = models.PositiveIntegerField(verbose_name="No bathroom", default=1)
    toilet = models.PositiveIntegerField(verbose_name="No toilet", default=1)
    slug = AutoSlugField(populate_from="name", unique=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = (
            '-date_updated',
            '-date_created',
            '-name',
        )

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('property:property_detail', args=[self.slug])