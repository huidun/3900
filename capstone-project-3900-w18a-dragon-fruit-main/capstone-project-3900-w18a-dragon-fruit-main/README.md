# Project of 3900-w18a-dragon-fruit

## Eatery Vouchers Management System
Many people love a good bargain, and it is no exception when it comes to eating 
out. In a push to bring people back into eateries such as cafes and restaurants, 
Eatery Vouchers Management System aims to connect eateries with customers. 
Eateries can maintain a profile about themselves and their menu. They can decide 
to add a set number of vouchers that offer a percentage discount for a given time 
range, and they can also decide to create a schedule to specify when they would
like discount vouchers to be available for their eateries. Customers can then look 
for discounts at eateries that look interesting to them, book a voucher for an eatery 
they are interested in, and use that voucher to get a discount on their meal.
The developed system should do, at least, the following:
• Eateries must be able to register and maintain a profile for themselves that
is visible to all system users, and includes at least the eatery name, address, 
cuisines offered, and a menu.
• A subscribed eatery must be able to offer any given number of discount 
vouchers for any time range of a given day. A discount voucher provides a 
customer with a percentage discount on their bill for a specified time range 
at the eatery that offered the voucher.
• To save staff the trouble of adding discount vouchers separately for each day, 
the system must also allow eateries to specify a repeated weekly schedule, 
specifically: when, what % discount, and how many discount vouchers will 
appear for each time range the eatery wants to offer discount vouchers for 
(e.g., this could allow staff to specify that 20 discount vouchers, each offering 
15% off, are automatically added for between 1pm and 2pm for every 
Tuesday).
2
• Customers must be able to find discounts that are available during a specified
time range based on location (postcode), cuisine, and (optionally) some 
keywords that match to eatery menu entries. Customers must be able to 
navigate to any eatery's profile from search results. Once a customer finds 
an available discount voucher: they must be able to book a voucher (which 
reduces the available voucher count for that eatery and time period by 1) 
and see the time range for which their booked voucher is available (each 
customer must not be able to book a discount voucher if there are none left, 
and can only book 1 voucher per eatery per voucher time range).
• When a customer with a discount voucher orders their meal at the 
corresponding eatery within the voucher's time range, they must be able to 
use their voucher by showing the eatery a code that represents the discount 
voucher. The eatery must then be able to use this code to identify what the 
% discount should be, to verify that the customer had indeed booked a 
discount voucher, and that this same discount voucher has not been 
previously used.
• Customers must be able to add reviews that include some text, and a rating 
out of 5, for each eatery that they have a discount voucher for. Any customer
must be able to read such reviews along with the average rating for any 
eatery they are thinking of booking a discount voucher for.
• A customer must be able to see recommendations showing all eateries that 
are currently offering discount vouchers, where the customer has not 
previously had a booking, and where the eatery is one that the customer
might be interested in. You must incorporate information about the 
customer's past bookings, their review ratings for past bookings, reviews and
ratings left by other customers, and you may also use any other variable you 
wish to use/introduce that can be helpful in providing such 
recommendations.

You need to come up with, at least, eight (8) functionalities including, at least, two 
novel functionalities with respect to existing related eatery vouchers management
systems.
Useful Links
1. https://eatclub.com.au/
2. https://www.firsttable.com.au/sydney


## Team Members

-   [Penghui He, z5268310](https://webcms3.cse.unsw.edu.au/users/z5268310)
-   [Runze Li, z5286712](https://webcms3.cse.unsw.edu.au/users/z5286712)
-   [Xingyu Shen, z5211156](https://webcms3.cse.unsw.edu.au/users/z5211156)
-   [Xinran Tang, z5300870](https://webcms3.cse.unsw.edu.au/users/z5300870)
-   [Yoichi Minanokawa, z5271781](https://webcms3.cse.unsw.edu.au/users/z5271781)

## Frontend set up 

This project was created with `Create React App`.

In order to open it for the first time or the front-end configuration is wrong, you can try to run the installation of the required libraries on `capstone-project-3900-w18a-dragon-fruit/frontend`.

```
npm install
```

In the project directory you can run the app in the development mode with the code
```
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view it in browser and pages will reload when you make changes.

---

## Backend set up

The system requires Python 3.7+

In the project firectory, use this command to install required modules:

```
pip install -r requirements.txt
```

After you install all the modules, then change the current directory to `capstone-project-3900-w18a-dragon-fruit/backend/src/`

Then run the command below to run the server:

```
python3 server.py
```

Now the server is running on [http://localhost:8000](http://localhost:8000).

## Useful Links

-   [Project Description](https://webcms3.cse.unsw.edu.au/COMP9900/22T2/resources/77128)
-   [Project Example 1 - eatclub](https://eatclub.com.au/)
-   [Project Example 1 - firsttable](https://www.firsttable.com.au/sydney)

-   [Miro - Frount](https://miro.com/app/dashboard/)
-   [Frontend Router](https://reactrouter.com/docs/en/v6/getting-started/tutorial)
-   [Font Awesome - Icon](https://fontawesome.com/icons)
-   [Theme Style Check](https://bareynol.github.io/mui-theme-creator/)
-   [Flask Guildline](https://flask.palletsprojects.com/en/2.2.x/)
