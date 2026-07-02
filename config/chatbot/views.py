from django.shortcuts import render
from django.http import JsonResponse

def home(request):
    return JsonResponse({
        'message': 'College Chatbot Backend Running'})

# Create your views here.
