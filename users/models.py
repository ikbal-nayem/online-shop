from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.cache import cache
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.conf import settings
import jwt, uuid
from datetime import datetime, timezone, timedelta
from core.models import TimeStampedModel



class CustomUserManager(BaseUserManager):
  def create_user(self, email, password, **other_fields):
    if not email:
      raise ValueError('Email is required!')

    email = self.normalize_email(email)
    user = self.model(email=email, **other_fields)
    user.set_password(password)
    user.save()
    return user
  
  def create_superuser(self, email, password, **other_fields):
    other_fields.setdefault('is_staff', True)
    other_fields.setdefault('is_admin', True)
    other_fields.setdefault('is_superuser', True)
    return self.create_user(email, password, **other_fields)



class CustomUser(AbstractBaseUser, PermissionsMixin):
  user_id = models.UUIDField(db_index=True, default=uuid.uuid4, editable=False)
  first_name = models.CharField(max_length=15)
  last_name = models.CharField(max_length=15)
  email = models.EmailField(verbose_name='email', unique=True)
  is_active = models.BooleanField(default=True)
  is_admin = models.BooleanField(default=False)
  is_staff = models.BooleanField(default=False)

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ['first_name', 'last_name']
  objects = CustomUserManager()

  @property
  def get_full_name(self):
    return '{0} {1}'.format(self.first_name, self.last_name)

  @property
  def token(self):
    return jwt.encode({'user_id': self.user_id, 'exp': datetime.utcnow()+timedelta(hours=12)}, settings.SECRET_KEY, algorithm='HS256')

  def __str__(self) -> str:
    return self.get_full_name



def user_media_path(instance, filename):
  return "users/{0}/{1}".format(instance.user.user_id, filename)


class Profile(TimeStampedModel):
  GENDER_CHOICES = (
    ('m', "Male"),
    ('f', "Female"),
    ('o', "Other"),
  )
  user = models.OneToOneField(CustomUser, related_name="profile", on_delete=models.CASCADE)
  is_email_verified = models.BooleanField(default=False, help_text=_("Email should be verified."))
  gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True, null=True)
  profile_picture = models.ImageField(upload_to=user_media_path, blank=True, null=True)

  @property
  def last_seen(self):
    return cache.get(f"seen_{self.user.user_id}")

  @property
  def online(self):
    if self.last_seen:
      now = datetime.now(timezone.utc)
      if now > self.last_seen + timedelta(minutes=settings.USER_ONLINE_TIMEOUT):
        return False
      else:
        return True
    else:
      return False

  def __str__(self) -> str:
    return self.user.get_full_name



@receiver(post_save, sender=CustomUser)
def create_user_profile(sender, instance, created, *args, **kwargs):
  if created:
    Profile.objects.create(user=instance) 



class Address(TimeStampedModel):
  TAG_CHOICES = (("h", "Home"), ("o", "Office"))
  user = models.ForeignKey(CustomUser, related_name="address", on_delete=models.CASCADE)
  division = models.CharField(max_length=15, blank=False, null=False)
  city = models.CharField(max_length=100, blank=False, null=False)
  area = models.CharField(max_length=100, blank=False, null=False)
  street_address = models.CharField(max_length=250, blank=False, null=False)
  is_default = models.BooleanField(default=False)
  name = models.CharField(max_length=50)
  phone_number = models.CharField(max_length=15)
  address_tag = models.CharField(max_length=50, choices=TAG_CHOICES, null=True, blank=True)

  def __str__(self) -> str:
    return self.user.get_full_name
