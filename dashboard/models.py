# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.contrib.gis.db import models


class AreaEn(models.Model):
    area_id = models.AutoField(primary_key=True)
    area_parent_id = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    area_code = models.CharField(max_length=20, blank=True, null=True)
    area_name = models.CharField(max_length=50, blank=True, null=True)
    area_level = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'area_en'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Indicator(models.Model):
    indicator_id = models.AutoField(primary_key=True)
    indicator_name = models.CharField(max_length=255, blank=True, null=True)
    classification = models.ForeignKey('IndicatorClassification', models.DO_NOTHING, blank=True, null=True)
    indicator_order = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'indicator'


class IndicatorClassification(models.Model):
    classification_id = models.AutoField(primary_key=True)
    classification_parent_id = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    classification_name = models.CharField(max_length=90, blank=True, null=True)
    classification_order = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'indicator_classification'


class IndicatorUnitSubgroup(models.Model):
    iusnid = models.AutoField(primary_key=True)
    indicator = models.ForeignKey(Indicator, models.DO_NOTHING)
    unit = models.ForeignKey('Unit', models.DO_NOTHING)
    subgroup = models.ForeignKey('Subgroup', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'indicator_unit_subgroup'


class NiStDtbPoly(models.Model):
    ogc_fid = models.AutoField(primary_key=True)
    id_field = models.CharField(db_column='id_', max_length=20, blank=True, null=True)  # Field renamed because it ended with '_'.
    dt_name = models.CharField(max_length=40, blank=True, null=True)
    st_name = models.CharField(max_length=40, blank=True, null=True)
    parts_field = models.IntegerField(db_column='parts_', blank=True, null=True)  # Field renamed because it ended with '_'.
    points_field = models.IntegerField(db_column='points_', blank=True, null=True)  # Field renamed because it ended with '_'.
    length_field = models.FloatField(db_column='length_', blank=True, null=True)  # Field renamed because it ended with '_'.
    area_field = models.FloatField(db_column='area_', blank=True, null=True)  # Field renamed because it ended with '_'.
    wkb_geometry = models.GeometryField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ni_st_dtb_poly'


class Subgroup(models.Model):
    subgroup_id = models.AutoField(primary_key=True)
    subgroup_name = models.CharField(max_length=20, blank=True, null=True)
    subgroup_order = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'subgroup'


class Tab1(models.Model):
    indicator_id = models.IntegerField(blank=True, null=True)
    indicator_name = models.CharField(max_length=255, blank=True, null=True)
    classification_id = models.IntegerField(blank=True, null=True)
    indicator_order = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    unit_id = models.IntegerField(blank=True, null=True)
    unit_name = models.CharField(max_length=40, blank=True, null=True)
    subgroup_id = models.IntegerField(blank=True, null=True)
    subgroup_name = models.CharField(max_length=20, blank=True, null=True)
    subgroup_order = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    area_id = models.IntegerField(blank=True, null=True)
    area_parent_id = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    area_code = models.CharField(max_length=20, blank=True, null=True)
    area_name = models.CharField(max_length=50, blank=True, null=True)
    area_level = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    timeperiod_id = models.IntegerField(blank=True, null=True)
    timeperiod = models.CharField(max_length=90, blank=True, null=True)
    data_value = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tab1'


class Tab2(models.Model):
    indicator_id = models.IntegerField(blank=True, null=True)
    indicator_name = models.CharField(max_length=255, blank=True, null=True)
    classification_id = models.IntegerField(blank=True, null=True)
    indicator_order = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    unit_id = models.IntegerField(blank=True, null=True)
    unit_name = models.CharField(max_length=40, blank=True, null=True)
    subgroup_id = models.IntegerField(blank=True, null=True)
    subgroup_name = models.CharField(max_length=20, blank=True, null=True)
    subgroup_order = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    area_id = models.IntegerField(blank=True, null=True)
    area_parent_id = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    area_code = models.CharField(max_length=20, blank=True, null=True)
    area_name = models.CharField(max_length=50, blank=True, null=True)
    area_level = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    timeperiod_id = models.IntegerField(blank=True, null=True)
    timeperiod = models.CharField(max_length=90, blank=True, null=True)
    data_value = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tab2'


class Tab3(models.Model):
    indicator_id = models.IntegerField(blank=True, null=True)
    indicator_name = models.CharField(max_length=255, blank=True, null=True)
    classification_id = models.IntegerField(blank=True, null=True)
    indicator_order = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    unit_id = models.IntegerField(blank=True, null=True)
    unit_name = models.CharField(max_length=40, blank=True, null=True)
    subgroup_id = models.IntegerField(blank=True, null=True)
    subgroup_name = models.CharField(max_length=20, blank=True, null=True)
    subgroup_order = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    area_id = models.IntegerField(blank=True, null=True)
    area_parent_id = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    area_code = models.CharField(max_length=20, blank=True, null=True)
    area_name = models.CharField(max_length=50, blank=True, null=True)
    area_level = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    timeperiod_id = models.IntegerField(blank=True, null=True)
    timeperiod = models.CharField(max_length=90, blank=True, null=True)
    data_value = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tab3'


class Tab4(models.Model):
    indicator_id = models.IntegerField(blank=True, null=True)
    indicator_name = models.CharField(max_length=255, blank=True, null=True)
    classification_id = models.IntegerField(blank=True, null=True)
    indicator_order = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    unit_id = models.IntegerField(blank=True, null=True)
    unit_name = models.CharField(max_length=40, blank=True, null=True)
    subgroup_id = models.IntegerField(blank=True, null=True)
    subgroup_name = models.CharField(max_length=20, blank=True, null=True)
    subgroup_order = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    area_id = models.IntegerField(blank=True, null=True)
    area_parent_id = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    area_code = models.CharField(max_length=20, blank=True, null=True)
    area_name = models.CharField(max_length=50, blank=True, null=True)
    area_level = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    timeperiod_id = models.IntegerField(blank=True, null=True)
    timeperiod = models.CharField(max_length=90, blank=True, null=True)
    data_value = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tab4'


class Tabs(models.Model):
    indicator_id_tab4 = models.IntegerField(blank=True, null=True)
    indicator_name_tab4 = models.CharField(max_length=255, blank=True, null=True)
    classification_id_tab4 = models.IntegerField(blank=True, null=True)
    indicator_order_tab4 = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    unit_id_tab4 = models.IntegerField(blank=True, null=True)
    unit_name_tab4 = models.CharField(max_length=40, blank=True, null=True)
    subgroup_id_tab4 = models.IntegerField(blank=True, null=True)
    subgroup_name_tab4 = models.CharField(max_length=20, blank=True, null=True)
    subgroup_order_tab4 = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    area_id_tab4 = models.IntegerField(blank=True, null=True)
    area_parent_id_tab4 = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    area_code_tab4 = models.CharField(max_length=20, blank=True, null=True)
    area_name_tab4 = models.CharField(max_length=50, blank=True, null=True)
    area_level_tab4 = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    timeperiod_id_tab4 = models.IntegerField(blank=True, null=True)
    timeperiod_tab4 = models.CharField(max_length=90, blank=True, null=True)
    data_value_tab4 = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tabs'


class Timeperiod(models.Model):
    timeperiod_id = models.AutoField(primary_key=True)
    timeperiod = models.CharField(max_length=90, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'timeperiod'


class Unit(models.Model):
    unit_id = models.AutoField(primary_key=True)
    unit_name = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'unit'


class UtData(models.Model):
    data_id = models.AutoField(primary_key=True)
    iusnid = models.ForeignKey(IndicatorUnitSubgroup, models.DO_NOTHING, db_column='iusnid')
    timeperiod = models.ForeignKey(Timeperiod, models.DO_NOTHING)
    area = models.ForeignKey(AreaEn, models.DO_NOTHING)
    indicator = models.ForeignKey(Indicator, models.DO_NOTHING)
    unit = models.ForeignKey(Unit, models.DO_NOTHING)
    subgroup = models.ForeignKey(Subgroup, models.DO_NOTHING)
    data_value = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ut_data'
