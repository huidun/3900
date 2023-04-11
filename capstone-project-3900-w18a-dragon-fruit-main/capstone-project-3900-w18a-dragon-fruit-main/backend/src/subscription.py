import sqlite3
import validation as V
from flask import abort
from datetime import datetime
import smtplib
from email.mime.text import MIMEText

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


def subscribe_restaurant(token, r_id):
    # find the user id by token
    if token == "":
        abort(406, description="Please login first")
    info = V.get_info(token)
    u_id = info['id']

    # store the pair of user_id and restaurant id in the restaurant subscription list
    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    add_info = '''INSERT INTO SUBSCRIBE (RESTAURANT, CUSTOMER)
        VALUES(?, ?)'''

    val = (r_id, u_id)
    c.execute(add_info, val)

    # send emails including info of the restaurant's all vouchers

    query = '''SELECT START_TIME, VOUCHER
            FROM RESTAURANT_VOUCHER
            WHERE RESTAURANT = ?
    '''

    c.execute(query, (r_id,))
    data = c.fetchall()

    conn.commit()
    c.close()
    conn.close()

    n_time = datetime.now()

    list_of_vid = []
    for i in data:
        t = V.db_str_to_dt(i[0])
        if t < n_time:
            continue
        else:
            list_of_vid.append(i[1])

    for v_id in list_of_vid:
        send_email([u_id], v_id)

    return {
    }


def unsubscribe_restaurant(token, r_id):
    # find the user id by token
    if token is None:
        abort(406, description="Please login first")
    info = V.get_info(token)
    u_id = info['id']

    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    delete_info = '''DElETE FROM SUBSCRIBE
                WHERE CUSTOMER = ?
                AND RESTAURANT = ?
    '''

    c.execute(delete_info, (u_id, r_id))

    conn.commit()
    c.close()
    conn.close()

    return {
    }


def check_subscription(token, r_id):
    # find the user id by token
    if token == "":
        return False
        # abort(406, description="Please login first")
    info = V.get_info(token)
    u_id = info['id']

    # connect to database
    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    query = '''SELECT RESTAURANT
            FROM SUBSCRIBE
            WHERE CUSTOMER = ?   
    '''
    c.execute(query, (u_id,))
    data = c.fetchall()

    conn.commit()
    c.close()
    conn.close()

    res = False

    for i in data:
        if i[0] == r_id:
            res = True

    return res


# c_id can be a list but v_id must be single
def send_email(c_ids, v_id):
    # set up stmp
    mail_host = 'smtp.163.com'
    mail_user = '13901593489'
    mail_pass = 'COMP3900binge'
    sender = '13901593489@163.com'
    receivers = []

    # extract info from parameter

    try:
        conn = sqlite3.connect("sqliteDB.db")
    except sqlite3.Error as e:
        print(e)
        return {
            "is_success": False
        }

    c = conn.cursor()

    for c_id in c_ids:

        query = '''SELECT EMAIL
                FROM CUSTOMER
                WHERE ID = ?
        '''
        c_id = c_id if type(c_id) == int else c_id[0]
        # print(c_id)
        c.execute(query, (c_id, ))
        emails = c.fetchall()[0]
        for email in emails:
            receivers.append(email)

    query2 = '''SELECT START_TIME, END_TIME, RESTAURANT
                FROM RESTAURANT_VOUCHER
                WHERE VOUCHER = ?
    '''

    c.execute(query2, (v_id, ))
    # print(v_id)
    data = c.fetchone()
    # print(data)
    start_time = data[0]
    end_time = data[1]
    r_id = data[2]

    query3 = '''SELECT NAME
            FROM RESTAURANT
            WHERE ID = ?
    '''

    c.execute(query3, (r_id, ))
    restaurant_name = c.fetchone()[0]

    conn.commit()
    c.close()
    conn.close()

    # content = "Dear customer, there will be a voucher releasing from " + start_time +
    # ' to ' + end_time + ' from your subscribed restaurant ' + restaurant_name + '.
    # If you are interested in, please remember to set a reminder.'

    # print(receivers)
    # with open('index.html', encoding='utf-8') as f:
        # html_string = f.read()

    content = html_string_before + "New Voucher Come" + html_string_middle + \
              "Dear customer, there will be a voucher releasing from " + start_time + \
              ' to ' + end_time + ' from your subscribed restaurant ' + restaurant_name + \
              '. If you are interested in, please remember to set a reminder.' + html_string_after

    # edit message body
    message = MIMEText(content, 'html', 'utf-8') # MIMEText(content, 'plain', 'utf-8')
    message['Subject'] = 'New Voucher is Coming'
    message['From'] = sender
    message['To'] = ",".join(receivers)

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

    return True



