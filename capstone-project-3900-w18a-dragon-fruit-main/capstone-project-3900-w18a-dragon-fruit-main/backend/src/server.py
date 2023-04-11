import json
from json import dumps
import os

from flask import Flask, request, send_from_directory
from werkzeug.utils import secure_filename
from flask_mail import Mail, Message
from flask_cors import CORS
from werkzeug.exceptions import HTTPException
import smtplib
from email.mime.text import MIMEText

import auth, customer, restaurant, validation, voucher, picture, message
from search import search_restaurant
import validation as V
import comment
import friend
import recommendation
import subscription

APP = Flask(__name__)
CORS(APP)

html_string_before = """
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title></title>
    <link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,400i,700,700i" rel="stylesheet">
<style>

html,
body {
    margin: 0 auto !important;
    padding: 0 !important;
    height: 100% !important;
    width: 100% !important;
    background: #f1f1f1;
}

* {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
}

div[style*="margin: 16px 0"] {
    margin: 0 !important;
}

table,
td {
    mso-table-lspace: 0pt !important;
    mso-table-rspace: 0pt !important;
}

table {
    border-spacing: 0 !important;
    border-collapse: collapse !important;
    table-layout: fixed !important;
    margin: 0 auto !important;
}

img {
    -ms-interpolation-mode:bicubic;
}

a {
    text-decoration: none;
}

*[x-apple-data-detectors],
.unstyle-auto-detected-links *,

img.g-img + div {
    display: none !important;
}

@media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
    u ~ div .email-container {
        min-width: 320px !important;
    }
}

@media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
    u ~ div .email-container {
        min-width: 375px !important;
    }
}

@media only screen and (min-device-width: 414px) {
    u ~ div .email-container {
        min-width: 414px !important;
    }
}

</style>

<style>
.bg_dark{
	background: rgba(0,0,0,.8);
}
.bg_white{
	background: rgba(250,250,250,.8);
}
.email-section{
	padding:2.5em;
}

.btn{
	padding: 10px 15px;
}
.btn.btn-primary{
	border-radius: 30px;
	background: #f3a333;
	color: #ffffff;
}



h1,h2,h3,h4,h5,h6{
	font-family: 'Playfair Display', serif;
	color: #000000;
	margin-top: 0;
}

body{
	font-family: 'Montserrat', sans-serif;
	font-weight: 400;
	font-size: 15px;
	line-height: 1.8;
	color: rgba(0,0,0,.4);
}

a{
	color: #f3a333;
}

table{
}

.logo h1{
	margin: 0;
}
.logo h1 a{
	color: #000;
	font-size: 20px;
	font-weight: 700;
	text-transform: uppercase;
	font-family: 'Montserrat', sans-serif;
}

.hero{
	position: relative;
}
.hero img{

}
.hero .text{
	color: rgba(255,255,255,.8);
}
.hero .text h2{
	color: #ffffff;
	font-size: 30px;
	margin-bottom: 0;
}

.heading-section{
}
.heading-section h2{
	color: #000000;
	font-size: 28px;
	margin-top: 0;
	line-height: 1.4;
}
.heading-section .subheading{
	margin-bottom: 20px !important;
	display: inline-block;
	font-size: 13px;
	text-transform: uppercase;
	letter-spacing: 2px;
	color: rgba(0,0,0,.4);
	position: relative;
}
.heading-section .subheading::after{
	position: absolute;
	left: 0;
	right: 0;
	bottom: -10px;
	content: '';
	width: 100%;
	height: 2px;
	background: #f3a333;
	margin: 0 auto;
}

.heading-section-white{
	color: rgba(255,255,255,.8);
}
.heading-section-white h2{
	font-size: 28px;
	line-height: 1;
	padding-bottom: 0;
}
.heading-section-white h2{
	color: #ffffff;
}
.heading-section-white .subheading{
	margin-bottom: 0;
	display: inline-block;
	font-size: 13px;
	text-transform: uppercase;
	letter-spacing: 2px;
	color: rgba(255,255,255,.4);
}

.text-services h3{
	font-size: 20px;
}

.img .icon a{
	display: block;
	width: 60px;
	position: absolute;
	top: 0;
	left: 50%;
	margin-left: -25px;
}

.footer ul{
	margin: 0;
	padding: 0;
}
.footer ul li{
	list-style: none;
	margin-bottom: 10px;
}
.footer ul li a{
	color: rgba(255,255,255,1);
}

</style>


</head>

<body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #222222;">
	<center style="width: 100%; background-color: #f1f1f1;">
    <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
      &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
    </div>
    <div style="max-width: 600px; margin: 0 auto;" class="email-container">
      <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
		  <tr>
			  <td class="bg_white logo" style="padding: 1em 2.5em; text-align: center">
				  <h1><a href="#">Binge</a></h1>
			  </td>
		  </tr>
		  <tr>
			  <td class="bg_white">
				  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
					  <tr>
						  <td class="bg_dark email-section" style="text-align:center;">
							  <div class="heading-section heading-section-white">
								  <span class="subheading">Reminder</span><h2>"""
