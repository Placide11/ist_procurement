from rest_framework import serializers
from .models import PurchaseRequest

class PurchaseRequestSerializer(serializers.ModelSerializer):
    requester_name = serializers.ReadOnlyField(source='requester.username')

    class Meta:
        model = PurchaseRequest
        fields = [
            'id', 'title', 'description', 'amount', 'currency', 
            'requester', 'requester_name', 'status', 'rejection_reason',
            'proforma_file', 'purchase_order_file', 'receipt_file',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'requester', 'status', 'rejection_reason', 
            'purchase_order_file', 'created_at', 'updated_at'
        ]

    def create(self, validated_data):
        return super().create(validated_data)