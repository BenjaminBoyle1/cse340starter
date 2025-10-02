-- Task 1: Insert a new record into the account table
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Task 2: Modify the Tony Stark record to change the account_type to "Admin"
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- Task 3: Delete the Tony Stark record from the database
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

-- Task 4: Modify the "GM Hummer" record description using PostgreSQL Replace function
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Task 5: Use an inner join to select the make and model fields from inventory
-- and the classification name field from classification table for items in "Sport" category
SELECT inv_make, inv_model, cls.classification_name
FROM inventory inv
INNER JOIN classification cls ON inv.classification_id = cls.classification_id
WHERE cls.classification_name = 'Sport';

-- Task 6: Update all records in the inventory table to modify inv_image and inv_thumbnail paths
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
