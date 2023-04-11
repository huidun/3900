import sqlite3
import hashlib


# clear the database
def deleteData():
    conn = sqlite3.connect('sqliteDB.db')
    c = conn.cursor()
    c.execute('''DELETE FROM CUSTOMER''')
    c.execute('''DELETE FROM RESTAURANT''')
    c.execute('''DELETE FROM CUISINE''')
    c.execute('''DELETE FROM RESTAURANT_CUISINE''')
    c.execute('''DELETE FROM DISH''')
    c.execute('''DELETE FROM sqlite_sequence''')
    c.close()
    conn.commit()
    conn.close()


def encrypt_password(password):
    hashpass = hashlib.sha256(password.encode()).hexdigest()

    return hashpass


if __name__ == "__main__":
    deleteData()