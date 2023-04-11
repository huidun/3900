import sqlite3
import validation as V
from flask import abort


def friend_customer_follow_unfollow(token, customer_id, followtype):
    """given a customer_id, follow this customer"""
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
    follower_id = V.get_info(token)["id"]
    if follower_id == customer_id:
        abort(400, description="Cannot follow yourself.")
    if followtype == 'unfollow':
        delete_info = '''DElETE FROM FRIEND 
                    WHERE FOLLOWEE = ?
                    AND FOLLOWER  = ?'''

        c.execute(delete_info, (customer_id, follower_id))
    else:
        friend_info = '''INSERT INTO FRIEND (FOLLOWEE, FOLLOWER)
                    VALUES(?, ?)'''

        val = (customer_id, follower_id)

        c.execute(friend_info, val)

    c.close()
    conn.commit()
    conn.close()

    return {
    }


def friend_customer_followbyemail(token, customer_email):
    """given a customer_email, follow this customer"""
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
    # check the email
    V.find_email(True, customer_email)
    follower_id = V.get_info(token)["id"]
    followee_id = V.find_id(customer_email)
    # check the id
    if follower_id == followee_id:
        abort(400, description="Cannot follow yourself.")
    friend_info = '''INSERT INTO FRIEND (FOLLOWEE, FOLLOWER)
                 VALUES(?, ?)'''

    val = (followee_id, follower_id)

    c.execute(friend_info, val)

    get_id = '''SELECT last_insert_rowid() from FRIEND
                    '''
    c.execute(get_id)
    data = c.fetchone()

    if data is None:
        abort(400, description="Cannot follow with provided id.")

    friend_id = data[0]

    c.close()
    conn.commit()
    conn.close()

    return {
        "friend_id": friend_id
    }


def friends_all(customer_id):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    follower_string = f'''
    SELECT * FROM FRIEND
    WHERE FOLLOWEE = {customer_id}
    '''
    c.execute(follower_string)
    result = c.fetchall()
    follower_list = []

    for tp in result:
        follower_id = tp[2]

        c.execute(f'''SELECT * FROM CUSTOMER WHERE ID = {follower_id}''')
        customer_result = c.fetchone()
        follower_name = customer_result[1]
        follower_email = customer_result[2]
        follower_dict = {
            "name": follower_name,
            "id": follower_id,
            "email": follower_email
        }
        follower_list.append(follower_dict)

    following_string = f'''
        SELECT * FROM FRIEND
        WHERE FOLLOWER = {customer_id}
    '''
    c.execute(following_string)
    following_result = c.fetchall()
    following_list = []
    for tp in following_result:
        following_id = tp[1]
        c.execute(f'''SELECT * FROM CUSTOMER WHERE ID = {following_id}''')
        following_result = c.fetchone()
        following_name = following_result[1]
        following_email = following_result[2]
        following_dict = {
            "name": following_name,
            "id": following_id,
            "email": following_email
        }
        following_list.append(following_dict)

    return_dict = {
        "follower": follower_list,
        "following": following_list
    }
    return return_dict


def friend_profile(customer_id):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()
    # later can change selected to profile's visible attributes
    profile_string = f'''
    SELECT name, email 
    FROM CUSTOMER
    WHERE ID = {customer_id}
    '''
    c.execute(profile_string)
    profile_result = c.fetchone()
    return_dict = {
        "name": profile_result[0],
        "email": profile_result[1]
    }
    return return_dict


def search_friend(customer_id, search_word):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    customer_name_query = f'''
    SELECT NAME FROM CUSTOMER c
    WHERE c.ID = {customer_id};
    '''
    c.execute(customer_name_query)
    customer_name_result = c.fetchone()
    customer_name = customer_name_result[0]

    follower_query = f'''
    SELECT FOLLOWEE FROM FRIEND f
    WHERE f.FOLLOWER = {customer_id};
    '''
    c.execute(follower_query)
    followee_result = c.fetchall()
    followee_list = []
    followee_list.append(int(customer_id))

    for tp in followee_result:
        followee_list.append(tp[0])
    print(followee_list)
    find_email_query = f'''
    SELECT ID, NAME, EMAIL FROM CUSTOMER c
    WHERE c.EMAIL = "{search_word}";
    '''
    c.execute(find_email_query)
    result = c.fetchone()
    return_list = []
    # check if the search word is a valid email
    if result is not None:
        id = result[0]
        if id not in followee_list:
            return_dict = {
                "id": result[0],
                "name": result[1],
                "email": result[2]
            }
            return_list.append(return_dict)
        return return_list
    # it is a name
    else:
        query = f'''SELECT ID, NAME, EMAIL
                FROM CUSTOMER c
                WHERE c.NAME LIKE "%{search_word}%"
                '''
        c.execute(query)
        result = c.fetchall()
        for tp in result:
            if tp is not None:
                id = tp[0]
                if id not in followee_list:
                    return_dict = {
                        "id": tp[0],
                        "name": tp[1],
                        "email": tp[2]
                    }
                    return_list.append(return_dict)
        return return_list