html_string_middle = """</h2>
								  <p>
								  """
html_string_after = """</p>
							  </div>
						  </td>
					  </tr>
				  </table>
			  </td>
		  </tr>
		  <tr>
			  <td valign="middle" class="hero" style="background-color: #696969; background-size: cover; height: 350px;">
				  <table>
					  <tr>
						  <td>
							  <div class="text" style="padding: 0 3em; text-align: center;">
								  <h2>Eat cheaper &amp; Eat happier</h2>
								  <p>We are a bridge connecting restaurants and diners.</p>
								  <p>With us, restaurant owners can manage menus and vouchers quickly and efficiently.Through us, diners can discover suitable restaurants and cheap vouchers.</p>
								  <p><a href="http://localhost:3000/" class="btn btn-primary">Come and Join Us!</a></p>
							  </div>
						  </td>
					  </tr>
				  </table>
			  </td>
		  </tr>
      </table>

    </div>
  </center>
</body>
</html>
"""


APP.config['TRAP_HTTP_EXCEPTIONS'] = True
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLD = 'pictures'
UPLOAD_FOLDER = os.path.join(APP_ROOT, UPLOAD_FOLD)
APP.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@APP.errorhandler(HTTPException)
def handle_exception(e):
    """Return JSON instead of HTML for HTTP errors."""
    # start with the correct headers and status code from the error
    response = e.get_response()
    # replace the body with JSON
    response.data = json.dumps({
        "code": e.code,
        "name": e.name,
        "description": e.description,
    })
    response.content_type = "application/json"
    return response


APP.register_error_handler(Exception, handle_exception)


@APP.route("/getinfo", methods=['GET'])
def get_info():
    """Calls the get_info function from auth.py to get user id and name"""
    return dumps(
        validation.get_info(
            request.args.get('token')
        )
    )


# auth
@APP.route("/auth/register", methods=['POST'])
def register():
    """Calls the register function from auth.py"""
    data = request.get_json()
    return dumps(
        auth.auth_register(
            data['name'], data['email'], data['password'], data['type']
        )
    )


@APP.route("/auth/login", methods=['POST'])
def login():
    """Calls the login function from auth.py"""
    data = request.get_json()
    return dumps(
        auth.auth_login(
            data['type'], data['email'], data['password']
        )
    )


@APP.route("/auth/logout", methods=['POST'])
def logout():
    """Calls the logout function from auth.py"""
    data = request.get_json()
    return dumps(
        auth.auth_logout(
            data['token']
        )
    )


@APP.route("/auth/passwordreset/request", methods=["POST"])
def auth_passwordreset_request():
    '''Calls the auth_passwordreset_request function in auth.py to send verification code to user's email address'''
    # set up stmp
    mail_host = 'smtp.163.com'
    mail_user = '13901593489'
    mail_pass = 'COMP3900binge'
    sender = '13901593489@163.com'
    receivers = []

    # ectract info from frontend
    data = request.get_json()
    email = data["email"]

    receivers.append(email)
    reset_code = auth.auth_passwordreset_request(email)
    content = html_string_before + "Password Reset Code" + html_string_middle + "Your BINGE password reset code is " + reset_code + ' . Please ignore this message if you never try to reset your password.' + html_string_after

    # edit message body
    message = MIMEText(content, 'html', 'utf-8')
    message['Subject'] = 'Binge Password Reset Verification'
    message['From'] = sender
    message['To'] = receivers[0]

    # login and send email
    try:
        smtpObj = smtplib.SMTP()
        # connect to server
        smtpObj.connect(mail_host, 25)
        # login server
        smtpObj.login(mail_user, mail_pass)
        # send
        smtpObj.sendmail(
            sender, receivers, message.as_string())
        # logout
        smtpObj.quit()
        print('success')
    except smtplib.SMTPException as e:
        print('error', e)

    result = {}
    return dumps(result)


