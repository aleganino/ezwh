# Requirements Document

Date: 22 march 2022

Version: 0.6

| Version number | Change            |
| -------------- | ----------------- |
| 1.0            | Filled everything |

# Contents

- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)

  - [Context Diagram](#context-diagram)
  - [Interfaces](#interfaces)

- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
  - [Functional Requirements](#functional-requirements)
  - [Non functional requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
  - [Use case diagram](#use-case-diagram)
  - [Use cases](#use-cases)
    - [Relevant scenarios](#relevant-scenarios)
- [Glossary](#glossary)
- [System design](#system-design)
- [Deployment diagram](#deployment-diagram)

# Informal description

Medium companies and retailers need a simple application to manage the relationship with suppliers and the inventory of physical items stocked in a physical warehouse.
The warehouse is supervised by a manager, who supervises the availability of items. When a certain item is in short supply, the manager issues an order to a supplier. In general the same item can be purchased by many suppliers. The warehouse keeps a list of possible suppliers per item.

After some time the items ordered to a supplier are received. The items must be quality checked and stored in specific positions in the warehouse. The quality check is performed by specific roles (quality office), who apply specific tests for item (different items are tested differently). Possibly the tests are not made at all, or made randomly on some of the items received. If an item does not pass a quality test it may be rejected and sent back to the supplier.

Storage of items in the warehouse must take into account the availability of physical space in the warehouse. Further the position of items must be traced to guide later recollection of them.

The warehouse is part of a company. Other organizational units (OU) of the company may ask for items in the warehouse. This is implemented via internal orders, received by the warehouse. Upon reception of an internal order the warehouse must collect the requested item(s), prepare them and deliver them to a pick up area. When the item is collected by the other OU the internal order is completed.

EZWH (EaSy WareHouse) is a software application to support the management of a warehouse.

# Stakeholders

| Stakeholder name        | Description                                                  |
| ----------------------- | ------------------------------------------------------------ |
| Manager                 | Supervises WH and availability of items                      |
| Suppliers               | Entities to place a restock order for an item                |
| Retailers               | Those who own the WH and use EZWH                            |
| Delivery company        | External company to which the incoming orders are entrusted  |
| Quality office          | Company's department that deals with incoming orders quality |
| Other OU of the company | Company's department that places internal orders             |
| Item                    | Physical item stocked in the WH                              |
| Inventory               | Current state of the items stocked in the WH                 |
| Competitors             | Other EZWH applications                                      |

# Context Diagram and interfaces

## Context Diagram

![Context Diagram](./UMLjpg/ContextDiagram.jpg)

## Interfaces

| Actor     | Logical Interface | Physical Interface |
| --------- | ----------------- | ------------------ |
| User      | GUI               | Company's computer |
| Suppliers | API               | Supplier's server  |
| Item      | Barcode           | Barcode scanner    |

# Stories and personas

Persona1, Manager:

- Middle aged man
- Intermediate computer skill
- Responsible of managing items in the WH
- Story:
  - He's tired of dealing with emails and manually have to place orders. He also doesn't want to use Excel anymore, instead he wants a dashboard like interface for handling orders and checking items' quantities.

Persona2, Production department employee:

- 30 years old
- Good computer skills
- Works in the company's production department
- Story:
  - It's afternoon. John needs some parts for quickly terminate a job. With the current solution he sends 1000 emails to the Warehouse department in hope for some replies.
    He needs a way to place orders in a more efficient way.

Persona3, Finance department employee:

- 52 years old
- Basic computer skills
- Works in the company's commercial office
- Story:
  - Karen needs paperclips ASAP. As paperclips being a low priority item, and because of the current way for placing orders, she would have to wait even for one full day.
    She wants a quicker way for restocking paperclips.

Persona4, Quality office employee:

- 26 year old
- Works in the company's quality office
- Story:
  - Giulia is sad because everyone always ignore her reports. She wants a tool that shows statistics on the supplier based on its average order quality so that her work could be useful to the company.

Persona 5, Warehouse Employee:

- Young woman
- Works in the warehouse
- Basic Knowledge of computer
- Responsible for counting and reporting items
- Story:
  - Elizabeth is frustrated of counting items stock and finding the location of items. she needs an application to save her time and efforts.

# Functional and non functional requirements

## Functional Requirements

| ID      | Description                                   |
| ------- | --------------------------------------------- |
| FR1     | Account management                            |
| - FR1.1 | Log in                                        |
| - FR1.2 | Log out                                       |
| - FR1.3 | Define account (different access level)       |
| - FR1.4 | Delete account                                |
| FR2     | Item management                               |
| - FR2.1 | List items                                    |
| - FR2.2 | Check item quantity                           |
| - FR2.3 | Set quantity threshold for notification       |
| - FR2.4 | Show item location                            |
| - FR2.5 | List low-quantity items                       |
| - FR2.6 | Add new item                                  |
| - FR2.7 | Set item unavaiable                           |
| - FR2.8 | Set item quantity                             |
| - FR2.9 | Set item location                             |
| FR3     | Handle external orders                        |
| - FR3.1 | Place order                                   |
| - FR3.2 | List past/pending orders                      |
| - FR3.3 | Cancel order                                  |
| - FR3.4 | Set quality rating (optional for past orders) |
| FR4     | Handle internal orders                        |
| - FR4.1 | Place order                                   |
| - FR4.2 | List past/pending orders                      |
| - FR4.3 | Cancel order                                  |
| FR5     | Manage suppliers                              |
| - FR5.1 | List supplier                                 |
| - FR5.2 | Add supplier                                  |
| - FR5.3 | Delete supplier                               |
| - FR5.4 | Update supplier items                         |
| FR6     | Quality reports                               |
| - FR6.1 | Retrieve a report                             |
| - FR6.2 | Upload a report                               |
| - FR6.3 | Modify a report                               |

## Non Functional Requirements

| ID   | Type (efficiency, reliability, ..) | Description                                | Refers to                     |
| ---- | ---------------------------------- | ------------------------------------------ | ----------------------------- |
| NFR1 | Portability                        | The system must run on windows 7 machines  |                               |
| NFR2 | Efficiency                         | Program should use < 100 mb ram            |                               |
| NFR3 | Efficiency                         | Display lists should take < 0.1 s          | FR2.1 FR3.2 FR2.5 FR4.2 FR5.1 |
| NFR4 | Ease of use                        | Employee able to use app after 1H training |                               |

# Use case diagram and use cases

## Use case diagram

![Use Case Diagram](./UMLjpg/UCD.jpg)

## Use Case 1: CRUD User

| Actors Involved  | Manager                                                  |
| ---------------- | -------------------------------------------------------- |
| Precondition     | Manager has an account and is logged in                  |
| Post condition   | A new account is created/An existing account is modified |
| Nominal Scenario | Scenario 1.1                                             |
| Variants         | Scenario 1.2, Scenario 1.3                               |
| Exceptions       | Scenario 1.4                                             |

| Scenario 1.1   | Create an account                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| Precondition   | Employee account not existing                                                                                   |
| Post condition | Employee accoun created                                                                                         |
| Step#          | Description                                                                                                     |
| - 1            | Log into EZWH                                                                                                   |
| - 2            | Navigate to the manage users tab                                                                                |
| - 3            | Click the "Create new user" button                                                                              |
| - 4            | Fill the form with the required data (username, password, department)                                           |
| - 5            | Assign it a role by choosing from the dropdown list (Department employee, quality office employee, wh employee) |
| - 6            | Click the "save" button at the bottom of the page                                                               |

| Scenario 1.2   | Edit an existing account                                                                                        |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| Precondition   | Employee account already exists                                                                                 |
| Post condition | Employee accoun modified                                                                                        |
| Step#          | Description                                                                                                     |
| - 1            | Log into EZWH                                                                                                   |
| - 2            | Navigate to the manage users tab                                                                                |
| - 3            | Click the "Edit user" button                                                                                    |
| - 4            | Select an user from the dropdown list                                                                           |
| - 5            | Fill the form with the required data (password, department)                                                     |
| - 6            | Assign it a role by choosing from the dropdown list (Department employee, quality office employee, wh employee) |
| - 7            | Click the "save" button at the bottom of the page                                                               |

| Scenario 1.3   | Delete an existing account                               |
| -------------- | -------------------------------------------------------- |
| Precondition   | Employee account already exists                          |
| Post condition | Employee accoun deleted                                  |
| Step#          | Description                                              |
| - 1            | Log into EZWH                                            |
| - 2            | Navigate to the manage users tab                         |
| - 3            | Click the "Edit user" button                             |
| - 4            | Select an user from the dropdown list                    |
| - 5            | Click the "delete user" button at the bottom of the page |

| Scenario 1.4   | Creating an account with an already taken username                                                 |
| -------------- | -------------------------------------------------------------------------------------------------- |
| Precondition   | Employee account already exists                                                                    |
| Post condition | Error                                                                                              |
| Step#          | Description                                                                                        |
| - 1            | Log into EZWH                                                                                      |
| - 2            | Navigate to the manage users tab                                                                   |
| - 3            | Click the "Create new user" button                                                                 |
| - 4            | Fill the form with the required data (username, password, department)                              |
| - 5            | Assign it a role by choosing from the dropdown list (Department employee, quality office employee) |
| - 6            | Click the "save" button at the bottom of the page                                                  |
| - 7            | An error message is displayed on the screen with text: "ATTENTION: USER ALREADY EXISTS"            |

## Use Case 2: Append quality check to an order

| Actors Involved  | Quality office employee                                 |
| ---------------- | ------------------------------------------------------- |
| Precondition     | Quality office employee has an account and is logged in |
| Post condition   | A report is appended to an order                        |
| Nominal Scenario | Scenario 2.1                                            |
| Variants         | Scenario 2.2                                            |

| Scenario 2.1   | Append a report to an order                             |
| -------------- | ------------------------------------------------------- |
| Precondition   | Report for a specific order not exists                  |
| Post condition | Report for a specific order added                       |
| Step#          | Description                                             |
| - 1            | Log into EZWH                                           |
| - 2            | In the main page click the "Add a report" button        |
| - 3            | Select the order by choosing it from the dropdown list  |
| - 4            | Updload the report by clicking the button "upload file" |
| - 5            | Click the "save" button at the bottom of the page       |

| Scenario 2.2   | Edit the report of an order                                 |
| -------------- | ----------------------------------------------------------- |
| Precondition   | Report for a specific exists                                |
| Post condition | Report for a specific order modified                        |
| Step#          | Description                                                 |
| - 1            | Log into EZWH                                               |
| - 2            | In the main page click the "Add a report" button            |
| - 3            | Select the order by choosing it from the dropdown list      |
| - 4            | Updload the new report by clicking the button "upload file" |
| - 5            | Click the "save" button at the bottom of the page           |

## Use Case 3: CRUD item

| Actors Involved  | Manager                                               |
| ---------------- | ----------------------------------------------------- |
| Precondition     | The user is authenticated and their role is "manager" |
| Post condition   | An item is added/modified/deleted                     |
| Nominal Scenario | Scenario 3.1                                          |
| Variants         | Scenario 3.2                                          |
| Exceptions       | Scenario 3.5                                          |

| Scenario 3.1   | Create an item                                                                            |
| -------------- | ----------------------------------------------------------------------------------------- |
| Precondition   | The item does not exists                                                                  |
| Post condition | The item is added to the catalog/inventory                                                |
| Step#          | Description                                                                               |
| - 1            | The manager looks for an item and doesn't find it                                         |
| - 2            | The manager clicks on the "Add item" button in the application                            |
| - 3            | The manager fills a form with the item data (name, ID, supplier(s), category, price, ...) |
| - 4            | The application verifies validity of item data                                            |
| - 5            | The item is inserted in the catalog                                                       |
| - 6            | The application notifies the correct insertion                                            |

| Scenario 3.2   | Delete an item                                                    |
| -------------- | ----------------------------------------------------------------- |
| Precondition   | The item is present in the catalog                                |
| Post condition | The item is deleted from the catalog/inventory                    |
| Step#          | Description                                                       |
| - 1            | The manager looks for an item and finds it                        |
| - 2            | The manager clicks on the "Delete item" button in the application |
| - 3            | The application ask confirmation                                  |
| - 4            | The manager confirms deletion                                     |
| - 5            | The item is deleted from the catalog                              |
| - 6            | The item spaces in the inventory are freed                        |
| - 7            | The application notifies the correct deletion                     |

| Scenario 3.3   | Modify an item                                 |
| -------------- | ---------------------------------------------- |
| Precondition   | The item is present in the catalog             |
| Post condition | The item's data are updated                    |
| Step#          | Description                                    |
| - 1            | The manager looks for an item and finds it     |
| - 2            | The manager fills a form to update item data   |
| - 3            | The application ask confirmation               |
| - 4            | The application verifies validity of item data |
| - 5            | The item is updated                            |
| - 6            | The application notifies the correct update    |

| Scenario 3.4   | Move an item                                         |
| -------------- | ---------------------------------------------------- |
| Precondition   | The item is present in the catalog                   |
| Post condition | The item is moved                                    |
| Step#          | Description                                          |
| - 1            | The user selects a free space in the warehouse       |
| - 2            | The user selects the item to be stored and quantity  |
| - 3            | The application ask confirmation                     |
| - 4            | The application fill the space and notifies movement |

| Scenario 3.5   |                                                                                 |
| -------------- | ------------------------------------------------------------------------------- |
| Precondition   | The item is present in the catalog but in use in processes                      |
| Post condition | Revert to previous state                                                        |
| Step#          | Description                                                                     |
| - 1            | The manager executes steps 1 and 2 of the nominal scenario                      |
| - 2            | The application signals that the item is used in other processes and lists them |
| - 3            | The application asks if the manager wants to proceed anyway                     |
| - 4            | The manager refuses to proceed                                                  |
| - 5            | The application notifies deletion has been refused                              |

### Use Case 4: Check item stats

| Actors Involved  | Manager                                                          |
| ---------------- | ---------------------------------------------------------------- |
| Precondition     | The user is authenticated and the item is present in the catalog |
| Post condition   | The item stats are shown                                         |
| Nominal Scenario | Scenario 4.1                                                     |

| Scenario 3.5   |                                                            |
| -------------- | ---------------------------------------------------------- |
| Precondition   | the item is present in the catalog but in use in processes |
| Post condition | Revert to previous state                                   |
| Step#          | Description                                                |
| - 1            | The user selcts the item                                   |
| - 2            | The user clicks on "Show more data"                        |
| - 3            | Item stats are shown                                       |

## Use Case 5: Manage suppliers

| Actors Involved  | Manager                                                      |
| ---------------- | ------------------------------------------------------------ |
| Precondition     | List of current suppliers is up to date                      |
| Post condition   | The change in the list of suppliers is valid                 |
| Nominal Scenario | Scenario 5.1                                                 |
| Variants         | Scenario 5.2                                                 |
| Exceptions       | Device loses the internet connection during the modification |

| Scenario 5.1   | Add a new supplier                                            |
| -------------- | ------------------------------------------------------------- |
| Precondition   | Data fields for a new supplier entry are all valid            |
| Post condition | New supplier succesfully added to the list for a set of items |
| Step#          | Description                                                   |
| - 1            | Manager inserts data about supplier                           |
| - 2            | Program validates that the set of offered items exists        |
| - 3            | Operation completed notification                              |

| Scenario 5.2   | Remove an existing supplier                                         |
| -------------- | ------------------------------------------------------------------- |
| Precondition   | Supplier to be removed actually exists                              |
| Post condition | Operation end without errors                                        |
| Step#          | Description                                                         |
| - 1            | Manager inserts the code of a supplier                              |
| - 2            | If the supplier is in the list, it gets removed, or raises an error |
| - 3            | Operation completed notification                                    |

## Use Case 6: Manage supplier item list

| Actors Involved  | Manager                                                        |
| ---------------- | -------------------------------------------------------------- |
| Precondition     | Item code, supplier code are valid                             |
| Post condition   | The change in the list of items offered by a supplier is valid |
| Nominal Scenario | Scenario 6.1                                                   |
| Variants         | Scenario 6.2                                                   |
| Exceptions       | Device loses the internet connection during the modification   |

| Scenario 6.1   | Attach a new item to a supplier                        |
| -------------- | ------------------------------------------------------ |
| Precondition   | Item code, supplier code are valid                     |
| Post condition | New item succesfully added to the supplier's offer     |
| Step#          | Description                                            |
| - 1            | Manager inserts the code about supplier and the item   |
| - 2            | Program validates that the item and the supplier exist |
| - 3            | Operation completed notification                       |

| Scenario 6.2   | Remove an item from the supplier's offer                        |
| -------------- | --------------------------------------------------------------- |
| Precondition   | Item code, supplier code are valid                              |
| Post condition | Operation end without errors                                    |
| Step#          | Description                                                     |
| - 1            | Manager inserts the code of a supplier and of an item           |
| - 2            | If the given supplier has the item in its list, it gets removed |
| - 3            | Operation completed notification                                |

## Use Case 7: Place an internal order

| Actors Involved  | Other OU of the company                                  |
| ---------------- | -------------------------------------------------------- |
| Precondition     | The other OU of the company has an account in the system |
| Post condition   | Adding a invoice order of requested item(s) is valid     |
| Nominal Scenario | Scenario 7.1                                             |
| Variants         | Select and insert the list of required items             |
| Exceptions       | insert an invalid item(s)                                |

| Scenario 7.1   | Add a new order                                 |
| -------------- | ----------------------------------------------- |
| Precondition   | inserted data of the item(s) is valid>          |
| Post condition | New order is sumbitted successfully>            |
| Step#          | Description                                     |
| - 1            | The OU provides a list of items they need.      |
| - 2            | The application checks the validity of products |
| - 3            | The application issue an invoice order          |

## Use Case 8: Place an external order

| Actors Involved  | Manager                                     |
| ---------------- | ------------------------------------------- |
| Precondition     | updated list of quantities for each product |
| Post condition   | submitted the quantity of products needed   |
| Nominal Scenario | Scenario 8.1                                |
| Exceptions       | insert an invalid item(s)                   |

| Scenario 8.1   | Add a new order                                 |
| -------------- | ----------------------------------------------- |
| Precondition   | inserted data of the item(s) is valid           |
| Post condition | New order is sumbitted successfully             |
| Step#          | Description                                     |
| - 1            | The Manager provides a list of items he needs   |
| - 2            | The application checks the validity of products |
| - 3            | The application issue an invoice order          |

## Use Case 9: Check internal order

| Actors Involved  | WH Employee                                                  |
| ---------------- | ------------------------------------------------------------ |
| Precondition     | order # not completed                                        |
| Post condition   | order # completed                                            |
| Nominal Scenario | Scenario 9.1                                                 |

| Scenario 9.1   | Complete an order                                               |
| -------------- | --------------------------------------------------------------- |
| Precondition   | order # exists and its not completed yet                        |
| Post condition | order # is completed and quantities ara automatically decreased |
| Step#          | Description                                                     |
| - 1            | The Employee clicks on the desired order                        |
| - 2            | The application returns a list of item                          |
| - 3            | The employee checks the position for every item in the order    |
| - 4            | The employee clicks the "completed" button                      |

# Glossary

![Glossary](./UMLjpg/Glossary.jpg)

# System Design

![System design Diagram](./UMLjpg/Design.jpg)

# Deployment Diagram

![Deployment Diagram](./UMLjpg/Deployment.jpg)
