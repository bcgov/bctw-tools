# -*- coding: utf-8 -*-
"""
Created on Tue May 24 14:04:24 2022

@author: BAUGER
"""

from metabasepy import Client,MetabaseTableParser
import configparser
import pandas as pd

ini = "config.ini"

config=configparser.ConfigParser()
config.read(ini)
user = config.get('metabase','username')
passw = config.get('metabase','password')
metaurl = config.get('metabase','url')
dataid = config.get('metabase','databaseid')

cli = Client(user,passw,metaurl)

cli.authenticate()

json_result = cli.cards.download(dataid,format='json')
df=pd.DataFrame(json_result)

print(df.head())


