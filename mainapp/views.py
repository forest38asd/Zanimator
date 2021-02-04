from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse, Http404
from .models import Category, Record
from datetime import datetime, timedelta, date


# Create your views here.
def checkAuth(request):
    # auth = False
    if request.user.is_authenticated:
        cat_list = Category.objects.filter(user_id=request.user.id)
        # records_list = Record.objects.filter(user_id=request.user.id)
        return render(request, 'mainapp/index.html', {'cat_list': cat_list})
    else:
        return HttpResponseRedirect("login")


def getCategoryData(request):
    if request.is_ajax and request.method == "POST" and request.POST:
        category = Category.objects.get(user_id=request.user.id,
                                        name=request.POST['catName'])
        records_list = Record.objects.filter(user_id=request.user.id,
                                             category_id=category.id)

        dur_today = Record.objects.filter(user_id=request.user,
                                          category_id=category.id,
                                          date_end__gte=date.today())
        dur_today = sum([x.duration.seconds for x in dur_today])

        # Создаем список для отправки в javascript:
        # [date_end (when added record), duration (in seconds), hashtag]
        records_list = [[x.date_end.strftime("%d.%m.%Y"), x.date_end.strftime("%H:%M"), x.duration.seconds, x.hashtag] for x in records_list]
        return JsonResponse({'valid': True,
                             'timeToday': dur_today*1000,
                             'timeGoal': category.goal*1000,
                             'records_list': records_list})
    raise Http404


def addDurationToDatabase(request):
    if request.is_ajax and request.method == "POST" and request.POST:
        if int(request.POST['duration']) == 0:
            return JsonResponse({'valid': False, 'error': "empty dur"})
        category_id = Category.objects.get(user_id=request.user.id,
                                           name=request.POST['catName'])

        date_start = datetime.fromtimestamp(int(request.POST['date_start'])/1000)
        date_end = datetime.fromtimestamp(int(request.POST['date_end'])/1000)
        duration = timedelta(seconds=int(request.POST['duration'])//1000)
        hashtag = request.POST['hashtag']

        record = Record(user_id=request.user,
                        category_id=category_id,
                        date_start=date_start,
                        date_end=date_end,
                        duration=duration,
                        hashtag=hashtag)
        record.save()
        return JsonResponse({'valid': True})
    raise Http404
