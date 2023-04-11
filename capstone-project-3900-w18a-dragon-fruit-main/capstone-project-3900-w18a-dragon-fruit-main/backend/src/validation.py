import re
import sqlite3
from flask import abort, request
import jwt
from datetime import datetime
import string
import random
import hashlib

# Make a regular expression
# for validating an Email
regex = r'^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$'


# generate token
def generate_token(email):
    msg = {
        'email': email
    }
    token = jwt.encode(msg, 'secret',
                       algorithm='HS256').decode('utf-8')
    return token


# generate random reset code
def unique_code_generate(n):
    return ''.join(random.choice(string.ascii_uppercase) for _ in range(n))


# generate random voucher code
def voucher_code_generate(voucher_id, c_id):
    random1 = unique_code_generate(2)
    random2 = unique_code_generate(4)
    return str(voucher_id) + random1 + str(c_id) + random2


# check reset code validation
def valid_reset_code(reset_code, id, type):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    if type:
        query = '''SELECT RESET_CODE
            FROM CUSTOMER
            WHERE ID = ?
        '''
    else:
        query = '''SELECT RESET_CODE
            FROM RESTAURANT
            WHERE ID = ?
        '''

    c.execute(query, (id,))
    reset_code_true = c.fetchone()[0]

    c.close()
    conn.commit()
    conn.close()

    if reset_code_true != reset_code:
        abort(401, description='Wrong reset reset code')
    return True


# check new password
def valid_new_password(new_password, id, type):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()
    if type:
        query = '''SELECT PASSWORD
            FROM CUSTOMER
            WHERE ID = ?
        '''
    else:
        query = '''SELECT PASSWORD
            FROM RESTAURANT
            WHERE ID = ?
        '''
    c.execute(query, (id,))
    old_hashpass = c.fetchone()[0]
    new_hashpass = hashlib.sha256(new_password.encode()).hexdigest()
    if old_hashpass == new_hashpass:
        abort(401, description='New password cannot be the same as the old one')

    return new_hashpass


# check email format
def valid_email_format(email):
    if (re.search(regex, email)):
        return True
    else:
        abort(400, description="Email is invalid")


# check if email is registered (type given)
def find_email(type, email):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()
    if type:
        cus_query = '''SELECT EMAIL
            FROM CUSTOMER c
            WHERE c.EMAIL = ?
            '''
        c.execute(cus_query, (email,))
        data = c.fetchone()
    else:
        res_query = '''SELECT EMAIL
            FROM RESTAURANT r
            WHERE r.EMAIL = ?
            '''
        c.execute(res_query, (email,))
        data = c.fetchone()

    c.close()
    conn.commit()
    conn.close()

    if data is not None:
        return True
    else:
        abort(400, description="Email is not registered .")


# find id by given email
def find_id(email):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    # find customer id by email
    cus_query = '''SELECT ID
        FROM CUSTOMER
        WHERE EMAIL = ?
        '''
    c.execute(cus_query, (email,))
    data = c.fetchone()

    if data is None:
        # find restaurant id by email
        res_query = '''SELECT ID
        FROM RESTAURANT
        WHERE EMAIL = ?
        '''
        c.execute(res_query, (email,))
        data = c.fetchone()

    # if email cannot match any user
    if data is None:
        abort(400, description="Cannot find user with provided email")
        # raise InputError("Cannot find user with provided token")

    id = data[0]

    c.close()
    conn.commit()
    conn.close()

    return id


def find_type_byemail(email):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    cus_query = '''SELECT ID
        FROM CUSTOMER 
        WHERE EMAIL = ?
        '''
    c.execute(cus_query, (email,))
    cus_data = c.fetchone()

    res_query = '''SELECT ID
        FROM RESTAURANT
        WHERE EMAIL = ?
        '''
    c.execute(res_query, (email,))
    res_data = c.fetchone()

    c.close()
    conn.commit()
    conn.close()

    if cus_data is not None:
        return True
    elif res_data is not None:
        return False
    else:
        abort(400, description="The email is invalid")