@APP.route("/auth/passwordreset/reset", methods=["POST"])
def auth_passwordreset_reset():
    data = request.get_json()
    result = auth.auth_passwordreset_reset(data['email'], data["reset_code"], data["new_password"])
    return dumps(result)


# Customer
@APP.route("/customer/profile/details", methods=['GET'])
def customer_details():
    """Calls the customer_profile_details function from customer.py
        to get customer name and email"""
    return dumps(
        customer.customer_profile_details(
            int(request.args.get('id'))
        )
    )


# Customer and Restaurant
@APP.route("/profile/details", methods=['GET'])
def profile_details():
    """Calls the customer_profile_details or restaurant_simple_details functions
        to get customer/restaurant name and email"""
    type = request.args.get('type')
    if type == 'true': # customer
        return dumps(
            customer.customer_profile_details(
                int(request.args.get('id'))
            )
        )
    else:
        return dumps(
            restaurant.restaurant_simple_details(
                int(request.args.get('id'))
            )
        )


@APP.route("/profile/edit/name", methods=['PUT'])
def profile_edit_name():
    """Calls the customer_profile_edit_name or restaurant_profile_edit_name
        functions to change user name to given name"""
    data = request.get_json()
    if data['type'] == True: # customer
        return dumps(
            customer.customer_profile_edit_name(
                data['token'], data['name']
            )
        )
    else:
        return dumps(
            restaurant.restaurant_profile_edit_name(
                data['token'], data['name']
            )
        )


@APP.route("/profile/edit/password", methods=['PUT'])
def profile_edit_password():
    """Calls the customer_profile_edit_password or restaurant_profile_edit_password
        functions to change restaurant password"""
    data = request.get_json()
    if data['type']:
        return dumps(
            customer.customer_profile_edit_password(
                data['token'], data['old_password'], data['new_password']
            )
        )
    else:
        return dumps(
            restaurant.restaurant_profile_edit_password(
                data['token'], data['old_password'], data['new_password']
            )
        )


# Restaurant
@APP.route("/restaurant/profile/details", methods=['GET'])
def restaurant_details():
    """Calls the restaurant_profile_details function from restaurant.py
        to get restaurant details"""
    return dumps(
        restaurant.restaurant_profile_details(
            int(request.args.get('id'))
        )
    )


@APP.route("/restaurant/profile/contacts", methods=['GET'])
def restaurant_contacts():
    """Calls the restaurant_profile_contacts function from restaurant.py
        to get restaurant details"""
    return dumps(
        restaurant.restaurant_profile_contacts(
            int(request.args.get('id'))
        )
    )


@APP.route("/restaurant/profile/overview", methods=['GET'])
def restaurant_overview():
    """Calls the restaurant_profile_overview function from restaurant.py
        to get restaurant description"""
    return dumps(
        restaurant.restaurant_profile_overview(
            int(request.args.get('id'))
        )
    )


@APP.route("/restaurant/profile/edit/contacts", methods=['PUT'])
def restaurant_edit_contacts():
    """Calls the restaurant_profile_edit_contacts function from restaurant.py
        to change restaurant address, postcode and phone_number"""
    data = request.get_json()
    return dumps(
        restaurant.restaurant_profile_edit_contacts(
            data['token'], data['address'], data['postcode'], data['phone_number']
        )
    )


@APP.route("/restaurant/profile/edit/description", methods=['PUT'])
def restaurant_edit_description():
    """Calls the restaurant_profile_edit_description function from restaurant.py
        to change restaurant description"""
    data = request.get_json()
    return dumps(
        restaurant.restaurant_profile_edit_description(
            data['token'], data['description']
        )
    )


@APP.route("/restaurant/menu/add_dish", methods=['PUT'])
def restaurant_add_dish():
    """Calls the restaurant_menu_add_dish function from restaurant.py
        to add dish into restaurant's menu"""
    data = request.get_json()
    return dumps(
        restaurant.restaurant_menu_add_dish(
            data['token'], data['dish_name'], data['price'],  data['description']
        )
    )


