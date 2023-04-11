import sqlite3
import validation as V
from flask import abort


def comment_customer_add_new(token, v_id, rate, review):
    """given a comment_id, add the comment details"""
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }
    state = "commented"
    c = conn.cursor()
    # check token is valid
    V.validate_customer_token(c, token)
    customer_id = V.get_info(token)["id"]
    # check customer has voucher
    r_id = V.get_restaurant_id_voucher(v_id, c)
    print(r_id)
    V.check_customer_has_voucher_of_restaurant(customer_id, r_id, c)
    comment_info = '''INSERT INTO COMMENT (RESTAURANT, CUSTOMER, RATE, REVIEW, VOUCHER)
                 VALUES(?, ?, ?, ?, ?)'''

    val = (r_id, customer_id, rate, review, v_id)
    c.execute(comment_info, val)

    get_id = '''SELECT last_insert_rowid() from COMMENT
                    '''
    c.execute(get_id)
    data = c.fetchone()

    comment_id = data[0]
    # change state of this voucher
    query = '''UPDATE CUSTOMER_VOUCHER
           SET STATE = ?
           WHERE VOUCHER = ?  
           AND CUSTOMER =  ?
       '''
    val = (state, v_id, customer_id)
    c.execute(query, val)
    c.close()
    conn.commit()
    conn.close()

    return {
        "comment_id": comment_id
    }


def comment_customer_edit(comment_id, new_rate, new_review):
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
    V.validate_comment_exist(c, comment_id)
    # update comment details
    query = '''UPDATE COMMENT
        SET RATE = ?,
            REVIEW = ?
        WHERE ID = ?
        '''
    val = (new_rate, new_review, comment_id)
    c.execute(query, val)

    c.close()
    conn.commit()
    conn.close()

    return {}


def comment_customer_all(customer_id, condition):
    """given a customer_id, return the comment details of the customer by given condition"""
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    # check condition, see if order by rating or time
    if "rating" in str(condition):
        print("rating!!" + condition)
        if "-" in str(condition):
            order = "ASC"
        else:
            order = "DESC"
        query_string = f'''SELECT * FROM COMMENT
            WHERE CUSTOMER = {customer_id}
            ORDER BY RATE {order}, ID {order};
            '''

    elif "time" in str(condition):
        if "-" in str(condition):
            order = "ASC"
        else:
            order = "DESC"
        query_string = f'''SELECT * FROM COMMENT
            WHERE CUSTOMER = {customer_id}
            ORDER BY CREATION_DATE {order}, ID {order};
            '''
    else:
        abort(400, description="Cannot find order by time or rate")
    c.execute(query_string)
    result = c.fetchall()

    # compute return dictionary
    rating0to1 = 0
    rating1to2 = 0
    rating2to3 = 0
    rating3to4 = 0
    rating4to5 = 0
    total_rating = 0
    number_of_ratings = 0
    comment_list = []
    for tp in result:
        rating = tp[3]
        total_rating += rating
        number_of_ratings += 1
        if rating < 1:
            rating0to1 += 1
        elif rating < 2:
            rating1to2 += 1
        elif rating < 3:
            rating2to3 += 1
        elif rating < 4:
            rating3to4 += 1
        elif rating < 5:
            rating4to5 += 1
        customer_name_result = c.execute(f"SELECT NAME FROM CUSTOMER c WHERE c.ID = {tp[2]}")
        customer_name = customer_name_result.fetchone()[0]
        comment_dict = {
            "comment_id": tp[0],
            "name": customer_name,
            "rate": rating,
            "review": tp[4],
            "date": tp[5]
        }
        comment_list.append(comment_dict)
    if number_of_ratings == 0:
        return_dict = \
            {
                "rate": [{"name": "0-1", "num": rating0to1, "fill": "#899668"},
                         {"name": "1-2", "num": rating1to2, "fill": "#8a7a57"},
                         {"name": "2-3", "num": rating2to3, "fill": "#8c5e47"},
                         {"name": "3-4", "num": rating3to4, "fill": "#8d4136"},
                         {"name": "4-5", "num": rating4to5, "fill": "#8e2525"}],
                "total": 0,
                "comments": comment_list
            }
    else:
        return_dict = \
            {
                "rate": [{"name": "0-1", "num": rating0to1, "fill": "#899668"},
                         {"name": "1-2", "num": rating1to2, "fill": "#8a7a57"},
                         {"name": "2-3", "num": rating2to3, "fill": "#8c5e47"},
                         {"name": "3-4", "num": rating3to4, "fill": "#8d4136"},
                         {"name": "4-5", "num": rating4to5, "fill": "#8e2525"}],
                "total": round(total_rating / number_of_ratings, 1),
                "comments": comment_list
            }
    c.close()
    conn.close()

    return return_dict


