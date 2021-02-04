from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse, Http404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from mainapp.models import Category


def index(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect('/')
    else:
        return render(request, 'login/login.html')


def tryAuth(request):
    if request.is_ajax and request.method == "POST" and request.POST:
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'valid': True})
        else:
            return JsonResponse({'valid': False, 'error': 'Not found'})
        return JsonResponse({'valid': False, 'error': 'hz error'})
    # responce = HttpResponseRedirect('/')
    # responce.set_cookie('Authorizated', 'True', 600)
    raise Http404


def register(request):
    if request.is_ajax and request.method == "POST" and request.POST:
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        user = User.objects.create_user(username, email, password)
        if user is not None:
            login(request, user)
            for x in 'Sound', 'Tehnique', 'Studies', 'Piece':
                c = Category(user_id=user, name=x, goal=600)
                c.save()
            return JsonResponse({'valid': True})
        else:
            return JsonResponse({'valid': False, 'error': 'Not found'})
        return JsonResponse({'valid': False, 'error': 'hz error'})
    # responce = HttpResponseRedirect('/')
    # responce.set_cookie('Authorizated', 'True', 600)
    raise Http404


def logOut(request):
    logout(request)
    return HttpResponseRedirect('/login/')