@APP.route("/restaurant/menu/dish/edit", methods=['PUT'])
def restaurant_dish_edit():
    """Calls the restaurant_menu_edit_dish function from restaurant.py
        to change dish description"""
    data = request.get_json()
    return dumps(
        restaurant.restaurant_menu_edit_dish(
            data['dish_id'], data['name'], data['price'], data['description']
        )
    )


@APP.route("/restaurant/menu/delete_dish", methods=['PUT'])
def restaurant_delete_dish():
    """Calls the restaurant_menu_delete_dish  function from restaurant.py
        to add dish into restaurant's menu"""
    data = request.get_json()
    return dumps(
        restaurant.restaurant_menu_delete_dish(
            data['token'], data['dish_id']
        )
    )


@APP.route("/restaurant/menu/details", methods=['GET'])
def restaurant_details_menu():
    """Calls the restaurant_details  function from restaurant.py
        to get restaurant's info"""
    # data = request.get_json()
    return dumps(
        restaurant.restaurant_menu_details(
            int(request.args.get('id'))
        )
    )


@APP.route("/restaurant/menu/dish/details", methods=['GET'])
def restaurant_dish_details():
    """Calls the restaurant_menu_dish_details function from restaurant.py
        to get dish details"""
    return dumps(
        restaurant.restaurant_menu_dish_details(
            int(request.args.get('id'))
        )
    )


@APP.route("/restaurant/profile/add_cuisine", methods=['PUT'])
def restaurant_add_cuisine():
    """Calls the add_cuisine function from restaurant.py
        to add cuisine to restaurant"""
    data = request.get_json()
    return dumps(
        restaurant.restaurant_profile_add_cuisine(
            data['token'], data['cuisine_name']
        )
    )


@APP.route("/restaurant/profile/delete_cuisine", methods=['PUT'])
def restaurant_delete_cuisine():
    """Calls the restaurant_profile_delete_cuisine function from restaurant.py
        to delete restaurant's cuisine"""
    data = request.get_json()
    return dumps(
        restaurant.restaurant_profile_delete_cuisine(
            data['token'], data['cuisine_name']
        )
    )


@APP.route("/search", methods=['GET'])
def search():
    """Calls the search function from search.py
        to get fulfilled restaurant's name"""
    # data = request.get_json()
    return dumps(
        search_restaurant(request.args.get('token'), request.args.get('keyword'))
    )


@APP.route("/restaurant/cuisine", methods=['GET'])
def restaurant_cuisine():
    """Calls the cuisine function from restaurant.py
        to get restaurant's cuisine"""
    # data = request.get_json()
    return dumps(
        restaurant.restaurant_cuisine(request.args.get('id'))
    )


# Voucher
@APP.route("/restaurant/voucher/add", methods=['POST'])
def restaurant_voucher_add():
    """Calls the restaurant_voucher_add function from voucher.py"""
    data = request.get_json()
    return dumps(
        voucher.restaurant_voucher_add(
            data['token'], data['voucher'], data['total_number'],
            data['start_release_time'], data['end_release_time'],
            data['repetitions']
        )
    )


@APP.route("/restaurant/voucher/edit", methods=['PUT'])
def restaurant_voucher_edit():
    """Calls the restaurant_voucher_edit function from voucher.py
        to change restaurant voucher details"""
    data = request.get_json()
    return dumps(
        voucher.restaurant_voucher_edit(
            data['token'], data['voucher'], data['total_number'],
            data['start_release_time'], data['end_release_time']
        )
    )


@APP.route("/restaurant/voucher/details", methods=['GET'])
def restaurant_voucher_details():
    """Calls the restaurant_voucher_details function from voucher.py
        to get voucher details for restaurant"""
    return dumps(
        voucher.restaurant_voucher_details(request.args.get('id'))
    )


@APP.route("/customer/voucher/book", methods=['POST'])
def customer_voucher_book():
    """Calls the customer_voucher_book function from voucher.py to book voucher for customer"""
    data = request.get_json()
    return dumps(
        voucher.customer_voucher_book(
            data['token'], data['voucher_id']
        )
    )


