from rest_framework import serializers
from django.contrib.auth import get_user_model
from users.models import Address, Profile


class RegisterSerializer(serializers.ModelSerializer):
  password = serializers.CharField(write_only=True, min_length=8)
  conf_password = serializers.CharField(write_only=True, min_length=8)

  class Meta:
    model = get_user_model()
    fields = ['user_id', 'first_name', 'last_name', 'email', 'password', 'conf_password']
    read_only_fields = ['user_id']
  
  def create(self, validated_data):
    if validated_data['password'] == validated_data['conf_password']:
      validated_data.pop('conf_password')
      password = validated_data.pop('password')
      instance = self.Meta.model(**validated_data)
      instance.set_password(password)
      instance.save()
      return instance
    else:
      raise serializers.ValidationError({'password': ('Password does not match!')})



class LoginSerializer(serializers.ModelSerializer):
  password = serializers.CharField(min_length=8, write_only=True)

  class Meta:
    model = get_user_model()
    fields = ('user_id', 'email', 'password', 'token')
    read_only_fields = ['token', 'user_id']



class ProfileSerializer(serializers.ModelSerializer):
  class Meta:
    model = Profile
    fields = "__all__"



class AddressSerializer(serializers.ModelSerializer):
  class Meta:
    model = Address
    fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
  profile = ProfileSerializer()
  address = AddressSerializer(many=True, read_only=True)

  class Meta:
    model = get_user_model()
    fields = ['user_id', 'full_name', 'first_name', 'last_name', 'email', 'profile', 'address']
    read_only_fields = ['user_id']