def comment_details_order_by(r_id, condition):
    """given a r_id, return the comment details of the corresponding restaurant order by given condition"""
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    # check condition, see if order by rating or time
    if "rating" in str(condition):
        print("rating!!" + condition)
        if "-" in str(condition):
            order = "ASC"
        else:
            order = "DESC"
        query_string = f'''SELECT * FROM COMMENT
        WHERE RESTAURANT = {r_id}
        ORDER BY RATE {order}, ID {order};
        '''

    elif "time" in str(condition):
        if "-" in str(condition):
            order = "ASC"
        else:
            order = "DESC"
        query_string = f'''SELECT * FROM COMMENT
        WHERE RESTAURANT = {r_id}
        ORDER BY CREATION_DATE {order}, ID {order};
        '''
    else:
        abort(400, description="Cannot find order by time or rate")
    c.execute(query_string)
    result = c.fetchall()

    # compute return dictionary
    rating0to1 = 0
    rating1to2 = 0
    rating2to3 = 0
    rating3to4 = 0
    rating4to5 = 0
    total_rating = 0
    number_of_ratings = 0
    comment_list = []
    for tp in result:
        rating = tp[3]
        total_rating += rating
        number_of_ratings += 1
        if rating < 1:
            rating0to1 += 1
        elif rating < 2:
            rating1to2 += 1
        elif rating < 3:
            rating2to3 += 1
        elif rating < 4:
            rating3to4 += 1
        elif rating < 5:
            rating4to5 += 1
        customer_name_result = c.execute(f"SELECT NAME FROM CUSTOMER c WHERE c.ID = {tp[2]}")
        customer_name = customer_name_result.fetchone()[0]
        comment_dict = {
            "comment_id": tp[0],
            "name": customer_name,
            "rate": rating,
            "review": tp[4],
            "date": tp[5]
        }
        comment_list.append(comment_dict)

    if number_of_ratings == 0:
        return_dict = \
            {
                "rate": [{"name": "0-1", "num": rating0to1, "fill": "#899668"},
                         {"name": "1-2", "num": rating1to2, "fill": "#8a7a57"},
                         {"name": "2-3", "num": rating2to3, "fill": "#8c5e47"},
                         {"name": "3-4", "num": rating3to4, "fill": "#8d4136"},
                         {"name": "4-5", "num": rating4to5, "fill": "#8e2525"}],
                "total": 0,
                "comments": comment_list
            }
    else:
        return_dict = \
            {
                "rate": [{"name": "0-1", "num": rating0to1, "fill": "#899668"},
                         {"name": "1-2", "num": rating1to2, "fill": "#8a7a57"},
                         {"name": "2-3", "num": rating2to3, "fill": "#8c5e47"},
                         {"name": "3-4", "num": rating3to4, "fill": "#8d4136"},
                         {"name": "4-5", "num": rating4to5, "fill": "#8e2525"}],
                "total": round(total_rating / number_of_ratings, 1),
                "comments": comment_list
            }
    c.close()
    conn.close()

    return return_dict


def comment_details(comment_id):
    """given a comment_id, return the comment details"""
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()
    query_string = f'''
    SELECT * FROM COMMENT
    WHERE ID = {comment_id};
    '''
    c.execute(query_string)
    result = c.fetchone()
    customer_name_result = c.execute(f"SELECT NAME FROM CUSTOMER c WHERE c.ID = {result[2]}")
    customer_name = customer_name_result.fetchone()[0]
    return_dict = {
        "name": customer_name,
        "rate": result[3],
        "review": result[4],
        "date": result[5]
    }
    c.close()
    conn.close()
    return return_dict
