from django.db import models
from django.contrib.auth.models import User
# from datetime import datetime
from datetime import timedelta


# Create your models here.
class Category(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=32)
    goal = models.IntegerField()

    def __str__(self):
        return self.name


class Record(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    category_id = models.ForeignKey(Category, on_delete=models.CASCADE)
    date_start = models.DateTimeField(blank=True, null=True)
    # сохраняется дата, когда нажимаешь на паузу
    # при сохранении берется дата остановки таймера
    date_end = models.DateTimeField(blank=True, null=True)
    duration = models.DurationField(default=timedelta(minutes=0))
    hashtag = models.CharField(max_length=32)

    def get_records(self):
        return [self.date_end, self.duration, self.hashtag]

    # def save(self):
    #     pass

    def __str__(self):
        # return [self.date_end, self.duration, self.hashtag]
        return self.hashtag


class MyUser(User):
    pass
