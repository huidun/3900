import validation as V
import sqlite3
from flask import abort, request


def picture_add(token, filename):
    """given an url of a picture, save the picture
    into a jpg file and add the path in database"""
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    # get r_id from token
    info = V.get_info(token)
    r_id = info['id']

    # store filename into database
    insert_query = '''INSERT INTO PICTURE (RESTAURANT, FILE_NAME)
            VALUES(?, ?)'''

    val = (r_id, filename)
    c.execute(insert_query, val)

    # get image id
    select_query = '''SELECT ID FROM PICTURE
                WHERE FILE_NAME = ?
                '''
    c.execute(select_query, (filename,))
    data = c.fetchone()
    p_id = data[0]

    conn.commit()
    c.close()
    conn.close()

    return {
        "picture_id": p_id
    }


def pictures_all(restaurant_id):
    """given restaurant_id, return the pictures of the corresponding
    restaurant id """
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
    query = '''SELECT ID, FILE_NAME
        FROM PICTURE
        WHERE RESTAURANT = ?
        '''
    c.execute(query, (restaurant_id,))
    data = c.fetchall()
    if data is None:
        abort(401, description="Cannot find restaurant\'s pictures.")
    result_list = []
    for item in data:
        picture = {
            "picture_id": item[0],
            "picture": request.host_url + 'pictures/' + item[1]
        }
        result_list.append(picture)
    c.close()
    conn.commit()
    conn.close()

    return {
        "all_pictures": result_list
    }
