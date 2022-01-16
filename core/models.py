from django.db import models
import uuid


class TimeStampedModel(models.Model):
  created = models.DateTimeField(db_index=True, auto_now_add=True)
  modified = models.DateTimeField(auto_now=True)

  class Meta:
    abstract = True



class UUIDModel(models.Model):
  uuid = models.UUIDField(db_index=True, default=uuid.uuid4, editable=False)
  
  class Meta:
    abstract = True