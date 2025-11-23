from django.contrib import admin
from .models import PurchaseRequest


@admin.register(PurchaseRequest)
class PurchaseRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'requester',
                    'amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('title', 'requester__username')
    readonly_fields = ('created_at', 'updated_at')
