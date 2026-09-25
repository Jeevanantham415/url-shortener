from django.urls import path
from .views import ShortenURLView,redirect_url,AnalyticsView     

urlpatterns = [
    path('shorten/',ShortenURLView.as_view(),name='shorten-url'),
    path('analytics/<str:code>/', AnalyticsView.as_view(), name='analytics-url'),
    path('<str:code>/',redirect_url, name='redirect-url'),
]


