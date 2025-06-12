import boto3
from textractcaller import call_textract
from textractprettyprinter.t_pretty_print import get_lines_string

class InvoiceProcessor:
    def __init__(self):
        self.s3 = boto3.client('s3')
        self.textract = boto3.client('textract')
        
    def process_invoice(self, s3_path):
        textract_response = call_textract(input_document=s3_path)
        raw_text = get_lines_string(textract_response)
        extracted_data = self.extract_structured_data(raw_text)
        validation_result = self.validate_invoice(extracted_data)
        return {
            'raw_text': raw_text,
            'extracted_data': extracted_data,
            'validation': validation_result
        }
