from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class PurchaseRequest(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED_L1', 'Approved by Manager'),
        ('APPROVED_L2', 'Approved by Director'),
        ('REJECTED', 'Rejected'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    
    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='my_requests')
    approver_l1 = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_l1_requests')
    approver_l2 = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_l2_requests')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    rejection_reason = models.TextField(blank=True, null=True)

    proforma_file = models.FileField(upload_to='proformas/')
    extracted_data = models.JSONField(default=dict, blank=True)
    
    purchase_order_file = models.FileField(upload_to='purchase_orders/', null=True, blank=True)
    
    receipt_file = models.FileField(upload_to='receipts/', null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"#{self.id} - {self.title} ({self.status})"

    def can_approve(self, user, level):
        """
        Helper to check if a user can approve this request.
        Level 1 = Manager, Level 2 = Director
        """
        if level == 1:
            return self.status == 'PENDING'
        if level == 2:
            return self.status == 'APPROVED_L1'
        return False