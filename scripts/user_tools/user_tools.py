# -*- coding: utf-8 -*-
"""
Created on Mon Jun 21 12:02:31 2021

@author: BAUGER

Location to store tools used to create new users, assigned new critters or update background data.
"""
from configparser import ConfigParser
import psycopg2


# Function to parse a .ini file for connection information. Template for ini file stored in along with the scripts.

def config(filename, section):
    # create a parser
    parser = ConfigParser()
    # read config file
    parser.read(filename)

    # get section, default to postgresql
    db = {}
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            db[param[0]] = param[1]
    else:
        raise Exception('Section {0} not found in the {1} file'.format(section, filename))

    return db


# Function to format a list or csv into appropriate json format for conusming via database functions.
def adduserjsonformatter():
    pass

# Function to format a list or csv into appropriate json format for conusming via database functions.
def addcritterjsonformatter():
    pass

# The adduser function connects to the database, runs the adduser function from backened. Function takes a json list and creates required users
def adduser(filename,section):
    """ Connect to the PostgreSQL database server """
    conn = None
    try:
        # read connection parameters
        params = config(filename,section)

        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)
		
        # create a cursor
        cur = conn.cursor()
        
	# DO THE ADD USER PART HERE.
        for i in range(10):
            
            print(i)
       
	# close the communication with the PostgreSQL
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')


def assigncritter():
    """ Connect to the PostgreSQL database server """
    conn = None
    try:
        # read connection parameters
        params = config()

        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)
		
        # create a cursor
        cur = conn.cursor()
        
	# DO THE ASSIGN CRITTER PART HERE.
    
    
       
	# close the communication with the PostgreSQL
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')

adduser(r'tests\database.ini','postgres')