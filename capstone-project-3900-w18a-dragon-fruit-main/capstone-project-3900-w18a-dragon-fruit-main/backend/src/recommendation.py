import sqlite3
import validation as V
# from flask import abort
from subscription import check_subscription


def recommendation_preference(customer_id):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }
    c = conn.cursor()

    token_query = f'''
    SELECT TOKEN FROM CUSTOMER
    WHERE ID = {customer_id};
    '''
    customer_token = c.execute(token_query).fetchone()[0]
    booked_query = f'''
    SELECT DISTINCT rv.RESTAURANT FROM RESTAURANT_VOUCHER rv
    JOIN CUSTOMER_VOUCHER cv ON cv.VOUCHER = rv.VOUCHER
    WHERE cv.CUSTOMER = {customer_id};
    '''
    c.execute(booked_query)
    booked_result = c.fetchall()
    booked_list = []
    for tp in booked_result:
        booked_list.append(tp[0])

    offer_voucher_query = f'''
        SELECT DISTINCT r.ID
        FROM RESTAURANT_VOUCHER rv
        LEFT JOIN RESTAURANT r ON r.ID = rv.RESTAURANT
        '''
    c.execute(offer_voucher_query)
    offer_result = c.fetchall()
    offer_list = []
    for tp in offer_result:
        offer_list.append(tp[0])

    query = '('
    for r_id in booked_list:
        query += str(r_id)
        query += ','
    query = query.strip(',')
    query += ')'

    offer_restaurants = '('
    for r_id in offer_list:
        offer_restaurants += str(r_id)
        offer_restaurants += ','
    offer_restaurants = offer_restaurants.strip(',')
    offer_restaurants += ')'
    restaurant_query = f'''
    SELECT r.ID, r.NAME, r.DESCRIPTION FROM RESTAURANT r
    WHERE r.ID NOT IN {query} AND r.ID IN {offer_restaurants}
    '''
    c.execute(restaurant_query)
    restaurant_result = c.fetchall()
    restaurant_list = []
    for tp in restaurant_result:
        rest_id = tp[0]
        rating_string = f'''SELECT RATE FROM COMMENT
                        WHERE RESTAURANT = {rest_id}
                        '''
        c.execute(rating_string)
        ratings = c.fetchall()
        rating_sum = 0
        rating_num = 0
        if ratings != []:
            for rating in ratings:
                rating_sum += rating[0]
                rating_num += 1
            average_rating = round((rating_sum / rating_num), 2)
        else:
            average_rating = 0
        restaurant_dict = {
            "restaurant_id": tp[0],
            "restaurant_name": tp[1],
            "rating": average_rating,
            "description": tp[2],
            "liked": check_subscription(customer_token, rest_id),
            "picture": V.find_picture(rest_id)
        }
        restaurant_list.append(restaurant_dict)

    # compute the customer's top 6 cuisine
    # get three from customer's booked voucher
    # get the other three from customer's rating
    voucher_query = f'''
    SELECT RESTAURANT, COUNT FROM
        (SELECT rv.RESTAURANT, COUNT(rv.RESTAURANT) as COUNT FROM 
            (SELECT * FROM CUSTOMER_VOUCHER cv
            WHERE cv.CUSTOMER = {customer_id}) AS cv
        JOIN RESTAURANT_VOUCHER rv ON cv.VOUCHER = rv.VOUCHER
        GROUP BY rv.RESTAURANT)
    ORDER BY COUNT DESC, RESTAURANT
    LIMIT 3;
    '''
    c.execute(voucher_query)
    result = c.fetchall()
    top_three_booked_list = []
    target_restaurant = '('
    for tp in result:
        top_three_booked_list.append(tp[0])
        target_restaurant += str(tp[0])
        target_restaurant += ','
    target_restaurant = target_restaurant.strip(',')
    target_restaurant += ')'
    cuisine_query = f'''
    SELECT DISTINCT c.NAME
    FROM CUISINE c
    JOIN RESTAURANT_CUISINE rc ON rc.CUISINE = c.ID 
    WHERE rc.RESTAURANT IN {target_restaurant};
    '''
    cuisine_result = c.execute(cuisine_query).fetchall()
    cuisine_list = []
    for tp in cuisine_result:
        cuisine_list.append(tp[0])

    rating_query = f'''
        SELECT RESTAURANT, RATE FROM 
            (SELECT * FROM COMMENT c
            WHERE c.CUSTOMER = {customer_id})
        ORDER BY RATE DESC, RESTAURANT
        LIMIT 3;
        '''
    rating_result = c.execute(rating_query).fetchall()
    top_three_rating_list = []
    rating_target_restaurant = '('
    for tp in rating_result:
        top_three_rating_list.append(tp[0])
        rating_target_restaurant += str(tp[0])
        rating_target_restaurant += ','
    rating_target_restaurant = rating_target_restaurant.strip(',')
    rating_target_restaurant += ')'

    rating_cuisine_query = f'''
        SELECT DISTINCT c.NAME
        FROM CUISINE c
        JOIN RESTAURANT_CUISINE rc ON rc.CUISINE = c.ID
        WHERE rc.RESTAURANT IN {rating_target_restaurant};
        '''
    rating_cuisine_result = c.execute(rating_cuisine_query).fetchall()
    rating_cuisine_list = []
    for tp in rating_cuisine_result:
        cuisine_list.append(tp[0])

    cuisine_set = set(cuisine_list)
    return_list = []
    for restaurant in restaurant_list:
        rid = restaurant['restaurant_id']
        search_rest_cuisine = f'''
        SELECT c.NAME, r.NAME, r.DESCRIPTION
        FROM RESTAURANT_CUISINE rc
        JOIN RESTAURANT r ON rc.RESTAURANT = r.ID 
        JOIN CUISINE c ON c.ID = rc.CUISINE
        WHERE rc.RESTAURANT = {rid}
        '''
        rest_cuisine_result = c.execute(search_rest_cuisine).fetchall()
        matching_cuisine_num = 0
        matching_cuisine = []
        for cuisine in rest_cuisine_result:
            if cuisine[0] in cuisine_set:
                matching_cuisine_num += 1
                matching_cuisine.append(cuisine[0])
        restaurant['matching_cuisine'] = matching_cuisine
        restaurant['matching_num'] = matching_cuisine_num
        return_list.append(restaurant)
    sorted_matching_list = sorted(return_list, key=lambda d: d['matching_num'], reverse=True)#print(sorted(return_list, key=lambda d: d['matching_num'], reverse=True))
    best_match_list = []
    selected = 0 # used to select top 3 matching
    top_five = 5
    for rest_dict in sorted_matching_list:
        if rest_dict['matching_num'] > 0:
            best_match_list.append(rest_dict)
            selected += 1
        if selected == top_five:
            break

    c.close()
    conn.close()
    return best_match_list


