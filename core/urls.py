from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PurchaseRequestViewSet, RegisterUserView

router = DefaultRouter()
router.register(r'requests', PurchaseRequestViewSet, basename='purchaserequest')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterUserView.as_view(), name='register'),
]