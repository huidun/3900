# Interface


## Host and Port Number
```
host='127.0.0.1',port=8000
```

## Get user info (GET)

### Backend url

```
/getinfo
```

### Frontend to Backend

```
token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InJlczNAZ21haWwuY29tIn0.Bi4O8PokaFIDHtYSyPIFpzESvyjQxJhKWPJCvQqEWyQ
```

### Backend return

```json
{
    'id': 2,
    'name': 'example'
}
```

## Register (POST)

### Backend url

```
/auth/register
```

### Frontend to Backend

```json
{
    'name': 'Example',
    'email': 'example@example.com',
    'password': 'examplepassword',
    'type': true, // true for customer, false for restaurant
}
```

### Backend return

```json
{
    'id': 1,
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhhcHB5ZWF0ZXJAZ21haWwuY29tIn0.8aWvreynEXczaViTFKmJa6pWM6E6Ifx6vX2OaCA_qKo' // example token
}
```

## Log in

### Backend url

```
/auth/login
```

### Frontend to Backend

```json
{
    'type': true, // true for customer, false for restaurant
    'email': 'example@example.com',
    'password': 'examplepassword',
}
```

### Backend return

```json
{
    'id': 1,
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhhcHB5ZWF0ZXJAZ21haWwuY29tIn0.8aWvreynEXczaViTFKmJa6pWM6E6Ifx6vX2OaCA_qKo' // example token
}
```
## Log out

### Backend url

```
/auth/logout
```

### Frontend to Backend

```json
{
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhhcHB5ZWF0ZXJAZ21haWwuY29tIn0.8aWvreynEXczaViTFKmJa6pWM6E6Ifx6vX2OaCA_qKo' // example token
}
```

### Backend return

```json
    {
        'is_success': True
    }
```
## Password reset request (POST)

### Backend url

```
/auth/passwordreset/request
```

### Frontend to Backend

```json
{
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhhcHB5ZWF0ZXJAZ21haWwuY29tIn0.8aWvreynEXczaViTFKmJa6pWM6E6Ifx6vX2OaCA_qKo',
    'email': 'example@example.com'

}
```

### Backend return

```json
    {}
```

## Password reset (POST)

### Backend url

```
/auth/passwordreset/reset
```

### Frontend to Backend

```json
{
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhhcHB5ZWF0ZXJAZ21haWwuY29tIn0.8aWvreynEXczaViTFKmJa6pWM6E6Ifx6vX2OaCA_qKo',
    'reset_code': 'hdjsew',
    'new_password': 'newpassword'

}
```

### Backend return

```json
    {}
```

## Get customer details (GET)

### Backend url

```
/customer/profile/details
```

### Frontend to Backend

```
id=2
```

### Backend return

```json
{
    'name': 'example,
    'email': 'example@gmail.com'
}
```

## Change customer name (PUT)

### Backend url

```
/customer/profile/edit/name
```

### Frontend to Backend

```json
{
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhhcHB5M0BnbWFpbC5jb20ifQ.B7HafidswST2sOOesZ_bqvuVYQAVI4lHli-ENYTAVWk',
    'name': 'New Name'
}
```

### Backend return

```json
{
}
```


## Change customer password (PUT)

### Backend url

```
/customer/profile/edit/password
```

### Frontend to Backend

```json
{
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhhcHB5M0BnbWFpbC5jb20ifQ.B7HafidswST2sOOesZ_bqvuVYQAVI4lHli-ENYTAVWk',
    'old_password': 'old password',
    'new_password': 'new password'
}
```

### Backend return

```json
{
}
```


## Get restaurant details (GET)

### Backend url

```
/restaurant/profile/details
```

### Frontend to Backend

```
id=1
```

### Backend return

```json
{
    'name': 'example',
    'email': 'email@gmail.com',
    'address': '123 Road, Address District, NSW',
    'postcode': 2000,
    'phone_number': '(02)12341234',
    'description': 'Example description',
    'cuisine': None
}
```

## Change restaurant name (PUT)

### Backend url

```
/restaurant/profile/edit/name
```

### Frontend to Backend

```json
{
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhhcHB5M0BnbWFpbC5jb20ifQ.B7HafidswST2sOOesZ_bqvuVYQAVI4lHli-ENYTAVWk',
    'name': 'New Name'
}
```

### Backend return

```json
{
}
```
## Change restaurant password (PUT)

### Backend url

```
/restaurant/profile/edit/password
```

### Frontend to Backend

```json
{
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhhcHB5M0BnbWFpbC5jb20ifQ.B7HafidswST2sOOesZ_bqvuVYQAVI4lHli-ENYTAVWk',
    'old_password': 'old password'
    'new_password': 'new password'
}
```

