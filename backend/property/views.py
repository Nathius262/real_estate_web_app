from django.shortcuts import render
from rest_framework.viewsets import generics, mixins
from rest_framework.response import Response
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import EstateSerializers
from .models import Estate
# Create your views here.


class EstateViewSet(generics.ListAPIView, mixins.RetrieveModelMixin, mixins.ListModelMixin):
    serializer_class = EstateSerializers
    queryset =Estate.objects.all()
    lookup_field ='slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]

    filterset_fields = ['bedroom', 'toilet', 'bathroom', 'price']
    search_fields = ['name', 'description', 'bedroom', 'toilet', 'bathroom', 'price']
    
    def get(self, request, slug=None):
        if slug:
            return self.retrieve(request)
        else:
            return self.list(request)