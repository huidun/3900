import sqlite3
import validation as V
# from flask import abort
import friend


def message_send_new(token, customer_id, message):
    """given a token, customer_id and message, send new message"""
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
    sender_id = V.get_info(token)["id"]
    is_read = False

    msg_info = '''INSERT INTO MESSAGE (SENDEE, SENDER, MESSAGE, READ)
                 VALUES(?, ?, ?, ?)'''

    val = (customer_id, sender_id, message, is_read)
    c.execute(msg_info, val)

    get_id = '''SELECT last_insert_rowid() from MESSAGE
                    '''
    c.execute(get_id)
    data = c.fetchone()
    message_id = data[0]

    c.close()
    conn.commit()
    conn.close()

    return {
        "message_id": message_id
    }


def message_get_detail(token, customer_id):
    """given a token, customer_id,  get detail of channel message"""
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
    user_id = V.get_info(token)["id"]
    user_msg = V.find_user_msg(user_id, customer_id)

    message_list = []
    is_read = True
    for msg in user_msg:
        # sendee is current user
        if msg[1] == user_id:
            change_state = '''UPDATE MESSAGE
                       SET READ = ?
                       WHERE SENDEE = ?  
                       AND SENDER =  ?
                   '''
            val = (is_read, user_id, customer_id)
            c.execute(change_state, val)
            user_name = V.find_user_name(customer_id)[0]
            msg_dict = {
                "message_id": msg[0],
                "user_id": msg[1],
                "user_name": user_name,
                "is_sender": False,
                "message": msg[3],
                "date": msg[4],
            }
            message_list.append(msg_dict)
        # sendee is friend
        elif int(msg[1]) == int(customer_id):
            user_name = V.get_info(token)["name"]
            msg_dict = {
                "message_id": msg[0],
                "user_id": msg[1],
                "user_name": user_name,
                "is_sender": True,
                "message": msg[3],
                "date": msg[4],
            }
            message_list.append(msg_dict)
    c.close()
    conn.commit()
    conn.close()
    return {"messages": message_list}


def message_show_all(customer_id):
    """given a token,  get all channel"""
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    user_id = customer_id

    friend_list= friend.friends_all(customer_id)
    friend_list = friend_list['follower'] + friend_list['following']
    friend_list = [dict(t) for t in set([tuple(d.items()) for d in friend_list])]
    
    channel_list = []
    for info in friend_list:
        if info.get('name') == None:
            break
        friend_name = info.get('name')
        friend_email = info.get('email')
        friend_id = info.get('id')
        channel_dict = {
            "customer_id": friend_id,
            "customer_name": friend_name,
            "customer_email": friend_email,
            "total_unread": V.find_unread_message_dm(customer_id, friend_id ),
        }
        channel_list.append(channel_dict)

    c.close()
    conn.commit()
    conn.close()
    return {
        "channels": channel_list}


def message_voucher_share(token, customer_id, v_id):
    """given a token, customer_id and message, send new message"""
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
    user_id = V.get_info(token)["id"]
    V.vaild_customer_book(customer_id, v_id)
    change_owner = '''UPDATE CUSTOMER_VOUCHER
               SET CUSTOMER = ?
               WHERE VOUCHER = ?                
               AND CUSTOMER = ?
           '''
    val = (customer_id, v_id, user_id )
    c.execute(change_owner, val)

    is_read = False

    msg_info = '''INSERT INTO MESSAGE (SENDEE, SENDER, MESSAGE, READ)
                 VALUES(?, ?, ?, ?)'''
    message = "Voucher is shared to you" 
    val = (customer_id, user_id, message, is_read)
    c.execute(msg_info, val)

    c.close()
    conn.commit()
    conn.close()

    return {}


def message_voucher_friendlist(token):
    """given a token, customer_id and message, send new message"""
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
    user_id = V.get_info(token)["id"]
    friend_list = friend.friends_all(user_id)
    friend_list = friend_list['follower'] + friend_list['following']

    friend_list = [dict(t) for t in set([tuple(d.items()) for d in friend_list])]
    return {'friend_list': friend_list}


def message_delete(message_id):
    """given a token and a description, change the description of the restaurant"""

    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()
    V.validate_message_exist(message_id)
    # update comment details
    delete_info = '''DElETE FROM MESSAGE 
                WHERE ID = ?'''

    c.execute(delete_info, (message_id,))

    c.close()
    conn.commit()
    conn.close()

    return {}
