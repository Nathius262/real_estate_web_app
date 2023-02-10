from django.contrib import admin
from .models import Estate, Category
from mptt.admin import DraggableMPTTAdmin

# Register your models here.
class EstateAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'date_created']
    list_filter = ['date_created', 'date_updated', 'bedroom', 'toilet', 'bathroom']


class CategoryAdmin(DraggableMPTTAdmin):
    mptt_indent_field = "category"
    list_display = (
        'tree_actions', 'indented_title', 'related_products_count',
        'related_products_cumulative_count'
    )
    list_display_links = ('indented_title',)

    def get_queryset(self, request):
        qs = super().get_queryset(request)

        qs = Category.objects.add_related_count(
            qs,
            Estate,
            'category',
            'products_cumulative_count',
            cumulative = True
        )
        
        qs = Category.objects.add_related_count(
            qs,
            Estate,
            'category',
            'products_count',
            cumulative = False
        )
        return qs

    def related_products_count(self, instance):
        return instance.products_count
    related_products_count.short_description = 'Related Estate(for this specific category)'

    def related_products_cumulative_count(self, instance):
        return instance.products_cumulative_count
    related_products_cumulative_count.short_description = 'Related Estate (in tree)'
 

admin.site.register(Estate, EstateAdmin)
admin.site.register(Category, CategoryAdmin)