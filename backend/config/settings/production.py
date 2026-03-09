from .base import *

DEBUG = False
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')

DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
AWS_ACCESS_KEY_ID        = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY    = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME  = os.environ.get('AWS_STORAGE_BUCKET_NAME')
