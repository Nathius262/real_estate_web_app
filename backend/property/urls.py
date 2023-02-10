from django.urls import path
from .views import EstateViewSet

app_name = 'property'

urlpatterns = [
    path('property/', EstateViewSet.as_view()),
    path('property/<str:slug>', EstateViewSet.as_view(), name="property_detail"),
]