# given a token return type of user: true -- customer, false -- restaurant
def find_type(token):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    cus_query = '''SELECT TOKEN
        FROM CUSTOMER 
        WHERE TOKEN = ?
        '''
    c.execute(cus_query, (token,))
    cus_data = c.fetchone()

    res_query = '''SELECT TOKEN
        FROM RESTAURANT
        WHERE TOKEN = ?
        '''
    c.execute(res_query, (token,))
    res_data = c.fetchone()

    c.close()
    conn.commit()
    conn.close()

    if cus_data is not None:
        return True
    elif res_data is not None:
        return False


# given a token return the corresponding id and name
def get_info(token):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    # find customer name and email with token
    cus_query = '''SELECT ID, NAME
        FROM CUSTOMER
        WHERE TOKEN = ?
        '''
    c.execute(cus_query, (token,))
    data = c.fetchone()

    if data is not None:
        id = data[0]
        name = data[1]

        num = find_unused_number(id)
        unread_msg = find_unread_message(id)
        info = {
            'id': id,
            'name': name,
            'unused_voucher': num,
            'unread_message': unread_msg
        }
    else:
        # find restaurant name and email with token
        res_query = '''SELECT ID, NAME
        FROM RESTAURANT
        WHERE TOKEN = ?
        '''
        c.execute(res_query, (token,))
        data = c.fetchone()

        if data is None:
            abort(400, description="Cannot find user with provided token")

        id = data[0]
        name = data[1]

        info = {
            'id': id,
            'name': name
        }

    c.close()
    conn.commit()
    conn.close()

    return info


def find_unused_number(c_id):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    state = 'unused'
    query = '''SELECT VOUCHER
            FROM CUSTOMER_VOUCHER
            WHERE CUSTOMER = ? AND STATE = ?
            '''
    val = (c_id, state)
    c.execute(query, val)
    data = c.fetchall()

    num = len(data)

    c.close()
    conn.commit()
    conn.close()

    return num


def find_unread_message(c_id):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    is_read = False
    query = '''SELECT READ
            FROM MESSAGE
            WHERE SENDEE = ? AND READ = ?
            '''
    val = (c_id, is_read)
    c.execute(query, val)
    data = c.fetchall()

    num = len(data)

    c.close()
    conn.commit()
    conn.close()

    return num


def find_user_name(c_id):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    query = '''SELECT NAME, EMAIL
        FROM CUSTOMER
        WHERE ID = ?
        '''
    c.execute(query, (c_id,))
    data = c.fetchone()

    c.close()
    conn.commit()
    conn.close()

    if data is not None:
        return data


def find_unread_message_dm(user_id,c_id):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    is_read = False
    query = '''SELECT READ
            FROM MESSAGE
            WHERE SENDEE = ? 
            AND SENDER = ?
            AND READ = ?
            '''
    val = (user_id, c_id, is_read)
    c.execute(query, val)
    data = c.fetchall()

    num = len(data)

    c.close()
    conn.commit()
    conn.close()

    return num


def find_user_msg(u_id, c_id):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    msg_info = '''SELECT  *
            FROM MESSAGE
            WHERE (SENDEE = ?
            AND SENDER = ?)
            OR (SENDER = ?
            AND SENDEE = ?)
            ORDER BY ID
        '''
    val = (c_id, u_id, c_id, u_id)
    c.execute(msg_info, val)
    result = c.fetchall()

    c.close()
    conn.commit()
    conn.close()

    return result


def valid_email_not_registered(email):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    # check that email has not been registered as a customer
    cus_query = '''SELECT EMAIL
        FROM CUSTOMER c
        WHERE c.EMAIL = ?
        '''
    c.execute(cus_query, (email,))
    cus_data = c.fetchone()

    # check that email has not been registered as a restaurant
    res_query = '''SELECT EMAIL
        FROM RESTAURANT r
        WHERE r.EMAIL = ?
        '''
    c.execute(res_query, (email,))
    res_data = c.fetchone()

    c.close()
    conn.commit()
    conn.close()

    if cus_data is not None or res_data is not None:
        abort(400, description="Email has been registered already.")
        # raise InputError("Email has been registered already.")
    return True


