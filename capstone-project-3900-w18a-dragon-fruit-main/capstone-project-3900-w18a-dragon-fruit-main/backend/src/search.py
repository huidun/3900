import sqlite3
import validation as V
# from flask import abort
from subscription import check_subscription


def search_restaurant(token, keyword):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()
    
    if keyword is None:
        final_query = '''SELECT r.NAME, r.description FROM RESTAURANT r
        '''
    else:
        final_query = f'''
            SELECT r.NAME, r.description, r.id FROM RESTAURANT r
            WHERE lower(r.NAME) LIKE lower("%{keyword}%")
        UNION
            SELECT r.NAME, r.description, r.id FROM RESTAURANT r
            WHERE r.POSTCODE = "{keyword}"
        UNION
            SELECT rp.NAME, rp.description, rp.id FROM RESTAURANT rp
            LEFT JOIN RESTAURANT_CUISINE rc ON rp.id = rc.id
            LEFT JOIN CUISINE c ON rc.CUISINE = c.id
            WHERE lower(c.name) = lower("{keyword}")
        UNION
            SELECT r.NAME, r.description, r.id
            FROM DISH d
            LEFT JOIN RESTAURANT r ON d.RESTAURANT = r.id
            WHERE lower(d.DISH_NAME) LIKE lower("%{keyword}%");
        '''
    c.execute(final_query)
    result = c.fetchall()
    result_list = []
    rating_sum = 0
    rating_num = 0
    for tp in result:
        rest_id = tp[2]
        rating_string = f'''SELECT RATE FROM COMMENT
                WHERE RESTAURANT = {rest_id}
                '''
        c.execute(rating_string)
        ratings = c.fetchall()
        if ratings:
            for rating in ratings:
                rating_sum += rating[0]
                rating_num += 1
            average_rating = round((rating_sum / rating_num), 2)
        else:
            average_rating = 0
        subscribe = check_subscription(token, rest_id)
        restaurant_dict = {
            "restaurant_id": tp[2],
            "restaurant_name": tp[0],
            "description": tp[1],
            "rating": average_rating,
            "liked": subscribe,
            "picture": V.find_picture(rest_id)
        }
        result_list.append(restaurant_dict)

    c.close()
    conn.close()
    return result_list
