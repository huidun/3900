import sqlite3
# from json import dumps
# import jwt
import validation as V
# from flask import abort
import hashlib


def auth_register(name, email, password, type):
    """given name, email, password for new user's registration"""

    # check email and password are valid
    V.valid_email_format(email)
    V.valid_email_not_registered(email)
    V.valid_password(password)
    V.valid_name(name)


    # generate OTP token for login by using email
    token = V.generate_token(email)

    # encrypt password
    hashpass = hashlib.sha256(password.encode()).hexdigest()

    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()
    
    # add name, email, password and token into database
    if type:
        # true for customer
        add_info = '''INSERT INTO CUSTOMER (NAME, EMAIL, PASSWORD, TOKEN)
            VALUES(?, ?, ?, ?)'''
    else:
        # false for restaurant
        add_info = '''INSERT INTO RESTAURANT (NAME, EMAIL, PASSWORD, TOKEN)
            VALUES(?, ?, ?, ?)'''
    
    val = (name, email, hashpass, token)
    c.execute(add_info, val)

    # get the id from database
    if type:
        get_id = '''SELECT ID FROM CUSTOMER
                    WHERE  TOKEN = ?
                    '''
    else:
        get_id = '''SELECT ID FROM RESTAURANT
                    WHERE  TOKEN = ?
                    '''
    c.execute(get_id, (token,))

    row = c.fetchone()
    id = row[0]

    conn.commit()
    c.close()
    conn.close()
    return {
        'id': id,
        'token': token
    }


def auth_login(type, email, password):
    """given email and password to login"""

    # verify email and password
    V.find_email(type, email)
    hashpass = hashlib.sha256(password.encode()).hexdigest()
    V.correct_password(type, email, hashpass)

    # generate OTP token
    token = V.generate_token(email)

    id = V.find_id(email)
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
        cus_query = '''UPDATE CUSTOMER 
            SET TOKEN = ? 
            WHERE EMAIL = ?
        '''
        c.execute(cus_query, (token, email))
    else:
        res_query = '''UPDATE RESTAURANT 
            SET TOKEN = ? 
            WHERE EMAIL = ?
        '''
        c.execute(res_query, (token, email))
    c.close()
    conn.commit()
    conn.close()
    return {
        'id' : id,
        'token' : token
    }


def auth_logout(token):
    """click to logout"""

    if not V.valid_token(token):
        return {
            'is_success': False
        }

    type = V.find_type(token)
    info = V.get_info(token)
    id = info['id']

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
        cus_query = '''UPDATE CUSTOMER 
            SET TOKEN = NULL 
            WHERE ID = ?
        '''
        c.execute(cus_query, (id, ))
    else:
        res_query = '''UPDATE RESTAURANT 
            SET TOKEN = NULL 
            WHERE ID = ?
        '''
        c.execute(res_query, (id, ))

    c.close()
    conn.commit()
    conn.close()

    return {
        'is_success' : True
    }


def auth_passwordreset_request(email):
    """send reset code to user's email address when he requests to reset password"""

    # save reset code in database
    reset_code = V.unique_code_generate(6)

    type = V.find_type_byemail(email)

    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    if type:
        query = '''UPDATE CUSTOMER
            SET RESET_CODE = ?
            WHERE EMAIL = ?
        '''
    else:
        query = '''UPDATE RESTAURANT
             SET RESET_CODE = ?
             WHERE EMAIL = ?
         '''
    val = (reset_code, email)
    c.execute(query, val)

    c.close()
    conn.commit()
    conn.close()

    return reset_code


def auth_passwordreset_reset(email, reset_code, new_password):
    """given correct reset_code to reset password"""

    type = V.find_type_byemail(email)

    id = V.find_id(email)

    # check reset code validation
    V.valid_reset_code(reset_code, id, type)

    # check new password validation
    V.valid_password(new_password)
    hashpass = V.valid_new_password(new_password, id, type)

    # update password in database

    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    if type:
        query = '''UPDATE CUSTOMER
            SET PASSWORD = ?
            WHERE ID = ?
        '''
    else:
        query = '''UPDATE RESTAURANT
             SET PASSWORD = ?
             WHERE ID = ?
         '''
    val = (hashpass, id)
    c.execute(query, val)

    c.close()
    conn.commit()
    conn.close()

    return {}



