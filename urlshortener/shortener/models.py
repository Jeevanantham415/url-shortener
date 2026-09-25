from django.db import models

class URL(models.Model):
    original_url = models.URLField()
    short_code = models.CharField(max_length=10,
                                  unique=True,
                                  null=True,
                                  blank=True)
    click_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class Click(models.Model):
    url = models.ForeignKey(URL,on_delete=models.CASCADE)
    clicked_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField() 
