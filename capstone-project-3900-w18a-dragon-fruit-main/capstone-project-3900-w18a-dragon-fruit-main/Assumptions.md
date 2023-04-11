# Assumptions and Exceptions

## Register
```
- A user cannot register for both a customer and a restaurant account using the same email
- Email has to be valid format
- Password has to be at least 6 characters long
- Name has to be between 1-50 characters inclusively in length
```

## Customer Profile
```
- Customer name and email are visible to all logged in users including customers and restaurants
- A customer can only change his/her own name 
- Profiles are not visible to any users not logged in
```

## Restaurant Profile
```
- Profiles are not visible to any users not logged in
- Postcode has to be 4 digits
- Description cannot exceed 1000 characters
- Phone_number is string and can include brackets
```

## Vouchers
'''
- Voucher repetitions has to be between 1-4 (1: voucher is added once)
'''