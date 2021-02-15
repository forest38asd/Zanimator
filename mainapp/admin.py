from django.contrib import admin
from .models import Category, Record


class RecordAdmin(admin.ModelAdmin):
    """docstring for RecordAdmin."""
    list_display = [field.name for field in Record._meta.fields]
    list_filter = ['user_id', 'date_end']
    search_fields = ['user_id']

    class Meta:
        model = Record


class CategoryAdmin(admin.ModelAdmin):
    """docstring for RecordAdmin."""
    list_display = [field.name for field in Category._meta.fields]
    list_filter = ['user_id']
    search_fields = ['user_id']

    class Meta:
        model = Category


admin.site.register(Category, CategoryAdmin)
admin.site.register(Record, RecordAdmin)
