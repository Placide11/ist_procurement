from rest_framework import viewsets, permissions, status, exceptions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import PurchaseRequest
from .serializers import PurchaseRequestSerializer
from .ai_utils import extract_data_from_proforma
from .po_utils import generate_po_pdf

class PurchaseRequestViewSet(viewsets.ModelViewSet):
    serializer_class = PurchaseRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Staff -> See only their own requests.
        Approvers/Finance -> See all requests.
        """
        user = self.request.user
        if user.is_superuser or user.is_staff: 
            return PurchaseRequest.objects.all()
        return PurchaseRequest.objects.filter(requester=user)

    def perform_create(self, serializer):
        instance = serializer.save(requester=self.request.user)
        
        if instance.proforma_file:
            file_path = instance.proforma_file.path
            
            data = extract_data_from_proforma(file_path)
            
            instance.extracted_data = data
            instance.save()

    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        """
        Handles approval logic with DATABASE LOCKING for concurrency safety.
        """
        with transaction.atomic():
            purchase_request = PurchaseRequest.objects.select_for_update().get(pk=pk)

            user = request.user
            current_status = purchase_request.status

            if current_status == 'PENDING':
                purchase_request.status = 'APPROVED_L1'
                purchase_request.approver_l1 = user
                purchase_request.save()
                return Response({'status': 'Approved by Manager (L1)'})

            elif current_status == 'APPROVED_L1':
                purchase_request.status = 'APPROVED_L2'
                purchase_request.approver_l2 = user
                
                try:
                    pdf_path = generate_po_pdf(purchase_request)
                    purchase_request.purchase_order_file = pdf_path
                except Exception as e:
                    print(f"Error generating PO: {e}")
                
                purchase_request.save()
                return Response({'status': 'Approved by Director (L2) - PO Generated'})

            else:
                return Response(
                    {'error': 'Request is not in a state to be approved by you.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

    @action(detail=True, methods=['patch'])
    def reject(self, request, pk=None):
        with transaction.atomic():
            purchase_request = PurchaseRequest.objects.select_for_update().get(pk=pk)
            
            if purchase_request.status in ['APPROVED_L2', 'REJECTED']:
                return Response({'error': 'Cannot reject an already finalized request.'}, status=400)

            reason = request.data.get('reason', 'No reason provided')
            purchase_request.status = 'REJECTED'
            purchase_request.rejection_reason = reason
            purchase_request.save()
            return Response({'status': 'Rejected'})