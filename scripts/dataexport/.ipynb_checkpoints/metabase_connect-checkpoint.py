# -*- coding: utf-8 -*-
"""
Created on Tue May 24 14:04:24 2022

@author: BAUGER
"""

from metabasepy import Client,MetabaseTableParser
import configparser
import pandas as pd
from arcgis.features import SpatialDataFrame


ini = "config.ini"

def getpandasdf(in_ini):
    config=configparser.ConfigParser()
    config.read(in_ini)
    if config.has_section('metabase')==True:
        try:
            user = config.get('metabase','username')
            passw = config.get('metabase','password')
            metaurl = config.get('metabase','url')
            dataid = config.get('metabase','databaseid')
            cli = Client(user,passw,metaurl)

            cli.authenticate()

            json_result = cli.cards.download(dataid,format='json')
            df=pd.DataFrame(json_result)
            return df
        except:
            print("Something wrong with INI login")    
    else:
        return("Metabase section not present in INI")    



print(getpandasdf(ini).head())