def recommendation_ratings(customer_id):
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    token_query = f'''
        SELECT TOKEN FROM CUSTOMER
        WHERE ID = {customer_id};
        '''
    customer_token = c.execute(token_query).fetchone()[0]

    booked_query = f'''
    SELECT DISTINCT rv.RESTAURANT FROM RESTAURANT_VOUCHER rv
    JOIN CUSTOMER_VOUCHER cv ON cv.VOUCHER = rv.VOUCHER
    WHERE cv.CUSTOMER = {customer_id};
    '''
    c.execute(booked_query)
    booked_result = c.fetchall()
    booked_list = []
    for tp in booked_result:
        booked_list.append(tp[0])
    offer_voucher_query = f'''
            SELECT DISTINCT r.ID
            FROM RESTAURANT_VOUCHER rv
            LEFT JOIN RESTAURANT r ON r.ID = rv.RESTAURANT
            '''
    c.execute(offer_voucher_query)
    offer_result = c.fetchall()
    offer_list = []
    for tp in offer_result:
        offer_list.append(tp[0])

    offer_restaurants = '('
    for r_id in offer_list:
        offer_restaurants += str(r_id)
        offer_restaurants += ','
    offer_restaurants = offer_restaurants.strip(',')
    offer_restaurants += ')'

    query = '('
    for r_id in booked_list:
        query += str(r_id)
        query += ','
    query = query.strip(',')
    query += ')'
    restaurant_query = f'''
    SELECT r.ID, r.NAME, r.DESCRIPTION FROM RESTAURANT r
    WHERE r.ID NOT IN {query} AND r.ID IN {offer_restaurants}
    '''
    c.execute(restaurant_query)
    restaurant_result = c.fetchall()
    restaurant_list = []
    for tp in restaurant_result:
        rest_id = tp[0]
        rating_string = f'''SELECT RATE FROM COMMENT
                        WHERE RESTAURANT = {rest_id}
                        '''
        c.execute(rating_string)
        ratings = c.fetchall()
        rating_sum = 0
        rating_num = 0
        if ratings != []:
            for rating in ratings:
                rating_sum += rating[0]
                rating_num += 1
            average_rating = round((rating_sum / rating_num), 2)
        else:
            average_rating = 0
        restaurant_dict = {
            "restaurant_id": tp[0],
            "restaurant_name": tp[1],
            "rating": average_rating,
            "description": tp[2],
            "liked": check_subscription(customer_token, rest_id),
            "picture": V.find_picture(rest_id)
        }
        restaurant_list.append(restaurant_dict)
    top_rate_list = []
    restaurant_list = sorted(restaurant_list, key=lambda k: k['rating'], reverse=True)
    top_three = 3
    selected = 0
    for restaurant in restaurant_list:
        top_rate_list.append(restaurant)
        selected += 1
        if selected == top_three:
            break
    c.close()
    conn.close()
    return top_rate_list
