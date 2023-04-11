import hashlib
import sqlite3
import validation as V
from flask import abort


def restaurant_profile_details(id):
    """given an id, return the details of the corresponding restaurant"""
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    # find restaurant details with id
    query = '''SELECT NAME, EMAIL, POSTCODE,
        ADDRESS, PHONE_NUMBER, DESCRIPTION
        FROM RESTAURANT
        WHERE ID = ?
        '''
    c.execute(query, (id,))
    data = c.fetchone()

    if data is None:
        abort(400, description="Cannot find restaurant with provided id.")
        # raise InputError("Cannot find restaurant with provided id.")

    (name, email, postcode, address, phone_number, description) = data
    cuisine = []

    # find cuisines for the restaurant
    query = '''SELECT CUISINE
        FROM RESTAURANT_CUISINE
        WHERE RESTAURANT = ?
        '''
    c.execute(query, (id,))
    data = c.fetchall()

    if data is not None:
        for d in data:
            # find cuisine name and add to list
            query = '''SELECT NAME
                FROM CUISINE
                WHERE ID = ?'''
            
            c.execute(query, (d[0],))
            data = c.fetchone()
            name_c = data[0]
            cuisine.append(name_c)

    c.close()
    conn.commit()
    conn.close()

    return {
        "name": name,
        "email": email,
        "address": address,
        "postcode": postcode,
        "phone_number": phone_number,
        "description": description,
        "cuisine": cuisine,
        "picture": V.find_picture(id)
    }


def restaurant_simple_details(id):
    """given a id, return the name and email of the corresponding restaurant"""
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
        FROM RESTAURANT
        WHERE ID = ?
        '''
    c.execute(query, (id,))
    data = c.fetchone()
    
    if data is None:
        abort(400, description="Cannot find restaurant with provided id.")
    
    name = data[0]
    email = data[1]

    c.close()
    conn.commit()
    conn.close()

    return {
        'name': name,
        'email': email
    }


def restaurant_profile_edit_name(token, name):
    """given a token and a new name, change the name of the restaurant in database"""
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
    V.validate_restaurant_token(c, token)
    
    # update user name with token
    query = '''UPDATE RESTAURANT
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


def restaurant_profile_contacts(id):
    """given an id, return the name, email, postcode and 
    phone_number of the corresponding restaurant"""
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    # find restaurant details with id
    query = '''SELECT ADDRESS, POSTCODE, PHONE_NUMBER
        FROM RESTAURANT
        WHERE ID = ?
        '''
    c.execute(query, (id,))
    data = c.fetchone()

    if data is None:
        abort(400, description="Cannot find restaurant with provided id.")

    (address, postcode, phone_number) = data

    c.close()
    conn.commit()
    conn.close()

    return {
        "address": address,
        "postcode": postcode,
        "phone_number": phone_number
    }


def restaurant_profile_overview(id):
    """given an id, return the description of the corresponding restaurant"""
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    # find restaurant details with id
    query = '''SELECT DESCRIPTION
        FROM RESTAURANT
        WHERE ID = ?
        '''
    c.execute(query, (id,))
    data = c.fetchone()

    if data is None:
        abort(400, description="Cannot find restaurant with provided id.")

    description = data[0]

    c.close()
    conn.commit()
    conn.close()

    return {
        "description": description
    }


