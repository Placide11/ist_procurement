import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from django.conf import settings
from datetime import datetime

def generate_po_pdf(request_instance):
    """
    Generates a simple PDF Purchase Order and saves it to media/purchase_orders/
    """
    filename = f"PO_{request_instance.id}_{datetime.now().strftime('%Y%m%d')}.pdf"
    save_dir = os.path.join(settings.MEDIA_ROOT, 'purchase_orders')
    os.makedirs(save_dir, exist_ok=True)
    file_path = os.path.join(save_dir, filename)

    c = canvas.Canvas(file_path, pagesize=letter)
    width, height = letter

    c.setFont("Helvetica-Bold", 20)
    c.drawString(50, height - 50, "PURCHASE ORDER")
    
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 80, f"PO Number: PO-{request_instance.id:05d}")
    c.drawString(50, height - 100, f"Date: {datetime.now().strftime('%Y-%m-%d')}")
    
    vendor = request_instance.extracted_data.get('vendor', 'Unknown Vendor')
    c.drawString(50, height - 140, f"Vendor: {vendor}")
    
    c.line(50, height - 160, 550, height - 160)
    c.drawString(50, height - 180, "Item")
    c.drawString(300, height - 180, "Description")
    c.drawString(500, height - 180, "Amount")
    c.line(50, height - 190, 550, height - 190)

    c.drawString(50, height - 210, request_instance.title)
    c.drawString(300, height - 210, request_instance.description[:30]) # Truncate if long
    c.drawString(500, height - 210, f"{request_instance.currency} {request_instance.amount}")

    c.line(50, height - 400, 250, height - 400)
    c.drawString(50, height - 420, "Authorized Signature")
    
    c.save()

    return f"purchase_orders/{filename}"