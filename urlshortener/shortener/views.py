from django.shortcuts import redirect, get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .serializers import URLSerializer
from .utils import encode_base62
from .models import URL, Click


class ShortenURLView(APIView):

    def post(self, request):
        serializer = URLSerializer(data=request.data)

        if serializer.is_valid():
            url = serializer.save()

            url.short_code = encode_base62(url.id)
            url.save()

            short_url = f"http://127.0.0.1:8000/api/{url.short_code}/"

            data = URLSerializer(url).data
            data['short_url'] = short_url

            return Response(
                data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


def redirect_url(request, code):

    url = get_object_or_404(URL, short_code=code)

    url.click_count += 1
    url.save()

    ip_address = request.META.get('REMOTE_ADDR')

    Click.objects.create(
        url=url,
        ip_address=ip_address
    )

    return redirect(url.original_url)


class AnalyticsView(APIView):

    def get(self, request, code):

        url = get_object_or_404(URL, short_code=code)

        clicks = Click.objects.filter(url=url)

        click_data = []

        for click in clicks:
            click_data.append({
                'clicked_at': click.clicked_at,
                'ip_address': click.ip_address
            })

        return Response({
            'short_code': url.short_code,
            'original_url': url.original_url,
            'total_clicks': url.click_count,
            'created_at': url.created_at,
            'clicks': click_data
        })