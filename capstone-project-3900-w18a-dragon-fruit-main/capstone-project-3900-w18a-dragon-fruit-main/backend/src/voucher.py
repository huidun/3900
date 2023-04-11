import sqlite3
import validation as V
from flask import abort
from datetime import datetime, timedelta
import time
import subscription


def restaurant_voucher_add(token, voucher, total_number, start_release_time, end_release_time, repetitions):
    """given voucher details, add a new voucher into the database"""
    (voucher_name, start_time, end_time, discount, description) = (
        voucher['voucher_name'], V.str_to_dt(voucher['start_time']), V.str_to_dt(voucher['end_time']),
        voucher['discount'], voucher['description'])

    start_release_time = V.str_to_dt(start_release_time)
    end_release_time = V.str_to_dt(end_release_time)

    # validate name, description and time
    repetitions = int(repetitions)
    V.valid_name(voucher_name)
    V.valid_description(description)
    V.valid_repetitions(repetitions)
    '''
    now = datetime.now()
    now = now.strftime("%Y-%m-%d %H:%M:%S")
    now = datetime.strptime(now, '%Y-%m-%d %H:%M:%S')
    V.valid_time(start_release_time, end_release_time, now)
    '''

    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    id_list = []

    for i in range(repetitions):
        # add vouchers into voucher table
        add_info1 = '''INSERT INTO VOUCHER (NAME, START_TIME, END_TIME, DISCOUNT_RATE, DESCRIPTION)
                VALUES(?, ?, ?, ?, ?)'''

        val1 = (voucher_name, start_time, end_time, discount, description)
        c.execute(add_info1, val1)

        # get the id of newly added voucher
        get_id = '''SELECT LAST_INSERT_ROWID()'''
        c.execute(get_id)
        row = c.fetchone()
        v_id = row[0]
        id_list.append(v_id)

        # add into restaurant_voucher
        info = V.get_info(token)
        r_id = info['id']

        add_info2 = '''INSERT INTO RESTAURANT_VOUCHER (
                    RESTAURANT, VOUCHER, ALL_NUMBER, 
                    AVAILABLE_NUMBER, START_TIME, END_TIME)
                    VALUES(?, ?, ?, ?, ?, ?)'''

        start_release_time2 = start_release_time + timedelta(days=7 * i)
        end_release_time2 = end_release_time + timedelta(days=7 * i)
        val2 = (r_id, v_id, total_number, total_number, start_release_time2, end_release_time2)
        c.execute(add_info2, val2)

    list_of_uid = V.find_subscribers(r_id)

    conn.commit()
    c.close()
    conn.close()

    for id in id_list:
        subscription.send_email(list_of_uid, id)

    return {
        'ids': id_list
    }

def restaurant_voucher_edit(token, voucher, all_number, start_release_time, end_release_time):
    '''given the latest voucher details, edit the detail of a existed voucher and update into the database'''
    # extract individual data from input
    (voucher_name, voucher_id, start_time, end_time, discount, description) = (
        voucher['voucher_name'], voucher['voucher_id'], 
        V.str_to_dt(voucher['start_time']), V.str_to_dt(voucher['end_time']), 
        voucher['discount'], voucher['description'])

    start_release_time = V.str_to_dt(start_release_time)
    end_release_time = V.str_to_dt(end_release_time)
    all_number = int(all_number)

    # validate name and description
    V.valid_name(voucher_name)
    V.valid_description(description)

    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    # update voucher details in voucher table
    query = '''UPDATE VOUCHER
        SET NAME = ?,
            START_TIME = ?,
            END_TIME = ?, 
            DISCOUNT_RATE = ?, 
            DESCRIPTION = ?
        WHERE ID = ?
        '''
    val = (voucher_name, start_time, end_time, discount, description, voucher_id)
    c.execute(query, val)

    # find restaurant id by token
    info = V.get_info(token)
    r_id = info['id']

    # calculate available number
    query2 = '''SELECT ALL_NUMBER, AVAILABLE_NUMBER
        FROM RESTAURANT_VOUCHER
        WHERE RESTAURANT = ?
        AND VOUCHER = ?   
    '''
    val = (r_id, voucher_id)
    c.execute(query2, val)
    data = c.fetchone()
    old_all_number = data[0]
    old_available_number = data[1]
    available_number = V.cal_availability(all_number, old_all_number, old_available_number)

    # update info in restaurant_voucher
    query3 = '''UPDATE RESTAURANT_VOUCHER
        SET ALL_NUMBER = ?,
            AVAILABLE_NUMBER = ?,
            START_TIME = ?,
            END_TIME = ?            
        WHERE RESTAURANT = ?
        AND VOUCHER = ?
        '''
    val = (all_number, available_number, start_release_time, end_release_time, r_id, voucher_id)
    c.execute(query3, val)

    conn.commit()
    c.close()
    conn.close()

    return {}