# check password length greater than 6
def valid_password(password):
    if len(password) < 6:
        abort(401, description="Password should contain at least 6 characters.")
    else:
        return True


# check password correctness
def correct_password(type, email, password):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    if type:
        cus_query = '''SELECT PASSWORD
            FROM CUSTOMER
            WHERE EMAIL = ?
            '''
        c.execute(cus_query, (email,))
        data = c.fetchone()
        true_password = data[0]
    else:
        res_query = '''SELECT PASSWORD
            FROM RESTAURANT
            WHERE EMAIL = ?
            '''
        c.execute(res_query, (email,))
        data = c.fetchone()
        true_password = data[0]

    c.close()
    conn.commit()
    conn.close()

    if password == true_password:
        return True
    else:
        abort(401, description="Wrong password")


# check name is between 1-50 characters inclusive in length
def valid_name(name):
    if len(name) < 1:
        abort(401, description="Name cannot be empty.")
    elif len(name) > 50:
        abort(401, description="Please enter a name between 1-50 characters long.")
    else:
        return True


# check description is less than 1000 characters
def valid_description(description):
    if len(description) > 1000:
        abort(400, description="Description is too long.")
    else:
        return True


# check token is valid
def valid_token(token):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()
    cus_query = '''SELECT *
        FROM CUSTOMER
        WHERE TOKEN = ?
        '''
    c.execute(cus_query, (token,))
    cus_data = c.fetchone()

    res_query = '''SELECT *
        FROM RESTAURANT
        WHERE TOKEN = ?
        '''
    c.execute(res_query, (token,))
    res_data = c.fetchone()

    c.close()
    conn.commit()
    conn.close()

    if res_data != None or cus_data != None:
        return True
    else:
        return False


# check that given token is a valid customer, raise error if not
def validate_customer_token(c, token):
    query = '''SELECT *
        FROM CUSTOMER
        WHERE TOKEN = ?
        '''
    c.execute(query, (token,))
    data = c.fetchone()

    if data is None:
        # raise AccessError("Cannot find customer with provided token")
        abort(400, description="Cannot find customer with provided token.")
    return True


# check that given token is a valid restaurant, raise error if not
def validate_restaurant_token(c, token):
    query = '''SELECT *
        FROM RESTAURANT
        WHERE TOKEN = ?
        '''
    c.execute(query, (token,))
    data = c.fetchone()

    if data is None:
        abort(400, description="Cannot find restaurant with provided token.")
    return True


# check if the cuisine_name already exists in database
# return cuisine data if existed, None if not
def validate_cuisine_exist(c, cuisine_name):
    query = f''' SELECT *
    FROM CUISINE 
    WHERE NAME = "{cuisine_name}";
    '''
    c.execute(query)
    data = c.fetchone()
    if data is None:
        return None

    return data


# check password exists
def exists_customer_password(token, password):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    query = '''SELECT PASSWORD
        FROM CUSTOMER
        WHERE TOKEN = ?
        '''
    c.execute(query, (token,))
    data = c.fetchone()

    c.close()
    conn.commit()
    conn.close()

    if data is not None and data[0] == password:
        return True
    else:
        return False


def exists_restaurant_password(token, password):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    query = '''SELECT PASSWORD
        FROM RESTAURANT
        WHERE TOKEN = ?
        '''
    c.execute(query, (token,))
    data = c.fetchone()

    c.close()
    conn.commit()
    conn.close()

    if data is not None and data[0] == password:
        return True
    else:
        return False


# calculate available_number in restaurant_voucher table
def cal_availability(all_number, old_all_number, old_available_number):
    give_out_number = old_all_number - old_available_number
    if all_number < give_out_number:
        abort(405, description="The total number is too small")

    available_number = all_number - give_out_number
    return available_number


# find and verify available number
def find_available_number(voucher_id):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    query = '''SELECT AVAILABLE_NUMBER
        FROM RESTAURANT_VOUCHER
        WHERE VOUCHER = ?
    '''
    c.execute(query, (voucher_id,))
    data = c.fetchone()
    if data is None:
        abort(405, description="Invalid voucher id")
    available_number = data[0]

    c.close()
    conn.commit()
    conn.close()

    if available_number == 0:
        abort(405, description="This is no more voucher left")

    available_number = available_number - 1

    return available_number


