import pdfplumber
import json
import os
import re

def extract_data_from_proforma(file_path):
    """
    Extracts text from a PDF and uses rudimentary parsing (or AI) 
    to guess vendor and items.
    """
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
        
        # 2. Extract Data (Simulating AI for now to save cost/complexity)
        
        extracted_data = {
            "raw_text_preview": text[:200], #
            "vendor": "Unknown Vendor",
            "items": [],
            "total_detected": 0.0
        }

        price_pattern = re.search(r'(\$|USD)?\s?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)', text)
        if price_pattern:
            extracted_data['total_detected'] = price_pattern.group(0)

        lines = [line for line in text.split('\n') if line.strip()]
        if lines:
            extracted_data['vendor'] = lines[0] 

        return extracted_data

    except Exception as e:
        print(f"Error extracting data: {e}")
        return {"error": str(e)}

def generate_purchase_order_content(request_instance):
    """
    Generates a text string representing a PO based on the approved request.
    """
    return f"""
    PURCHASE ORDER
    -------------------------
    PO Number: PO-{request_instance.id:05d}
    Date: {request_instance.updated_at.strftime('%Y-%m-%d')}
    
    Vendor: {request_instance.extracted_data.get('vendor', 'General Vendor')}
    
    Item: {request_instance.title}
    Description: {request_instance.description}
    Total Amount: {request_instance.currency} {request_instance.amount}
    
    Approved By: {request_instance.approver_l2.username if request_instance.approver_l2 else 'N/A'}
    """