def restaurant_profile_edit_password(token, opassword, npassword):
    """given a token and a new name, change the name of the restaurant"""
    # encode the password
    ohashpass = hashlib.sha256(opassword.encode()).hexdigest()
    nhashpass = hashlib.sha256(npassword.encode()).hexdigest()

    # check whether the old password exists
    if not V.exists_restaurant_password(token, ohashpass):
        abort(400, description="Old password is not correct.")

    # check password is valid
    V.valid_password(npassword)
    
    if V.exists_restaurant_password(token, nhashpass):
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
    V.validate_restaurant_token(c, token)
    
    # update restaurant password
    query = '''UPDATE RESTAURANT
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


def restaurant_profile_edit_contacts(token, address, postcode, phone_number):
    """given a token and a new address, postcode and phone_number,
     change the contacts of the restaurant"""

    if len(str(postcode)) != 4:
        abort(400, description="Postcode is not valid.")

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
    V.validate_restaurant_token(c, token)

    # update restaurant contacts
    query = '''UPDATE RESTAURANT
        SET ADDRESS = ?,
            POSTCODE = ?,
            PHONE_NUMBER = ?
        WHERE TOKEN = ?
        '''
    val = (address, postcode, phone_number, token)
    c.execute(query, val)

    c.close()
    conn.commit()
    conn.close()

    return {
    }


def restaurant_profile_edit_description(token, description):
    """given a token and a description, change the description of the restaurant"""
    # check description is not too long
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

    V.validate_restaurant_token(c, token)

    # update restaurant description
    query = '''UPDATE RESTAURANT
        SET DESCRIPTION = ?
        WHERE TOKEN = ?
        '''
    val = (description, token)
    c.execute(query, val)

    c.close()
    conn.commit()
    conn.close()

    return {
    }


def restaurant_menu_details(restaurant_id):
    """given restaurant_id, return the menu details of the corresponding
    restaurant id (return None if detail is empty)"""
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    # find restaurant details with id
    query = '''SELECT DISH_NAME, PRICE, DESCRIPTION, ID
        FROM DISH
        WHERE RESTAURANT = ?
        '''
    c.execute(query, (restaurant_id,))
    data = c.fetchall()
    if data is None:
        abort(401, description="Cannot find restaurant\'s menu with provided id.")
    result_list = []
    for item in data:
        restaurant_menu = {
            "dish_name": item[0],
            "price": item[1],
            "description": item[2],
            "dish_id": item[3]
        }
        result_list.append(restaurant_menu)
    c.close()
    conn.commit()
    conn.close()

    return {
        "all_dishes": result_list
    }


def restaurant_menu_add_dish(token, dish_name, price, description):
    """given a name, price, restaurant_id and description, return the menu details of the corresponding
    restaurant id (return None if detail is empty)"""
    # check whether name or price is empty
    if dish_name == "" and description == "":
        abort(400, description="It should not be empty.")
        
    # check whether price is empty
    if price == "":
        abort(401, description="price should not be empty.")    
    # check description is not too long
    if len(description) > 1000:
        abort(400, description="Description is too long.")
        # raise InputError("Description is too long.")
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()
    V.validate_restaurant_token(c, token)
    restaurant_id = V.get_info(token)["id"]
    # find restaurant details with id
    dish_info = '''INSERT INTO DISH (DISH_NAME, PRICE, RESTAURANT, DESCRIPTION)
                VALUES(?, ?, ?, ?)'''

    val = (dish_name, price, restaurant_id, description)
    c.execute(dish_info, val)

    # get the id from database
    get_id = '''SELECT ID FROM DISH WHERE  DISH_NAME = ?
                AND RESTAURANT = ?
                '''
    c.execute(get_id, (dish_name, restaurant_id))

    did = c.fetchone()[0]

    c.close()
    conn.commit()
    conn.close()
    return {
        'id': did
    }


def restaurant_menu_edit_dish(dish_id, name, price, description):
    """given a id, name, price and a description, change the detail of the dish"""
    # check description is not too long
    if len(description) > 1000:
        abort(400, description="Description is too long.")
        # raise InputError("Description is too long.")

    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()
    V.validate_dish_exist(c, dish_id)
    # update restaurant description
    query = '''UPDATE DISH
        SET DESCRIPTION = ?,
            DISH_NAME = ?,
            PRICE = ?
        WHERE ID = ?
        '''
    val = (description, name, price, dish_id)
    c.execute(query, val)

    c.close()
    conn.commit()
    conn.close()

    return {
    }


def restaurant_menu_dish_details(dish_id):
    """given an id, return the details of the corresponding dish"""
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    # find restaurant details with id
    query = '''SELECT DISH_NAME, PRICE, DESCRIPTION
        FROM DISH
        WHERE ID = ?
        '''
    c.execute(query, (dish_id,))
    data = c.fetchone()

    if data is None:
        abort(400, description="Cannot find dish.")

    (dish_name, price, description) = data

    c.close()
    conn.commit()
    conn.close()

    return {
        "dish_name": dish_name,
        "price": price,
        "description": description
    }


def restaurant_menu_delete_dish(token, dish_id):
    """given a token, dish_id, delete the menu's dish of the corresponding
    dish id """
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()
    V.validate_restaurant_token(c, token)
    # find restaurant details with id
    delete_info = '''DElETE FROM DISH 
                WHERE ID = ?'''

    c.execute(delete_info, (dish_id,))

    c.close()
    conn.commit()
    conn.close()
    return {
    }


def restaurant_profile_add_cuisine(token, cuisine_name):
    """given a token and a c_id, and cuisine_name, add it to the table"""
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    V.validate_restaurant_token(c, token)

    # check if the cuisine already exist.
    # if yes, connect the restaurant with the cuisine
    cuisine = V.validate_cuisine_exist(c, cuisine_name)
    if cuisine is None:
        # cuisine not existed, insert that to cuisine table
        insert_to_cuisine = f'''
        INSERT INTO CUISINE (NAME)
        VALUES("{cuisine_name}")        
        '''
        c.execute(insert_to_cuisine)
        conn.commit()
        get_id = '''SELECT LAST_INSERT_ROWID()'''
        c.execute(get_id)
        row = c.fetchone()
        cid = row[0]
    else:
        cid = cuisine[0]

    # insert restaurant cuisine table

    restaurant_id = V.get_info(token)["id"]
    insert_query = f'''INSERT INTO RESTAURANT_CUISINE (RESTAURANT, CUISINE)
            VALUES({restaurant_id}, {cid})
            '''
    c.execute(insert_query)

    conn.commit()
    c.close()

    conn.close()
    return {}


def restaurant_profile_delete_cuisine(token, cuisine_name):
    """given a token and cuisine_name, delete it from the table"""
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    V.validate_restaurant_token(c, token)

    # check if the cuisine exist.
    # if yes, connect the restaurant with the cuisine
    cuisine = V.validate_cuisine_exist(c, cuisine_name)
    if cuisine is None:
        abort(400, description="Cuisine_name not found")
    else:
        cid = cuisine[0]


    # delete from restaurant cuisine table

    restaurant_id = V.get_info(token)["id"]
    delete_query = f'''DELETE FROM RESTAURANT_CUISINE
            WHERE RESTAURANT = {restaurant_id} AND CUISINE = {cid}
            '''
    c.execute(delete_query)

    conn.commit()
    c.close()

    conn.close()
    return {}


def restaurant_cuisine(rid):
    """given a restaurant id, return its added cuisine and unadded cuisine"""
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    # find all cuisine
    all_cuisine_query = f'''
        SELECT c.NAME FROM CUISINE c;
        '''
    c.execute(all_cuisine_query)
    result = c.fetchall()
    cuisine_list = []
    for tp in result:
        cuisine_list.append(tp[0])

    # find added cuisine
    added_query = f'''
    SELECT c.NAME FROM RESTAURANT_CUISINE rc 
    LEFT JOIN CUISINE c ON rc.CUISINE = c.ID
    WHERE rc.RESTAURANT = {rid};
    '''
    c.execute(added_query)
    result = c.fetchall()

    conn.commit()
    added_list = []
    for tp in result:
        added_list.append(tp[0])

    conn.close()

    unadded_list = list(set(cuisine_list) - set(added_list))
    added_list = list(set(added_list))

    return_dict = {
        "added_cuisine_list": added_list,
        "unadded_cuisine_list": unadded_list
    }

    return return_dict

