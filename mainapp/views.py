from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse, Http404
from .models import Category, Record
from datetime import datetime, timedelta, date


# Create your views here.
def checkAuth(request):
    # auth = False
    if request.user.is_authenticated:
        cat_list = Category.objects.filter(user_id=request.user.id)

        all_dur_today = Record.objects.filter(user_id=request.user.id,
                                              date_end__gte=date.today())
        all_dur_today = sum([x.duration.seconds for x in all_dur_today])

        all_dur_goal = sum([x.goal for x in cat_list])

        print(unix2string(all_dur_goal))
        print(unix2string(all_dur_goal))
        print(unix2string(all_dur_goal))
        print(unix2string(all_dur_today))
        print(unix2string(all_dur_today))
        print(unix2string(all_dur_today))
        # records_list = Record.objects.filter(user_id=request.user.id)
        return render(request, 'mainapp/index.html', {'cat_list': cat_list,
                                                      'all_dur_goal': unix2string(all_dur_goal),
                                                      'all_dur_today': unix2string(all_dur_today)})
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



        # Реалізувати потім, щоб всі категорії і їх цілі закидувалися в arrayJS
        # і зберігалися в js, щоб кожен раз не лізти в БД
        # і додати щоб при загрузці сторінки генерувалося зразу то шо треба
        # all_dur_goal = Category.objects.filter(user_id=request.user)
        # all_dur_goal = sum([x.goal for x in all_dur_goal])

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


def delDurationFromBase(request):
    if request.is_ajax and request.method == "POST" and request.POST:
        category_id = Category.objects.get(user_id=request.user.id,
                                           name=request.POST['catName'])
        day, month, year = request.POST['addDate'].split('.')
        hour, minute = request.POST['addTime'].split(':')
        dur = [x for x in request.POST['duration'].split(' ')] # if is_integer(x)
        lastDur = None
        durArr = {}
        for x in dur:
            if lastDur:
                durArr[x] = lastDur
                lastDur = None
            else:
                lastDur = x
        if len(durArr) == 3:
            dur = int(durArr['сек']) + int(durArr['мин'])*60 + int(durArr['ч'])*3600
        elif len(durArr) == 2:
            dur = int(durArr['сек']) + int(durArr['мин'])*60
        else:
            dur = int(durArr['сек'])

        record = Record.objects.filter(user_id=request.user,
                                    category_id=category_id,
                                    date_end__year=year,
                                    date_end__month=month,
                                    date_end__day=day,
                                    date_end__hour=hour,
                                    date_end__minute=minute,
                                    duration=timedelta(seconds=dur))
        record[0].delete()
        dur_today = Record.objects.filter(user_id=request.user,
                                          category_id=category_id,
                                          date_end__gte=date.today())
        dur_today = sum([x.duration.seconds for x in dur_today])
        return JsonResponse({'valid': True,
                             'timeToday': dur_today*1000})
    raise Http404


def changeCatGoal(request):
    if request.is_ajax and request.method == "POST" and request.POST:
        category = Category.objects.get(user_id=request.user.id,
                                        name=request.POST['catName'])

        category.goal = int(request.POST['newCatGoal'])
        category.save()
        return JsonResponse({'valid': True})
    raise Http404


def unix2string(stringTime):
    m = stringTime % 3600 // 60 if stringTime % 3600 // 60 > 9 else "0" + str(stringTime % 3600 // 60)
    s = stringTime % 60 if stringTime % 60 > 9 else "0" + str(stringTime % 60)
    return str(stringTime // 3600) + ":" + str(m) + ":" + str(s)


def is_integer(n):
    try:
        int(n)
    except ValueError:
        return False
    else:
        return True