### Backend return

```json
{
}
```


## Change restaurant address (PUT)

### Backend url

```
/restaurant/profile/edit/address
```

### Frontend to Backend

```json
{
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhhcHB5M0BnbWFpbC5jb20ifQ.B7HafidswST2sOOesZ_bqvuVYQAVI4lHli-ENYTAVWk',
    'address': 'new address'
}
```

### Backend return

```json
{
}
```

## Change restaurant postcode (PUT)

### Backend url

```
/restaurant/profile/edit/postcode
```

### Frontend to Backend

```json
{
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhhcHB5M0BnbWFpbC5jb20ifQ.B7HafidswST2sOOesZ_bqvuVYQAVI4lHli-ENYTAVWk',
    'postcode': 5678
}
```

### Backend return

```json
{
}
```

## Change restaurant contact number (PUT)

### Backend url

```
/restaurant/profile/edit/number
```

### Frontend to Backend

```json
{
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhhcHB5M0BnbWFpbC5jb20ifQ.B7HafidswST2sOOesZ_bqvuVYQAVI4lHli-ENYTAVWk',
    'phone_number': '12345678'
}
```

### Backend return

```json
{
}
```

## Change restaurant description (PUT)

### Backend url

```
/restaurant/profile/edit/description
```

### Frontend to Backend

```json
{
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhhcHB5M0BnbWFpbC5jb20ifQ.B7HafidswST2sOOesZ_bqvuVYQAVI4lHli-ENYTAVWk',
    'description': 'new description'
}
```

### Backend return

```json
{
}
```

## Get restaurant's menu details (GET)

### Backend url

```
/restaurant/menu/details
```

### Frontend to Backend

```
id=1
```

### Backend return

```json
{
    [{dish1}, {dish2}]
}
```

## Get dish details (GET)

### Backend url

```
/restaurant/menu/dish/details
```

### Frontend to Backend

```
id=1
```

### Backend return

```json
{
      "dish_name": dish_name,
      "price": price,
      "description": description
}
```
---

## edit dish details (PUT)

### Backend url

```
/restaurant/menu/dish/edit
```

### Frontend to Backend

```json
{
    "dish_id": 1,
    "name": "name",
    "price": 4,
    "description": "xxx"
}
```

### Backend return

```json
{
}
```

## Add restaurant voucher (POST)

### Backend url

```
/restaurant/voucher/add
```

### Frontend to Backend

```json
{
    "token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhhcHB5M0BnbWFpbC5jb20ifQ.B7HafidswST2sOOesZ_bqvuVYQAVI4lHli-ENYTAVWk', 
    "voucher": 
    {
        "voucher_name": "name",
        "start_time": "2020-06-16 20:00",
        "end_time": "2020-06-16 23:00", 
        "discount": 34, 
        "description": "xxxx"
    },
    "total_number": 15,
    "start_release_time": "2020-06-16 20:00", 
    "end_release_time": "2020-06-16 21:00",
    "repetitions": 2
 }

```

### Backend return

```json
{
    "ids": [1, 2]
}
```

## Edit restaurant voucher (PUT)

### Backend url

```
/restaurant/voucher/edit
```

### Frontend to Backend

```json
{
    "token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhhcHB5M0BnbWFpbC5jb20ifQ.B7HafidswST2sOOesZ_bqvuVYQAVI4lHli-ENYTAVWk', 
    "voucher": 
    {
        "voucher_id": 1,
        "voucher_name": "name",
        "start_time": "2020-06-16 20:00",
        "end_time": "2020-06-16 23:00", 
        "discount": 34, 
        "description": "xxxx"
    },
    "total_number": 15,
    "start_release_time": "2020-06-16 20:00", 
    "end_release_time": "2020-06-16 21:00"
 }

```

### Backend return

```json
{
}
```

## Get restaurant single voucher details (GET)

### Backend url

```
/restaurant/voucher/details
```

### Frontend to Backend

```
id=1
```

### Backend return

```json
    {
          "voucher_name": "name",
          "start_time": "2020-06-16 20:00",
          "end_time": "2020-06-16 23:00",
          "discount": 34,
          "description": "xxxx",
          "total_number": 15,
          "available_number": 13,
          "start_release_time": "2020-06-16 20:00", 
          "end_release_time": "2020-06-16 21:00"
    }
```


## Get restaurant all voucher details (GET)

### Backend url

```
/restaurant/vouchers/all
```

### Frontend to Backend

```
id=1
```

### Backend return

