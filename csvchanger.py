# -*- coding: utf-8 -*-
# This was used to mold the values of the csv files for display

import csv
import re

def onlyAmps(main_index):
    prune = []
    for a in main_list:
        if a[main_index][len(a[main_index]) - 1:] != "A":
            prune.append(main_list.index(a))

    counter = 0;
    for a in prune:
        main_list.pop(a - counter)
        counter += 1


def splitByChar(sublistIndex, charToSplit):
    for a in main_list:
        string1 = a[sublistIndex][:a[sublistIndex].find(charToSplit)]
        string2 = a[sublistIndex][a[sublistIndex].find(charToSplit):]
        a.insert(2, string2)
        a.insert(2, string1)
        a.pop(4) 


def removeToChar(sub_index, upToChar):
    for a in main_list:
        if (a[sub_index].find(upToChar) != -1):
            a[sub_index] = a[sub_index][a[sub_index].find(upToChar) + 1:]


def removeFromChar(sub_index, fromChar):
    for a in main_list:
        if (a[sub_index].find(fromChar) != -1):
            a[sub_index] = a[sub_index][:a[sub_index].find(fromChar)]


def takeOffLastChar(main_index):
    for a in main_list:
        a[main_index] = a[main_index][:len(a[main_index]) - 1]


def findBadRows(whereToCheck, whatToCheck):
    theList = []
    for a in main_list:
        if a[whereToCheck] == whatToCheck:
            theList.append(main_list.index(a))
    return theList


def removeBadRows(list_to_remove):
    current = 0
    print list_to_remove
    for a in list_to_remove:
        main_list.pop(a - current)
        current += 1


def addRow(where, what):
    main_list.insert(where, what)


def addCol(where, what):
    if (what != -1):
        for a in main_list:
            a.insert(where, what)
    else:
        counter = 0
        for a in main_list:
            a.insert(where, counter)
            counter += 1


def removeRow(where):
    main_list.pop(where)


def removeCol(where):
    for a in main_list:
        a.pop(where)


def replaceChar(subIndex, charToReplace, charToPlace):
    for a in main_list:
        if (a[subIndex].find(charToReplace) != -1):
            list1 = list(a[subIndex])
            list1[a[subIndex].find(' ')] = '_'
            a[subIndex] = ''.join(list1)
def unitConvert(thestring, factor):
    search=re.search(re.compile("(\d+\.*\d*)(.*)"), thestring)
    if(search.group(2)[0]=="µ"):
        return str(factor*float(search.group(1))*.000001)
    elif(search.group(2)[0]=="m"):
        return str(factor*float(search.group(1))*.001)
    elif(search.group(2)[0]=="p"):
        return str(factor*float(search.group(1))*.000000000001)
    elif(search.group(2)[0]=="n"):
        return str(factor*float(search.group(1))*.000000001)
    else:
        return str(factor*float(search.group(1)))

f = open('/Users/aidancurtis/Desktop/final_no_headers.csv', 'rb')

csv_f = csv.reader(f)
main_list = []
sub_list = []
# do not change
for a in csv_f:
    for b in a:
        sub_list.append(b)
    main_list.append(sub_list)
    sub_list = []

f.close()

# change code here and add functions
for a in main_list:
    
        search=re.search(re.compile("(-*\d+).*"),str(a[21]))
        if(search):
           main_list[main_list.index(a)][21]=search.group(1)

# print the list
# do not change code
f = open('/Users/aidancurtis/Desktop/final_no_headers.csv', 'wb')
csv_writer = csv.writer(f)
for a in main_list:
    csv_writer.writerow(a)
f.close()