def restaurant_voucher_details(v_id):
    """given a voucher id, return the details of the corresponding voucher for restaurant"""
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    # find voucher details with v_id
    (name, start_time, end_time, discount, description) = V.voucher_info(v_id, c)
    # print(type(start_time), start_time)

    # find restaurant voucher details with v_id
    (all_number, available_number, start_release_time, end_release_time) = V.restaurant_voucher_info(v_id, c)

    c.close()
    conn.commit()
    conn.close()

    return {
        "voucher_name": name,
        "start_time": start_time,
        "end_time": end_time,
        "discount": discount,
        "description": description,
        "all_number": all_number,
        "available_number": available_number,
        "start_release_time": start_release_time,
        "end_release_time": end_release_time
    }

def customer_voucher_book(token, voucher_id):
    """given a voucher id and customer token, help the customer book a voucher"""

    # find whether user is already logged in
    V.valid_token(token)

    # verify that the user is a customer
    type = V.find_type(token)

    if not type:
        abort(405, description='Only customers can book voucher')


    # find the customer id
    info = V.get_info(token)
    c_id = info['id']

    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    # check if the customer has already booked the same discount voucher
    V.vaild_customer_book(c_id, voucher_id)

    # update voucher available number
    available_number = V.find_available_number(voucher_id)

    query3 = '''UPDATE RESTAURANT_VOUCHER
        SET AVAILABLE_NUMBER = ?
        WHERE VOUCHER = ?
    '''
    val = (available_number, voucher_id)
    c.execute(query3, val)

    # add voucher into customer_voucher table
    voucher_state = "unused"
    code = V.voucher_code_generate(voucher_id, c_id)
    add_info = '''INSERT INTO CUSTOMER_VOUCHER (CUSTOMER, VOUCHER, STATE, CODE)
            VALUES(?, ?, ?, ?)'''
    val1 = (c_id, voucher_id, voucher_state, code)
    c.execute(add_info, val1)

    c.close()
    conn.commit()
    conn.close()

    return {}

def customer_voucher_details(token, v_id):
    """given a voucher id, return the details of 
        the corresponding voucher for customer"""
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    # find voucher details with v_id
    (name, start_time, end_time, discount, description) = V.voucher_info(v_id, c)

    # find customer voucher details with v_id, c_id and token
    info = V.get_info(token)
    c_id = info['id']
    
    (state, date, code) = V.customer_voucher_info(v_id, c_id, c)

    # find restaurant name
    restaurant_info = V.find_restaurant_by_voucher(v_id)
    restaurant_name = restaurant_info[0]
    address = restaurant_info[1]
    postcode = restaurant_info[2]
    phone_num = restaurant_info[3]

    c.close()
    conn.commit()
    conn.close()

    return {
        "voucher_name": name,
        "start_time": start_time,
        "end_time": end_time,
        "discount": discount,
        "description": description,
        "state": state,
        "date": date,
        "code": code,
        "restaurant_name": restaurant_name,
        "address": address,
        "postcode": postcode,
        "phone_num": phone_num

    }

def restaurant_vouchers_all(r_id):
    """given a reataurant id, return details of all 
        vouchers that the restaurant has"""
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    vouchers = []

    # get vouchers for restaurant
    query = '''SELECT VOUCHER
        FROM RESTAURANT_VOUCHER
        WHERE RESTAURANT = ?
        '''
    c.execute(query, (r_id,))

    data = c.fetchall()
    
    for val in data:
        v_id = val[0]
        (name, start_time, end_time, discount, description) = V.voucher_info(v_id, c)
        (all_number, available_number, start_release_time, end_release_time) = V.restaurant_voucher_info(v_id, c)

        voucher = {
            "voucher_id": v_id,
            "voucher_name": name,
            "start_time": start_time,
            "end_time": end_time,
            "discount": discount,
            "description": description,
            "all_number": all_number,
            "available_number": available_number,
            "start_release_time": start_release_time,
            "end_release_time": end_release_time
        }
        vouchers.append(voucher)
        
    c.close()
    conn.commit()
    conn.close()

    return {
        "vouchers": vouchers
    }


