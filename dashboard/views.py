
from django.shortcuts import render
from rest_framework import generics   
from .serializers import (IndicatorSerializer, UtDataAllSerializer, IndicatorUnitSubgroupSerializer, 
SubgroupSerializer, UtDataSerializer, UtDatatimeSerializer, AreaEnSerializer, AreaEnDropSerializer, NiStDtbPolySerializer , 
UnitSerializer,UnitNameSerializer,IndicatorTypeSerializer,UtDataTrendSerializer,UtDataBarSerializer )                       
from .models import UtData, AreaEn, Indicator, IndicatorUnitSubgroup, Subgroup, Timeperiod, NiStDtbPoly  ,Unit  
# from drf_multiple_model.viewsets import ObjectMultipleModelAPIViewSet  
from django.db.models import Q
from rest_framework.response import Response   
from rest_framework import status   
import json  
from django.core.serializers.json import DjangoJSONEncoder  

class IndicatorListView(generics.ListAPIView): 
        serializer_class = IndicatorSerializer
        def get_queryset(self,*args, **kwargs):
                selectedTab = self.kwargs.get('tab', None)
                queryset = Indicator.objects.filter(Q(classification=selectedTab)).values('indicator_id', 'indicator_name').order_by('indicator_order')
                return queryset

class SubgroupListView(generics.ListAPIView): 
        serializer_class = IndicatorUnitSubgroupSerializer
        def get_queryset(self,*args, **kwargs):
                indicatorSelect = self.kwargs.get('indicator') #12
                print(indicatorSelect)
                queryset = IndicatorUnitSubgroup.objects.filter(Q(indicator_id=indicatorSelect)).select_related('subgroup').order_by('subgroup__subgroup_order')
                print(queryset.values())
                return queryset

                # subgroup_id,subgroup_name

class TimeperiodListView(generics.ListAPIView): 
        serializer_class = UtDatatimeSerializer
        def get_queryset(self,*args,**kwargs):
                indicatorSelect = self.kwargs.get('indicator') #12
                subgroupSelect = self.kwargs.get('subgroup') #6
                areaSelect = self.kwargs.get('area') #1
                queryset = UtData.objects.filter(Q(indicator=indicatorSelect) & Q(subgroup=subgroupSelect) & Q(area=areaSelect)).select_related('timeperiod').distinct().order_by('-timeperiod')
                return queryset

class AreaListView(generics.ListAPIView): 
        serializer_class = AreaEnDropSerializer
        def get_queryset(self):
                queryset = AreaEn.objects.all()
                return queryset

class IndiaMapView(generics.ListAPIView): 
        serializer_class = UtDataSerializer
        def get_queryset(self,*args,**kwargs):
                indicatorSelect = self.kwargs.get('indicator', None) #12
                subgroupSelect = self.kwargs.get('subgroup', None) #6
                timeperiodSelect = self.kwargs.get('timeperiod', None) #21
                areaLevel = self.kwargs.get('area_level', None) #2
                queryset = UtData.objects.filter(Q(indicator=indicatorSelect) & Q(subgroup=subgroupSelect) & Q(timeperiod=timeperiodSelect) & Q(area__area_level=areaLevel)).select_related('area')		
                return queryset

class AreaDataView(generics.ListAPIView): 
        serializer_class = UtDataSerializer
        def get_queryset(self,*args,**kwargs):
                indicatorSelect = self.kwargs.get('indicator', None)
                subgroupSelect = self.kwargs.get('subgroup', None)
                timeperiodSelect = self.kwargs.get('timeperiod', None)
                areaSelect =self.kwargs.get('area', None)
                areaDetails=AreaEn.objects.filter(area_id=areaSelect).values('area_level','area_name')
                select_area_level = areaDetails[0].get('area_level')
                select_area_name = areaDetails[0].get('area_name')
                if select_area_level == 2:
                    queryset = UtData.objects.filter(Q(indicator=indicatorSelect) & Q(subgroup=subgroupSelect) & Q(timeperiod=timeperiodSelect) & Q(area__area_parent_id=areaSelect)).select_related('area')
                elif select_area_level == 3:
                    area_parentid =AreaEn.objects.filter(area_id=areaSelect).value('area_parent_id')
                    queryset = UtData.objects.filter(Q(indicator=indicatorSelect) & Q(subgroup=subgroupSelect) & Q(timeperiod=timeperiodSelect) & Q(area__area_parent_id=area_parentid)).select_related('area')
                return queryset

