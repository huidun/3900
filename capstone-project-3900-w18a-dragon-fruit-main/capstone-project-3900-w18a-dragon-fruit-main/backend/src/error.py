from werkzeug.exceptions import HTTPException


class AccessError(HTTPException):
    code = 403
    message = 'Access Error'


class InputError(HTTPException):
    code = 400
    message = 'Input Error'


class PasswordError(HTTPException):
    code = 401
    message = 'Password Error'


class EmailError(HTTPException):
    code = 400
    message = 'Email Error'


class NameError(HTTPException):
    code = 403
    message = 'Name Error'

class VoucherError(HTTPException):
    code = 405
    message = 'Voucher Error'

class SubscriptionError(HTTPException):
    code = 406
    message = 'Subscription Error'