```json
{
    "vouchers": 
            [
                {
                  "voucher_id": 1,
                  "voucher_name": "name",
                  "start_time": "2020-06-16 20:00",
                  "end_time": "2020-06-16 23:00",
                  "discount": 34,
                  "description": "xxxx"
                },
                {
                  "voucher_id": 2,
                  "voucher_name": "name",
                  "start_time": "2020-06-16 20:00",
                  "end_time": "2020-06-16 23:00",
                  "discount": 34,
                  "description": "xxxx"
                }
            ]
}
```


## Customer book voucher (POST)

### Backend url

```
/customer/voucher/book
```
### Frontend to Backend

```json
{
    "token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhhcHB5M0BnbWFpbC5jb20ifQ.B7HafidswST2sOOesZ_bqvuVYQAVI4lHli-ENYTAVWk', 
    "voucher_id": 1
}
```

### Backend return

```json
{}
```

## Get customer single voucher details (GET)

### Backend url

```
/customer/voucher/details
```

### Frontend to Backend

```
token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImVtYWlsMkBnbWFpbC5jb20ifQ.ie_qN9gVa2NyEVCor856sw-KptApW6lcy6lu4UInIIA&id=1
```

### Backend return

```json
    {
          "voucher_name": "name",
          "start_time": "2020-06-16 20:00",
          "end_time": "2020-06-16 23:00",
          "discount": 34,
          "description": "xxxx",
          "state": "unused",
          "date": "2022-07-04",
          "code": "13",
    }
```

## Get customer all voucher details (GET)

### Backend url

```
/customer/vouchers/all
```

### Frontend to Backend

```
id=1
```

### Backend return

```json
{
    "unused": 
            [
                {
                  "voucher_name": "name",
                  "start_time": "2020-06-16 20:00",
                  "end_time": "2020-06-16 23:00",
                  "discount": 34,
                  "description": "xxxx",
                  "voucher_id": 1
                },
                {
                  "voucher_name": "name",
                  "start_time": "2020-06-16 20:00",
                  "end_time": "2020-06-16 23:00",
                  "discount": 34,
                  "description": "xxxx",
                  "voucher_id": 2
                }
            ],
      "used_uncommented": 
            [
                {
                  "voucher_name": "name",
                  "start_time": "2020-06-16 20:00",
                  "end_time": "2020-06-16 23:00",
                  "discount": 34,
                  "description": "xxxx",
                  "voucher_id": 7
                }
            ],
      "commented": 
            [
                {
                  "voucher_name": "name",
                  "start_time": "2020-06-16 20:00",
                  "end_time": "2020-06-16 23:00",
                  "discount": 34,
                  "description": "xxxx",
                  "voucher_id": 5
                },
                {
                  "voucher_name": "name",
                  "start_time": "2020-06-16 20:00",
                  "end_time": "2020-06-16 23:00",
                  "discount": 34,
                  "description": "xxxx",
                  "voucher_id": 6
                }
            ],
      "expired": 
            [
                {
                  "voucher_name": "name",
                  "start_time": "2020-06-16 20:00",
                  "end_time": "2020-06-16 23:00",
                  "discount": 34,
                  "description": "xxxx",
                  "voucher_id": 3
                }
            ]
    
}
```
## RESTAURANT VERIFY VOUCHER CODE (POST)

### Backend url

```
/restaurant/voucher/verify
```
### Frontend to Backend

```json
{
    "code": 'shdjsd',
    "email": 'email@gmail.com'
}
```

### Backend return

```json
{
    "discount": 34,
    "description": "xxxx"
}
```

## Add customer's comment (POST)

### Backend url

```
/comment/customer/add
```

### Frontend to Backend

```json
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImphY2tAZ21haWwuY29tIn0.sma4ucoL3h4xjdeXrl-OaypjC4T8224F1XMO0Zv-Z7U",
    "r_id": 1,
    "rate": 4,
    "review": "xxx"
}
```

### Backend return

```json
{
   "comment_id": 1
}
```

## Edit customer's comment (PUT)

### Backend url

```
/comment/customer/edit
```

### Frontend to Backend

```json
{
    "comment_id": 1,
    "rate": 3,
    "review": "xxx"
}
```

### Backend return

```json
{
}
```

## Get customer's comments details (GET)

### Backend url

```
/comment/customer/all
```

### Frontend to Backend

```
customer_id=1
```

### Backend return

```json
{
    [{comment1}, {comment2},{}]
}
```

## Follow and unfollow customer (PUT)

### Backend url

```
/customer/friend/follow_unfollow
```

### Frontend to Backend

```json
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImphY2tAZ21haWwuY29tIn0.sma4ucoL3h4xjdeXrl-OaypjC4T8224F1XMO0Zv-Z7U",
    "customer_id": 1,
    "type": "follow"
}
```

### Backend return

```json
{
}
```




## friends_all (GET)

### Backend url
/customer/friends/all

### Frontend to Backend