class AreaMapView(generics.ListAPIView): 
        serializer_class = NiStDtbPolySerializer
        def get_queryset(self,*args,**kwargs):
                areaSelect = self.kwargs.get('area', None)
                areaDetails=AreaEn.objects.filter(area_id=areaSelect).values('area_level','area_name')
                select_area_level = areaDetails[0].get('area_level')
                select_area_name = areaDetails[0].get('area_name')
                queryset=[]
                if select_area_level == 2:
                        queryset = NiStDtbPoly.objects.all().filter(st_name=select_area_name)
                elif select_area_level == 3:
                        area_parentid =AreaEn.objects.filter(area_id=areaSelect).value('area_parent_id')
                        area_parent_name= AreaEn.objects.filter(area_parent_id=area_parentid).value('area_name')
                        area_geodata = NiStDtbPoly.objects.all().filter(st_name=area_parent_name)	
                return queryset

class GetUnitView(generics.ListAPIView):
        serializer_class = UnitSerializer
        queryset=[]
        def get_queryset(self,*args,**kwargs):
                selIndicator = self.kwargs.get('indicator',None)
                selSubgroup = self.kwargs.get('subgroup',None)
                queryset = IndicatorUnitSubgroup.objects.all().filter(Q(indicator=selIndicator)&Q(subgroup=selSubgroup))
                return queryset

class GetUnitNameView(generics.ListAPIView):
        serializer_class = UnitNameSerializer
        queryset=[]
        def get_queryset(self,*args,**kwargs):
                queryset = Unit.objects.all()
                return queryset

class IndicatorDetailView(generics.ListAPIView): 
        serializer_class =  UtDataAllSerializer
        def get_queryset(self,*args, **kwargs):
                selectedTab = self.kwargs.get('tab', None)
                queryset= UtData.objects.raw('select * from ut_data join (select ut_data.indicator_id, Max(ut_data.timeperiod_id) as maxt from ut_data join indicator on ut_data.indicator_id = indicator.indicator_id and indicator.classification_id = %s where ut_data.area_id=1 and ut_data.subgroup_id=6 group by ut_data.indicator_id order by ut_data.indicator_id) max on ut_data.indicator_id=max.indicator_id and ut_data.timeperiod_id=max.maxt where area_id=1 and subgroup_id=6 order by ut_data.indicator_id', [selectedTab])
                return queryset

class IndicatorTypeView(generics.ListAPIView): 
        serializer_class = IndicatorTypeSerializer
        def get_queryset(self,*args, **kwargs):
                selIndicator = self.kwargs.get('indicator',None)
                queryset = Indicator.objects.filter(Q(indicator_id=selIndicator)).values('indi_sense')
                return queryset    

class DistrictDataView(generics.ListAPIView): 
        serializer_class =  UtDataAllSerializer
        def get_queryset(self,*args, **kwargs):
                indicatorSelect = self.kwargs.get('indicator', None)
                subgroupSelect = self.kwargs.get('subgroup', None)
                timeperiodSelect = self.kwargs.get('timeperiod', None)
                queryset= UtData.objects.raw('select * from ut_data join area_en on ut_data.area_id=area_en.area_id and area_level=3 where ut_data.timeperiod_id = %s and ut_data.indicator_id = %s and ut_data.subgroup_id = %s limit 1', [timeperiodSelect, indicatorSelect, subgroupSelect])
                return queryset

class IndicatorTrendView(generics.ListAPIView): 
        serializer_class = UtDataTrendSerializer
        def get_queryset(self,*args, **kwargs):
                indicatorSelect = self.kwargs.get('indicator',None)
                areaSelect = self.kwargs.get('area', None)
                subgroupSelect = self.kwargs.get('subgroup', None)
                queryset = UtData.objects.filter(Q(indicator=indicatorSelect) & Q(subgroup=subgroupSelect) & Q(area=areaSelect)).order_by('timeperiod').exclude(data_value__isnull=True)
                return queryset

class IndicatorBarView(generics.ListAPIView): 
        serializer_class = UtDataBarSerializer
        def get_queryset(self,*args, **kwargs):
                indicatorSelect = self.kwargs.get('indicator',None)
                areaSelect = self.kwargs.get('area', None)
                timeperiodSelect = self.kwargs.get('timeperiod', None)
                queryset = UtData.objects.filter(Q(indicator=indicatorSelect) & Q(timeperiod=timeperiodSelect) & Q(area=areaSelect)).order_by('subgroup__subgroup_order')
                return queryset            