@APP.route("/customer/voucher/details", methods=['GET'])
def customer_voucher_details():
    """Calls the customer_voucher_details function from voucher.py
        to get voucher details for customer"""
    return dumps(
        voucher.customer_voucher_details(request.args.get('token'), request.args.get('id'))
    )


@APP.route("/restaurant/vouchers/all", methods=['GET'])
def restaurant_vouchers_all():
    """Calls the restaurant_vouchers_all function from voucher.py
        to get all vouchers of a reataurant"""
    return dumps(
        voucher.restaurant_vouchers_all(request.args.get('id'))
    )


@APP.route("/customer/vouchers/all", methods=['GET'])
def customer_vouchers_all():
    """Calls the customer_vouchers_all function from voucher.py
        to get all vouchers of a customer"""
    return dumps(
        voucher.customer_vouchers_all(request.args.get('id'))
    )


@APP.route("/restaurant/voucher/verify", methods=['POST'])
def restaurant_voucher_verify():
    """Calls the restaurant_voucher_verify function from voucher.py to verity a voucher and get its info"""
    data = request.get_json()
    return dumps(
        voucher.restaurant_voucher_verify(
            data['code'], data['email']
        )
    )


@APP.route("/restaurant/voucher/summary", methods=['GET'])
def restaurant_voucher_summary():
    """Calls the restaurant_voucher_summary function from voucher.py
        to get summary of voucher sale"""
    return dumps(
        voucher.restaurant_voucher_summary(request.args.get('id'))
    )


# Comment
@APP.route("/comment/customer/add", methods=['POST'])
def customer_add_comment():
    """Calls the comment_customer_add_new function from comment.py
        to add comment"""
    data = request.get_json()
    return dumps(
        comment.comment_customer_add_new(
            data['token'], data['v_id'], data['rate'], data['review']
        )
    )


@APP.route("/comment/customer/edit", methods=['PUT'])
def customer_edit_comment():
    """Calls the restaurant_profile_edit_description function from comment.py
        to change restaurant description"""
    data = request.get_json()
    return dumps(
        comment.comment_customer_edit(
            data['comment_id'], data['rate'], data['review']
        )
    )


@APP.route("/comment/customer/all", methods=['GET'])
def get_all_customer_comments():
    """Calls the comment_details_order_by function from comment.py
        to get comments and rates"""
    # data = request.get_json()
    return dumps(
        comment.comment_customer_all(request.args.get('customer_id'), request.args.get('condition'))
    )


@APP.route("/comment/details/orderby", methods=['GET'])
def restaurant_comments_orderby():
    """Calls the comment_details_order_by function from comment.py
        to get comments and rates"""
    # data = request.get_json()
    return dumps(
        comment.comment_details_order_by(request.args.get('r_id'), request.args.get('condition'))
    )


@APP.route("/comment/restaurant/details", methods=['GET'])
def restaurant_comment_details():
    """given a comment id, calls the comment_details function from comment.py
        to get the details of the comment"""
    # data = request.get_json()
    return dumps(
        comment.comment_details(request.args.get('comment_id'))
    )


# Friend
@APP.route("/customer/friends/all", methods=['GET'])
def customer_friends_all():
    """given a customer id, calls the friends_all function from friend.py
        to get the list of followers and followings"""
    # data = request.get_json()
    return dumps(
        friend.friends_all(request.args.get('customer_id'))
    )


@APP.route("/customer/friend/profile", methods=['GET'])
def customer_friend_profile():
    """given a customer id, calls the friend_profile function from friend.py
        to get the profile of a friend"""
    return dumps(
        friend.friend_profile(request.args.get('customer_id'))
    )


@APP.route("/customer/friend/follow_unfollow", methods=['PUT'])
def customer_friends_follow_unfollow():
    """given a customer id, calls the friend_customer_follow_unfollow function from friend.py
        to follow and unfollow"""
    data = request.get_json()
    return dumps(
        friend.friend_customer_follow_unfollow(
            data['token'], data['customer_id'], data['type']
        )
    )


@APP.route("/customer/friend/followbyemail", methods=['POST'])
def customer_friends_followbyemail():
    """given a customer email, calls the friend_customer_followbyemail function from friend.py
        to follow"""
    data = request.get_json()
    return dumps(
        friend.friend_customer_followbyemail(
            data['token'], data['customer_email']
        )
    )