# check whether the customer has already booked the voucher
def vaild_customer_book(c_id, voucher_id):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    query = '''SELECT DATE
        FROM CUSTOMER_VOUCHER
        WHERE CUSTOMER = ?
        AND VOUCHER = ?
    '''
    val = (c_id, voucher_id)
    c.execute(query, val)
    data = c.fetchone()

    c.close()
    conn.commit()
    conn.close()

    if data is not None:
        abort(405, description="The customer has already booked this voucher")

    return True


# find voucher details with id
def voucher_info(v_id, c):
    query = '''SELECT NAME, datetime(START_TIME, 'localtime'), datetime(END_TIME, 'localtime'), 
        DISCOUNT_RATE, DESCRIPTION
        FROM VOUCHER
        WHERE ID = ?
        '''
    c.execute(query, (v_id,))
    data = c.fetchone()

    if data is None:
        abort(405, description="Cannot find voucher with provided id.")
    # print(type(data[1]), data[1])

    return data


# find restaurant voucher details
def restaurant_voucher_info(v_id, c):
    query = '''SELECT ALL_NUMBER, AVAILABLE_NUMBER,
        START_TIME, END_TIME
        FROM RESTAURANT_VOUCHER
        WHERE VOUCHER = ?
        '''
    c.execute(query, (v_id,))
    data = c.fetchone()

    if data is None:
        abort(405, description="Cannot find voucher with provided id.")
    return data


# find customer voucher details
def customer_voucher_info(v_id, c_id, c):
    query = '''SELECT STATE, DATE, CODE
        FROM CUSTOMER_VOUCHER
        WHERE VOUCHER = ? AND CUSTOMER = ?
        '''
    c.execute(query, (v_id, c_id))
    data = c.fetchone()

    if data is None:
        abort(405, description="Customer has not booked voucher with provided id.")
    return data


# check voucher code validation
def valid_voucher_code(code, id):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    query = '''SELECT CUSTOMER, STATE, VOUCHER
        FROM CUSTOMER_VOUCHER
        WHERE CODE = ?
    '''

    c.execute(query, (code,))
    data = c.fetchone()
    if data is None:
        abort(405, description='Invalid voucher code')

    owner_id = data[0]
    state = data[1]
    voucher_id = data[2]

    if owner_id != id:
        abort(405, description='User did not book this voucher')
    elif state != 'unused' and state != 'expired':
        abort(405, description='This voucher has already been used')

    c.close()
    conn.commit()
    conn.close()

    return voucher_id


# check that repetition is between 1 and 4 times
def valid_repetitions(repetitions):
    if repetitions < 1 or repetitions > 4:
        abort(402, description="Repetitions should be between 1 - 4.")


# helper function to convert string to datetime
def str_to_dt(time_str):
    # time_str = time_str.replace('T', ' ')
    # 2022-08-02T06:31:09.801Z
    lst = time_str.split('.')
    new_time_str = lst[0]

    return datetime.strptime(new_time_str, '%Y-%m-%dT%H:%M:%S')


def db_str_to_dt(time_str):
    return datetime.strptime(time_str, '%Y-%m-%d %H:%M:%S')


# check date expire
def valid_not_expired(time1, time2, n_time):
    if n_time < time1:
        abort(405, description="Voucher not yet available to use.")
    elif n_time > time2:
        abort(405, description="Voucher has expired.")
    else:
        return True


# get restaurant_id by voucher id
def get_restaurant_id_voucher(v_id, c):
    query = '''SELECT RESTAURANT
        FROM RESTAURANT_VOUCHER
        WHERE VOUCHER = ?
        '''
    c.execute(query, (v_id,))
    r_id = c.fetchone()[0]
    if r_id is None:
        abort(400, description="Restaurant doesn't have this voucher.")

    return r_id


