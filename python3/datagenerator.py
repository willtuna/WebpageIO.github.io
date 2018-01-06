#! /usr/bin/python3

import random
import datetime


def price_generator():
    return random.randint(0,5000)

def date_generator(i):
    startdate=datetime.date(2015,1,1)
    date = startdate+datetime.timedelta(i)
    return date.__str__()

in_out = ['收入','支出']
income  = ['固定收入','非固定收入']
outcome = ['飲食', '交通', '娛樂','帳單','醫療','日用','其他']
eat     = ['飲料','正餐','點心(宵夜)']
transport = ['高鐵','捷運','公車','客運','加油']


def data_generator(price,id,date):
    maincat = random.randint(0,1)
    if(date.split('-')[2]=='01'):
        maincat = 0
        price = 50000
    if(maincat == 0):
        secondcat = random.randint(0,1)
        print(in_out[maincat]+','+income[secondcat]+',無,'+str(price)+','+str(id)+','+date+','+str(id))
    else:
        secondcat = random.randint(0,6)
        if( secondcat == 0):
            thirdcat = random.randint(0,2)
            print(in_out[maincat]+','+outcome[secondcat]+','+eat[thirdcat]+','+str(price)+','+str(id)+','+date+','+str(id))
        elif (secondcat == 1):
            thirdcat = random.randint(0,4)
            print(in_out[maincat]+','+outcome[secondcat]+','+transport[thirdcat]+','+str(price)+','+str(id)+','+date+','+str(id))
        else:
            print(in_out[maincat]+','+outcome[secondcat]+',無,'+str(price)+','+str(id)+','+date+','+str(id))


for i in range(3650):
    price = price_generator()
    date = date_generator(i)
    data_generator(price,i,date)
