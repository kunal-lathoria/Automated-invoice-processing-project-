provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "invoice_bucket" {
  bucket = "invoice-processing-${var.environment}"
  acl    = "private"
}

resource "aws_lambda_function" "process_invoice" {
  filename      = "lambda_function.zip"
  function_name = "process_invoice"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "index.handler"
  runtime       = "nodejs14.x"
  
  environment {
    variables = {
      INVOICE_BUCKET = aws_s3_bucket.invoice_bucket.id
    }
  }
}
