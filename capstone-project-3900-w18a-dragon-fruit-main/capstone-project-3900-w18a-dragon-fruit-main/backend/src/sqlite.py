import sqlite3

conn = sqlite3.connect('sqliteDB.db')
c = conn.cursor()

c.execute('''CREATE TABLE IF NOT EXISTS CUSTOMER
       (ID           INTEGER PRIMARY KEY AUTOINCREMENT,
       NAME          TEXT    NOT NULL,
       EMAIL         TEXT    NOT NULL UNIQUE,
       PASSWORD      TEXT    NOT NULL,
       TOKEN         TEXT,
       RESET_CODE    TEXT    
       );''')

c.execute('''CREATE TABLE IF NOT EXISTS RESTAURANT
       (ID           INTEGER PRIMARY KEY AUTOINCREMENT,
       NAME          TEXT    NOT NULL,
       EMAIL         TEXT    NOT NULL UNIQUE,
       PASSWORD      TEXT    NOT NULL,
       POSTCODE      INTEGER,
       ADDRESS       TEXT,
       PHONE_NUMBER  TEXT,
       DESCRIPTION   TEXT,
       TOKEN         TEXT,
       RESET_CODE    TEXT
       );''')

c.execute('''CREATE TABLE IF NOT EXISTS CUISINE
       (ID           INTEGER PRIMARY KEY AUTOINCREMENT,
       NAME          TEXT     NOT NULL UNIQUE
       );''')

c.execute('''CREATE TABLE IF NOT EXISTS RESTAURANT_CUISINE
       (ID           INTEGER PRIMARY KEY AUTOINCREMENT,
       RESTAURANT    INTEGER     NOT NULL,
       CUISINE       INTEGER     NOT NULL,
       FOREIGN KEY (RESTAURANT) REFERENCES RESTAURANT(ID),
       FOREIGN KEY (CUISINE) REFERENCES CUISINE(ID));''')

c.execute('''CREATE TABLE IF NOT EXISTS DISH
       (ID           INTEGER PRIMARY KEY AUTOINCREMENT,
       DISH_NAME     TEXT        NOT NULL,
       PRICE         INTEGER     NOT NULL,
       RESTAURANT    INTEGER     NOT NULL,
       DESCRIPTION   TEXT,
       FOREIGN KEY (RESTAURANT) REFERENCES RESTAURANT(ID));''')

c.execute('''CREATE TABLE IF NOT EXISTS VOUCHER
       (ID           INTEGER PRIMARY KEY AUTOINCREMENT,
       NAME          TEXT        NOT NULL,
       START_TIME	DATETIME    NOT NULL,
       END_TIME	DATETIME    NOT NULL,
       DISCOUNT_RATE INTEGER     NOT NULL,
       DESCRIPTION   TEXT
       );''')

c.execute('''CREATE TABLE IF NOT EXISTS RESTAURANT_VOUCHER
       (ID           INTEGER PRIMARY KEY AUTOINCREMENT,
       RESTAURANT    INTEGER     NOT NULL,
       VOUCHER       INTEGER     NOT NULL,
       ALL_NUMBER    INTEGER     NOT NULL,
       AVAILABLE_NUMBER    INTEGER     NOT NULL,
       START_TIME    DATETIME    NOT NULL,
       END_TIME      DATETIME    NOT NULL,
       FOREIGN KEY (RESTAURANT) REFERENCES RESTAURANT(ID),
       FOREIGN KEY (VOUCHER) REFERENCES VOUCHER(ID));''')

c.execute('''CREATE TABLE IF NOT EXISTS CUSTOMER_VOUCHER
       (ID           INTEGER PRIMARY KEY AUTOINCREMENT,
       CUSTOMER      INTEGER     NOT NULL,
       VOUCHER       INTEGER     NOT NULL,
       STATE         TEXT     NOT NULL,
       DATE          DATE NOT NULL DEFAULT CURRENT_DATE,
       CODE          TEXT      NOT NULL,
       FOREIGN KEY (CUSTOMER) REFERENCES CUSTOMER(ID),
       FOREIGN KEY (VOUCHER) REFERENCES VOUCHER(ID));''')

c.execute('''CREATE TABLE IF NOT EXISTS FRIEND
       (ID          INTEGER PRIMARY KEY AUTOINCREMENT,
       FOLLOWEE     INTEGER     NOT NULL,
       FOLLOWER     INTEGER     NOT NULL,
       FOREIGN KEY (FOLLOWEE) REFERENCES CUSTOMER(ID),
       FOREIGN KEY (FOLLOWER) REFERENCES CUSTOMER(ID));''')

c.execute('''CREATE TABLE IF NOT EXISTS COMMENT
       (ID           INTEGER PRIMARY KEY AUTOINCREMENT,
       RESTAURANT    INTEGER     NOT NULL,
       CUSTOMER      INTEGER     NOT NULL,
       RATE          REAL     NOT NULL,
       REVIEW        TEXT,
       CREATION_DATE DATE NOT NULL DEFAULT CURRENT_DATE,
       VOUCHER       INTEGER     NOT NULL,
       FOREIGN KEY (RESTAURANT) REFERENCES RESTAURANT(ID),
       FOREIGN KEY (CUSTOMER) REFERENCES CUSTOMER(ID),
       FOREIGN KEY (VOUCHER) REFERENCES VOUCHER(ID));''')

c.execute('''CREATE TABLE IF NOT EXISTS PICTURE
       (ID           INTEGER PRIMARY KEY AUTOINCREMENT,
       RESTAURANT    INTEGER     NOT NULL,
       IMAGE         TEXT        NOT NULL,
       FOREIGN KEY (RESTAURANT) REFERENCES RESTAURANT(ID));''')
c.execute('''CREATE TABLE IF NOT EXISTS SUBSCRIBE
       (ID           INTEGER PRIMARY KEY AUTOINCREMENT,
       RESTAURANT    INTEGER     NOT NULL,
       CUSTOMER      INTEGER     NOT NULL,
       MESSAGE        TEXT,
       CREATION_DATE DATE NOT NULL DEFAULT CURRENT_DATE,
       FOREIGN KEY (RESTAURANT) REFERENCES RESTAURANT(ID),
       FOREIGN KEY (CUSTOMER) REFERENCES CUSTOMER(ID));''')

c.execute('''CREATE TABLE IF NOT EXISTS MESSAGE
       (ID          INTEGER PRIMARY KEY AUTOINCREMENT,
       SENDEE     INTEGER     NOT NULL,
       SENDER     INTEGER     NOT NULL,
       MESSAGE        TEXT,
       CREATION_DATE DATE NOT NULL DEFAULT CURRENT_DATE,
       READ      Boolean    NOT NULL,
       FOREIGN KEY (SENDEE) REFERENCES CUSTOMER(ID),
       FOREIGN KEY (SENDER) REFERENCES CUSTOMER(ID));''')

c.close()
conn.commit()
conn.close()