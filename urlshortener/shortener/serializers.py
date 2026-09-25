from rest_framework import serializers
from .models import URL

class URLSerializer(serializers.ModelSerializer):
    class Meta:
        model = URL
        fields = ['id','original_url','short_code','click_count','created_at']
        read_only_fields = ['id','short_code','click_count','created_at']