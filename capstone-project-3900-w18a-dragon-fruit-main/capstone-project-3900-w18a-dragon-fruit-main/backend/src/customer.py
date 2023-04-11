import hashlib
import sqlite3
import validation as V
from flask import abort


def customer_profile_details(id):
    """given a id, return the name and email of the corresponding customer"""
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()
    
    # find customer name and email with id
    query = '''SELECT NAME, EMAIL
        FROM CUSTOMER
        WHERE ID = ?
        '''
    c.execute(query, (id,))
    data = c.fetchone()
    
    if data is None:
        abort(400, description="Cannot find customer with provided id.")
        #raise InputError("Cannot find customer with provided id")
    
    name = data[0]
    email = data[1]

    c.close()
    conn.commit()
    conn.close()

    return {
        'name': name,
        'email': email
    }


def customer_profile_edit_name(token, name):
    """given a token and a new name, change the name of the customer in database"""
    # check name is valid
    V.valid_name(name)

    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }
        
    c = conn.cursor()
    
    # check token is valid
    V.validate_customer_token(c, token)
    
    # update user name with token
    query = '''UPDATE CUSTOMER
        SET NAME = ?
        WHERE TOKEN = ?
        '''
    val = (name, token)
    c.execute(query, val)

    c.close()
    conn.commit()
    conn.close()

    return {
    }


def customer_profile_edit_password(token, opassword, npassword):
    """given a token, an old password and a new password, change the password of the customer in database"""
    # encode the password
    nhashpass = hashlib.sha256(npassword.encode()).hexdigest()
    ohashpass = hashlib.sha256(opassword.encode()).hexdigest()

    # check whether the old password exists
    if not V.exists_customer_password(token, ohashpass):
        abort(400, description="Old password is not correct.")

    # check password is valid
    V.valid_password(npassword)

    if V.exists_customer_password(token, nhashpass) == True:
        abort(401, description="New password should be different.")

    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    # check token is valid
    V.validate_customer_token(c, token)

    # update user password with token
    query = '''UPDATE CUSTOMER
        SET PASSWORD = ?
        WHERE TOKEN = ?
        '''
    val = (nhashpass, token)
    c.execute(query, val)

    c.close()
    conn.commit()
    conn.close()

    return {
    }