def customer_vouchers_all(c_id):
    """given a customer id, return details of all 
        vouchers that the customer has"""
    unused = []
    used_uncommented = []
    commented = []
    expired = []

    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    # get vouchers for customer
    query = '''SELECT VOUCHER, STATE
        FROM CUSTOMER_VOUCHER
        WHERE CUSTOMER = ?
        '''
    c.execute(query, (c_id,))

    data = c.fetchall()
    
    for val in data:
        v_id = val[0]
        state = val[1]
        (name, start_time, end_time, discount, description) = V.voucher_info(v_id, c)
        restaurant_info = V.find_restaurant_by_voucher(v_id)
        restaurant_name = restaurant_info[0]
        voucher = {
            "voucher_id": v_id,
            "voucher_name": name,
            "start_time": start_time,
            "end_time": end_time,
            "discount": discount,
            "description": description,
            "restaurant_name": restaurant_name
        }

        if state == "unused":
            unused.append(voucher)
        elif state == "used_uncommented":
            used_uncommented.append(voucher)
        elif state == "commented":
            commented.append(voucher)
        elif state == "expired":
            expired.append(voucher)
    
    c.close()
    conn.commit()
    conn.close()

    return {
        "unused": unused,
        "used_uncommented": used_uncommented,
        "commented": commented,
        "expired": expired
    }


def restaurant_voucher_verify(code, email):
    """given voucher code and email to verify voucher when customer want to use it"""

    # get customer's info
    id = V.find_id(email)

    # check voucher code validation
    voucher_id = V.valid_voucher_code(code, id)

    # get voucher id
    state = "used_uncommented"
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    # check expiration date
    query3 = '''SELECT DISCOUNT_RATE, DESCRIPTION, START_TIME, END_TIME, NAME
        FROM VOUCHER
        WHERE ID = ?           
    '''

    c.execute(query3, (voucher_id, ))
    info = c.fetchone()

    time1 = V.db_str_to_dt(info[2])
    time2 = V.db_str_to_dt(info[3])
    n_time = datetime.now()
    V.valid_not_expired(time1, time2, n_time)

    # get info of voucher
    discount = info[0]
    description = info[1]
    start_time = info[2]
    end_time = info[3]
    name = info[4]

    # change state of this voucher
    query = '''UPDATE CUSTOMER_VOUCHER
        SET STATE = ?
        WHERE CODE = ?      
    '''
    val = (state, code)
    c.execute(query, val)

    c.close()
    conn.commit()
    conn.close()

    return {
        'name': name,
        'discount': discount,
        'description': description,
        'start_time': start_time,
        'end_time': end_time
    }


def restaurant_voucher_summary(r_id):
    """given restaurant id, return the summary of
    how many vouchers were booked each day"""
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    # get vouchers for restaurant
    v_list = []
    query = '''SELECT VOUCHER
        FROM RESTAURANT_VOUCHER
        WHERE RESTAURANT = ?
        '''
    c.execute(query, (r_id,))
    data = c.fetchall()
    
    for val in data:
        v_id = val[0]
        v_list.append(v_id)
    
    # order by date in customer_voucher
    query = '''SELECT DATE
        FROM CUSTOMER_VOUCHER
        WHERE VOUCHER in ({seq})
        ORDER BY DATE DESC
        '''.format(seq=','.join(['?']*len(v_list)))
    
    c.execute(query, v_list)
    data = c.fetchall()

    # count summary according to date
    date_list = []
    summary = []
    for info in data:
        if len(date_list) == 10:
            break
        date = info[0]
        if date not in date_list:
            date_list.append(date)
            summary.append({"date": date, "sale": 1})
        else:
            V.update_sale(summary, date)
    
    c.close()
    conn.commit()
    conn.close()

    return {
        "summary": summary
    }






