
from django.shortcuts import render
from rest_framework import generics   
from .serializers import IndicatorSerializer, IndicatorUnitSubgroupSerializer, SubgroupSerializer, UtDataSerializer, UtDatatimeSerializer, AreaEnSerializer, AreaEnDropSerializer, NiStDtbPolySerializer  
from .models import UtData, AreaEn, Indicator, IndicatorUnitSubgroup, Subgroup, Timeperiod, NiStDtbPoly    
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
                if select_area_level == 2:
                        queryset = NiStDtbPoly.objects.all().filter(st_name=select_area_name)
                elif select_area_level == 3:
                        area_parentid =AreaEn.objects.filter(area_id=areaSelect).value('area_parent_id')
                        area_parent_name= AreaEn.objects.filter(area_parent_id=area_parentid).value('area_name')
                        area_geodata = NiStDtbPoly.objects.all().filter(st_name=area_parent_name)	
                return queryset