from rest_framework import serializers
from .models import Category, Estate

class EstateSerializers(serializers.ModelSerializer):

    category = serializers.SerializerMethodField()
    absolute_url = serializers.SerializerMethodField()

    class Meta:
        model = Estate
        exclude =['id']

    def get_category(self, obj):
        category_list = []
        for categories in obj.category.all():
            category_list.append(categories.tag)
        return category_list

    def get_absolute_url(self, obj):
        request = self.context['request']
        protocol = request.scheme
        host_name = request.get_host()
        path = obj.get_absolute_url()
        url = f'{protocol}://{host_name}{path}'
        return url