@APP.route("/search/friend", methods=['GET'])
def search_friend():
    """given a search word of name or email, calls the search_friend function from friend.py
        to return the friend profile"""
    return dumps(
        friend.search_friend(
            request.args.get('id'), request.args.get('search_word')
        )
    )


# Picture
@APP.route("/pictures/<path:filename>")
def send(filename):
    """Send picture"""
    return send_from_directory(APP.config['UPLOAD_FOLDER'], filename)


@APP.route("/restaurant/picture/add", methods=['POST'])
def picture_add():
    """Calls the picture_add function from picture.py"""
    files = request.files
    data = request.form
    if not os.path.exists('pictures'):
         os.makedirs('pictures')

    for item in files:
        # save the uploaded files to folder
        file = files.get(item)
        filename = secure_filename(file.filename)
        file.save(os.path.join(APP.config['UPLOAD_FOLDER'], filename))

    return dumps(
        picture.picture_add(
            data['token'], filename
        )
    )


@APP.route("/restaurant/pictures/all", methods=['GET'])
def picture_all():
    """Calls the picture_all function from picture.py"""
    return dumps(
        picture.pictures_all(request.args.get('id'))
    )


@APP.route("/recommendation/rating", methods=['GET'])
def recommend_rating():
    """Calls the recommendation_ratings function from recommendation.py"""
    return dumps(
        recommendation.recommendation_ratings(request.args.get('id'))
    )


@APP.route("/recommendation/preference", methods=['GET'])
def recommend_preference():
    """Calls the recommendation_preference function from recommendation.py"""
    return dumps(
        recommendation.recommendation_preference(request.args.get('id'))
    )


# Message
@APP.route("/message/send", methods=['POST'])
def user_send_message():
    """Calls the message_send_new function from message.py
        to add message"""
    data = request.get_json()
    return dumps(
        message.message_send_new(
            data['token'], data['customer_id'], data['message']
        )
    )


@APP.route("/message/channel/details", methods=['PUT'])
def message_channel_details():
    """given a customer id, calls the channel_details function from message.py
        to get the details of the channel"""
    data = request.get_json()
    return dumps(
        message.message_get_detail(
            data['token'], data['customer_id']
        )
    )


@APP.route("/message/channels", methods=['GET'])
def message_channels():
    """given a customer_id, calls the channels function from message.py
        to return the channels"""
    return dumps(
        message.message_show_all(
            request.args.get('customer_id')
        )
    )


@APP.route("/message/voucher/share", methods=['PUT'])
def message_voucher_give():
    """given a token, customer_id and v_id to share voucher"""
    data = request.get_json()
    return dumps(
        message.message_voucher_share(
            data['token'], data['customer_id'], data['v_id']
        )
    )


@APP.route("/message/voucher/friends", methods=['GET'])
def message_voucher_friends():
    """given customer_id to find friends"""
    return dumps(
        message.message_voucher_friendlist(
            request.args.get('token')
        )
    )


@APP.route("/message/delete", methods=['PUT'])
def message_delete_msg():
    """Calls the message delete function from message.py
        to delete message"""
    data = request.get_json()
    return dumps(
        message.message_delete(
            data['message_id']
        )
    )


# Subscribe
@APP.route("/subscription/subscribe", methods=['POST'])
def subscribe():
    """Calls the subscribe_restaurant function from subscription.py
        to subscribe"""
    data = request.get_json()
    return dumps(
        subscription.subscribe_restaurant(
            data['token'], data['r_id']
        )
    )


@APP.route("/subscription/unsubscribe", methods=['PUT'])
def unsubscribe():
    """Calls the unsubscribe_restaurant function from subscription.py
        to unsubscribe"""
    data = request.get_json()
    return dumps(
        subscription.unsubscribe_restaurant(
            data['token'], data['r_id']
        )
    )


@APP.route("/subscription/check_subscribe", methods=['GET'])
def check_subscribed_restaurant():
    """Calls the check_subscription function from subscription.py
        to find the restaurants subscribed by the user"""
    data = request.get_json()
    return dumps(
        subscription.check_subscription(
            data['token'], data['r_id']
        )
    )


if __name__ == "__main__":
    APP.run(debug=True, port=8000, host='0.0.0.0')
