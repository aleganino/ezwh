BEGIN TRANSACTION;

-- Position
CREATE TABLE IF NOT EXISTS "Position" (
	"positionID"	TEXT,
	"aisleID"	TEXT,
	"row"	TEXT,
	"col"	TEXT,
	"maxWeight"	INTEGER,
	"maxVolume"	INTEGER,
	"occupiedWeight"	INTEGER,
	"occupiedVolume"	INTEGER,
	PRIMARY KEY("positionID")
);

-- SKU
CREATE TABLE IF NOT EXISTS "SKU" (
	"Id"	INTEGER,
	"description"	TEXT,
	"weight"	REAL,
	"volume"	REAL,
	"avaiableQuantity" INTEGER,
	"price"	REAL,
	"notes"	TEXT,
	"positionID"	TEXT,
	PRIMARY KEY("Id"),
	FOREIGN KEY("positionID") REFERENCES "Position"("positionID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- SKU_ITEM_POSITION
CREATE TABLE IF NOT EXISTS "SKU_ITEM_POSITION" (
	"RFID"	INTEGER,
	"PositionID"	TEXT NOT NULL,
	"dateOfStock"	TEXT,
	PRIMARY KEY("RFID","PositionID"),
	FOREIGN KEY("PositionID") REFERENCES "Position"("positionID") ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY("RFID") REFERENCES "SKU_Item"("RFID") ON DELETE CASCADE
);

-- Test_Descriptor
CREATE TABLE IF NOT EXISTS "Test_Descriptor" (
	"id"	INTEGER,
	"SKU_Id"	INTEGER NOT NULL,
	"name"	TEXT,
	"procedureDescription"	TEXT,
	PRIMARY KEY("id"),
	FOREIGN KEY("SKU_Id") REFERENCES "SKU"("Id") ON DELETE CASCADE
);

-- RO_Product
CREATE TABLE IF NOT EXISTS "RO_Product" (
	"RO_id"	INTEGER,
	"SKUId"	INTEGER NOT NULL,
	"Quantity"	INTEGER,
	PRIMARY KEY("RO_id","SKUId"),
	FOREIGN KEY("RO_id") REFERENCES "Restock_Order"("id") ON DELETE CASCADE,
	FOREIGN KEY("SKUId") REFERENCES "SKU"("Id") ON DELETE CASCADE
);

-- RO_skuitems
CREATE TABLE IF NOT EXISTS "RO_skuitems" (
	"id"	INTEGER,
	"RO_id"	INTEGER NOT NULL,
	"RFID"	TEXT NOT NULL,
	"SKUId"	INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("RO_id") REFERENCES "Restock_Order"("id") ON DELETE CASCADE
);
	-- FOREIGN KEY("RFID") REFERENCES "SKU_Item"("RFID") ON DELETE CASCADE,
	-- FOREIGN KEY("SKUId") REFERENCES "SKU"("Id") ON DELETE CASCADE

-- Restock_Order
CREATE TABLE IF NOT EXISTS "Restock_Order" (
	"id"	INTEGER,
	"issueDate"	TEXT,
	"state"	TEXT NOT NULL DEFAULT 'ISSUED' CHECK("state" IN ("ISSUED", "DELIVERY", "DELIVERED", "TESTED", "COMPLETEDRETURN", "COMPLETED")),
	"supplierID"	INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("supplierID") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Return_Order
CREATE TABLE IF NOT EXISTS "Return_Order" (
	"id"	INTEGER,
	"returnDate"	TEXT,
	"restockOrderId"	INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("restockOrderId") REFERENCES "Restock_Order"("id") ON DELETE CASCADE
);

-- RN_Product
CREATE TABLE IF NOT EXISTS "RN_Product" (
	"RN_id"	INTEGER,
	"SKUId"	INTEGER NOT NULL,
	PRIMARY KEY("RN_id","SKUId"),
	FOREIGN KEY("RN_id") REFERENCES "Return_Order"("id") ON DELETE CASCADE,
	FOREIGN KEY("SKUId") REFERENCES "SKU"("Id") ON DELETE CASCADE
);

-- User
CREATE TABLE IF NOT EXISTS "User" (
	"id"	INTEGER,
	"username"	TEXT NOT NULL,
	"name"	TEXT,
	"surname"	TEXT,
	"password"	TEXT,
	"type"	TEXT CHECK("type" IN ("customer", "qualityEmployee", "clerk", "deliveryEmployee", "supplier")) NOT NULL,
	PRIMARY KEY("id")
	UNIQUE("username", "type")
);

-- Internal_Order
CREATE TABLE IF NOT EXISTS "Internal_Order" (
	"id"	INTEGER,
	"issueDate"	TEXT,
	"state"	TEXT CHECK("state" IN ("ISSUED", "ACCEPTED", "REFUSED", "CANCELED", "COMPLETED")),
	"customerID"	INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("customerID") REFERENCES "User"("id") ON DELETE CASCADE
);

-- IN_Product
CREATE TABLE IF NOT EXISTS "IN_Product" (
	"IN_id"	INTEGER,
	"SKUId"	INTEGER NOT NULL,
	"Quantity"	INTEGER,
	PRIMARY KEY("IN_id","SKUId"),
	FOREIGN KEY("IN_id") REFERENCES "Internal_Order"("id") ON DELETE CASCADE,
	FOREIGN KEY("SKUId") REFERENCES "SKU"("Id") ON DELETE CASCADE
);

-- SKU_Item
CREATE TABLE IF NOT EXISTS "SKU_Item" (
	"RFID"	TEXT UNIQUE,
	"avaiable"	INTEGER,
	"SKU_Id"	INTEGER,
	"positionID"	TEXT,
	"dateOfStock"	TEXT,
	PRIMARY KEY("RFID"),
	FOREIGN KEY("SKU_Id") REFERENCES "SKU"("Id") ON DELETE CASCADE,
	FOREIGN KEY("positionID") REFERENCES "Position"("positionID") ON DELETE CASCADE ON UPDATE CASCADE
);


-- Test_Result
CREATE TABLE IF NOT EXISTS "Test_Result" (
	"id"	INTEGER,
	"testDescriptorID"	INTEGER,
	"date"	TEXT,
	"result"	BOOLEAN,
	"RFID" TEXT,
	PRIMARY KEY("id"),
	FOREIGN KEY("testDescriptorID") REFERENCES "Test_Descriptor"("id") ON DELETE CASCADE,
	FOREIGN KEY("RFID") REFERENCES "SKU_Item"("RFID") ON DELETE CASCADE
);

-- Item
CREATE TABLE IF NOT EXISTS "Item" (
	"id"	INTEGER,
	"description"	TEXT,
	"price"	REAL,
	"SKU_Id"	INTEGER NOT NULL,
	"supplier_Id"	INTEGER NOT NULL,
	PRIMARY KEY("id"),
	UNIQUE("id", "supplier_Id")
	FOREIGN KEY("supplier_Id") REFERENCES "User"("id") ON DELETE CASCADE,
	FOREIGN KEY("SKU_Id") REFERENCES "SKU"("Id") ON DELETE CASCADE
);

-- Supplier_Item (?????)
CREATE TABLE IF NOT EXISTS "Item_Supplier" (
	"id" INTEGER,
	"ItemID" INTEGER,
	"SupplierID" INTEGER,
	PRIMARY KEY("id"),
	FOREIGN KEY("ItemID") REFERENCES "Item"("id") ON DELETE CASCADE,
	FOREIGN KEY("SupplierID") REFERENCES "User"("id") ON DELETE CASCADE
);

-- RO_Notes
CREATE TABLE IF NOT EXISTS "RO_Notes" (
	"RO_id"	INTEGER NOT NULL,
	"Note"	TEXT,
	"id"	INTEGER,
	PRIMARY KEY("id"),
	FOREIGN KEY("RO_id") REFERENCES "Restock_Order"("id") ON DELETE CASCADE
);

INSERT INTO "User" ("username","name","surname","password","type","id") VALUES ('user1@ezwh.com','Piero','Angela','testpassword','customer',1);
INSERT INTO "User" ("username","name","surname","password","type","id") VALUES ('qualityEmployee1@ezwh.com','Alberto','AAAAH','testpassword','qualityEmployee',2);
INSERT INTO "User" ("username","name","surname","password","type","id") VALUES ('clerk1@ezwh.com','Luca','Abete','testpassword','clerk',3);
INSERT INTO "User" ("username","name","surname","password","type","id") VALUES ('deliveryEmployee1@ezwh.com','Mario','Draghi','testpassword','deliveryEmployee',4);
INSERT INTO "User" ("username","name","surname","password","type","id") VALUES ('supplier1@ezwh.com','Paolo','Fox','testpassword','supplier',5);

COMMIT;
