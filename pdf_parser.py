#!/usr/bin/env python3
"""
PDF Parser using PyMuPDF (fitz) for better text extraction
Called from Node.js server to parse PDF files
"""

import sys
import json
import base64
import fitz  # PyMuPDF

def parse_pdf(pdf_data):
    """
    Parse PDF file and extract text using PyMuPDF
    
    Args:
        pdf_data: Base64 encoded PDF file data
        
    Returns:
        Dictionary with 'text' and 'metadata' keys
    """
    try:
        # Decode base64 PDF data
        pdf_bytes = base64.b64decode(pdf_data)
        
        # Open PDF with PyMuPDF
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        # Extract text from all pages
        full_text = ""
        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text()
            full_text += text + "\n"
        
        # Extract metadata
        metadata = doc.metadata
        
        # Close document
        doc.close()
        
        return {
            "success": True,
            "text": full_text.strip(),
            "metadata": {
                "title": metadata.get("title", ""),
                "author": metadata.get("author", ""),
                "subject": metadata.get("subject", ""),
                "pages": len(doc)
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "text": ""
        }

if __name__ == "__main__":
    try:
        # Read base64 encoded PDF from stdin
        input_data = sys.stdin.read()
        data = json.loads(input_data)
        
        pdf_base64 = data.get("pdf_data")
        if not pdf_base64:
            result = {
                "success": False,
                "error": "No PDF data provided",
                "text": ""
            }
        else:
            result = parse_pdf(pdf_base64)
        
        # Output result as JSON
        print(json.dumps(result))
        
    except json.JSONDecodeError as e:
        result = {
            "success": False,
            "error": f"Invalid JSON input: {str(e)}",
            "text": ""
        }
        print(json.dumps(result))
    except Exception as e:
        result = {
            "success": False,
            "error": f"Unexpected error: {str(e)}",
            "text": ""
        }
        print(json.dumps(result))