```json
{
    "customer_id": 1
}
```

### Backend return

```json
{
    "follower": [{"name": "customer2", "id": 2}, ...], 

    "following": [{"name": "customer1", "id": 1}, ...] 
} 
```


## friend_profile (GET)

### Backend url
/customer/friend/profile

### Frontend to Backend

```json
{
    "customer_id": 1
}
```

### Backend return

```json
{
    "name": "customer1",
    "email": "customer1@gmail.com"
}
```


## comment_details_order_by (GET)

### Backend url
/comment/details/orderby

### Frontend to Backend

```json
{
    "r_id": 1,
    "condition": "time"
}
```

### Backend return

```json
{ 
    "Rate": {
        "total": 1,
        "0-1": 1,
        "1-2": 0,
        "2-3": 3, 
        "3-4": 5, 
        "4-5": 0 
    } ,
    "Comments":[{},{},{}] 
}
```


## comment_details (GET)

### Backend url
/comment/restaurant/details/ 

### Frontend to Backend

```json
{
    "comment_id": 1
}
```

### Backend return

```json
{
    "name": "customer1",
    "rate": 5,
    "review": "very good",
    "date": 2022-07-05
}
```

## Add restaurant picture (POST)

### Backend url

```
/restaurant/picture/add
```

### Frontend to Backend

```json
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhhcHB5M0BnbWFpbC5jb20ifQ.B7HafidswST2sOOesZ_bqvuVYQAVI4lHli-ENYTAVWk", 
    "picture": "picture_info"
 }

```

### Backend return

```json
{
    "picture_id": 1
}
```


## Get restaurant all pictures (GET)

### Backend url

```
/restaurant/pictures/all
```

### Frontend to Backend

```
id=1
```

### Backend return

```json
    {
        "all_pictures":[
            {
                "picture_id": 1,
                "picture": "picture_info"
            }, {
                "picture_id": 2,
                "picture": "picture_info"
            }
        ]
    }
```


---
# Database structure

## custmomers 

| <u>id</u> | email | password | name | token | reset_code |
| --------- | ----- | -------- | ---- | ----- | ---------- |
|           |       |          |      |       |            |

## restaurant 

| <u>id</u> | email | password | name | postcode | address | phone_num | description | token | reset_code |
| --------- | ----- | -------- | ---- | -------- | ------- | --------- | ----------- | ----- | ---------- |
|           |       |          |      |          |         |           |             |       |            |

## cuisine

| <u>id</u> | name  |
| --------- | ----- |
| 1         | asian |

## restaurant_cuisine

| <u>restaurant</u> | <u>cuisine</u> |
| ----------------- | -------------- |
|                   |                |

restaurant => restaurant.id

cuisine => cuisine.id

## dish

| <u>id</u> | name | price | <u>restaurant</u> | describe | type |
| --------- | ---- | ----- | ----------------- | -------- | ---- |
|           |      |       |                   |          |      |

## voucher

| <u>id</u> | name | start time | end time |  discount rate | description |
| --------- | ---- | ---------- | ---------| -------------- | ----------- |
|           |      |            |          |                |             |

## restaurant_voucher

| <u>id</u> | restaurant | voucher | all_number |  availiable number | start time of releasing | end time of releasing |
| --------- | ---------- | ------- | ---------- | ------------------ | ----------------------- |---------------------- |
|           |            |         |            |                    |                         |                       |

restaurant => restaurant.id

voucher => voucher.id

## customer_voucher

| <u>id</u> | customer | voucher |  state(unused, used uncommented, commented, expired)  | date | code |
| --------- | -------- | ------- | ----------------------------------------------------- | -----| ---- |
|           |          |         |                                                       |      |      |

customer => customer.id

voucher => voucher.id

## friend

| <u>id</u>  | <u>followee</u>  | <u>follower</u> |
| ---------- | -----------------|-----------------|
|            |                  |                 |

followee => followee.id

follower => follower.id

## Comment

| <u>id</u> | restaurant | customer | rate | review | creation date |
| --------- | ---------- | -------- | ---- | ------ | ------------- | 
|           |            |          |      |        |               |

restaurant => restaurant.id

customer => customer.id

## Message

| <u>id</u> | sendee | sender | message | creation date | read |
| --------- | ------ | ------ | ------- | ------------- | ---- |
|           |        |        |         |               |      |

## Picture

| <u>id</u> | restaurant | filename |
| --------- | ---------- | -------- | 
|           |            |          |

restaurant => restaurant.id

## Subscribe

| <u>id</u> | restaurant | customer | message | creation date |
| --------- | ---------- | -------- | ------- | ------------- | 
|           |            |          |         |               |

restaurant => restaurant.id

customer => customer.id