# find vouchers
def customer_restaurant_voucher(id, c, type):
    if type:
        query = '''SELECT VOUCHER
            FROM CUSTOMER_VOUCHER
            WHERE CUSTOMER = ?
            '''
        c.execute(query, (id,))
        data = c.fetchall()
        if not data:
            abort(400, description="Customer has not booked voucher yet.")
    else:
        query = '''SELECT VOUCHER
                    FROM RESTAURANT_VOUCHER
                    WHERE RESTAURANT = ?
                    '''
        c.execute(query, (id,))
        data = c.fetchall()
        if not data:
            abort(400, description="Restaurant has not added voucher yet.")
    return data


# check customer has voucher of corresponding restaurant
def check_customer_has_voucher_of_restaurant(c_id, r_id, c):
    data_cus = customer_restaurant_voucher(c_id, c, True)
    data_res = customer_restaurant_voucher(r_id, c, False)

    voucher = [v for v in data_cus if v in data_res]

    if not voucher:
        abort(400, description="Customer has not booked voucher.")
    return True


# check start and end time of vouchers are valid when adding: now <= start < end
def valid_time(start, end, now):
    if now <= start < end:
        return True
    else:
        abort(405, description="Voucher time is not valid.")


# check if the dish_id already exists in database
# return True data if existed
def validate_dish_exist(c, dish_id):
    query = f''' SELECT *
    FROM DISH 
    WHERE ID = "{dish_id}";
    '''
    c.execute(query)
    data = c.fetchone()
    if data is None:
        abort(400, description="Cannot find dish with provided id.")
    return True


# check if the comment_id already exists in database
# return True data if existed
def validate_comment_exist(c, comment_id):
    query = f''' SELECT *
    FROM COMMENT 
    WHERE ID = "{comment_id}";
    '''
    c.execute(query)
    data = c.fetchone()
    if data is None:
        abort(400, description="Cannot find comment with provided id.")
    return True


def validate_message_exist(message_id):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    query = f''' SELECT *
    FROM MESSAGE 
    WHERE ID = "{message_id}";
    '''
    c.execute(query)
    data = c.fetchone()
    if data is None:
        abort(400, description="Cannot find message with provided id.")
    return True


# find the restaurant that voucher belongs to
def find_restaurant_by_voucher(voucher_id):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    query = '''SELECT RESTAURANT
        FROM RESTAURANT_VOUCHER
        WHERE VOUCHER = ?
    '''

    c.execute(query, (voucher_id,))
    r_id = c.fetchone()[0]

    query1 = '''SELECT NAME, ADDRESS, POSTCODE, PHONE_NUMBER
        FROM RESTAURANT
        WHERE ID = ?
    '''
    c.execute(query1, (r_id,))

    data = c.fetchone()

    c.close()
    conn.commit()
    conn.close()

    return data


# add the sale by 1 for the given date in summary
def update_sale(summary, date):
    for val in summary:
        if val['date'] == date:
            val['sale'] += 1


# get the number of pictures from database to be image name
def set_image_name(c):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    # find largest id
    query = '''SELECT * FROM PICTURE ORDER BY ID DESC LIMIT 1'''
    c.execute(query, )
    data = c.fetchone()
    if data == None:
        max_id = 0
    else:
        max_id = data[0]

    filename = 'pic' + str(max_id + 1) + '.jpg'

    conn.commit()
    c.close()
    conn.close()

    return filename

# find a picture from the restaurant and return the url
def find_picture(id):
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    pic_query = '''SELECT FILE_NAME
        FROM PICTURE
        WHERE RESTAURANT = ?'''
    
    c.execute(pic_query, (id,))
    data = c.fetchone()
    if data == None:
        picture = "https://d3aux7tjp119y2.cloudfront.net/original_images/Tak2-CMSTemplate_IrMZHla.jpg"
    else:
        picture = request.host_url + 'pictures/' + data[0]

    conn.commit()
    c.close()
    conn.close()

    return picture


def find_subscribers(r_id):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    query = '''SELECT CUSTOMER
            FROM SUBSCRIBE
            WHERE RESTAURANT = ?   
    '''
    c.execute(query, (r_id, ))
    data = c.fetchall()

    return data
