# SmartFarm Queue

Build a Complete SIH 2026 Web Application: KISANQUEUE

Create a modern, responsive, production-ready web application called KISANQUEUE – Smart Farmer Procurement & Appointment Management System.

The purpose of this platform is to reduce the long waiting time faced by farmers at government agricultural procurement centres by introducing online farmer registration, product/quantity submission, procurement scheduling, appointment slots, digital queue management, and rescheduling.

The application must have three main roles:

FARMER

PROCUREMENT OFFICER

ADMIN

1. FARMER MODULE

Create a simple and farmer-friendly interface because many farmers may not be highly familiar with technology.

Farmer Registration

Create a registration page with:

Farmer Name

Mobile Number

Email (optional)

Password

Aadhaar/ID reference number (do not display the full ID after registration)

District

Taluk

Village

Survey Number

Land Area

Preferred Language

Address

Add OTP/mobile verification UI.

After registration, redirect the farmer to the Farmer Dashboard.

2. FARMER DASHBOARD

Create a clean dashboard showing:

Farmer Profile

Display:

Farmer Name

Village

Taluk

District

Survey Number

Land Area

Registered Mobile Number

Allow farmer to edit profile information.

3. FARMER PRODUCT REGISTRATION

Create a section called:

"My Procurement Products"

The farmer should be able to add agricultural products/crops.

Form fields:

Crop/Product Name

Crop Category

Variety

Expected Quantity

Quantity Unit (Kg / Quintal / Ton)

Harvest Date

Expected Procurement Date

Quality/Grade

Storage Location

Supporting Document Upload

Product Image (optional)

Examples:

Paddy

Wheat

Maize

Groundnut

Cotton

Sugarcane

Vegetables

Pulses

Other

Display registered products as cards/table.

Each product should show:

Product name

Quantity

Harvest date

Status

Procurement centre

Appointment date

Appointment time

Current queue position

4. PROCUREMENT REQUEST

For every registered product, provide:

"Request Procurement Slot"

The farmer selects:

Procurement Centre

Product

Quantity

Preferred date

After submitting, status should become:

Pending Officer Review

The procurement officer can review the request.

5. FARMER APPOINTMENT SYSTEM

Once an officer approves the request, display:

Procurement Appointment

Appointment ID

Farmer Name

Product

Quantity

Procurement Centre

Date

Time Slot

Token Number

Estimated Waiting Time

Appointment Status

Statuses:

Pending

Approved

Scheduled

Confirmed

Reschedule Requested

Rescheduled

Completed

Cancelled

Generate a unique digital token number.

Example:

Token: PROC-2026-00125

6. RESCHEDULE FEATURE

If the farmer cannot attend the assigned date, provide:

"Unable to Attend? Request New Date"

The farmer must select:

Reason for Rescheduling

Options:

Medical Emergency

Family Emergency

Vehicle/Transportation Problem

Weather Condition

Harvest Delay

Agricultural Work

Personal Reason

Other

Allow the farmer to enter additional explanation.

Allow optional supporting document/image upload.

Example:

"I cannot attend the procurement appointment because of heavy rain and transportation issues."

After submission:

Status = Reschedule Requested

Show:

Waiting for Officer Approval

7. OFFICER RESCHEDULE MANAGEMENT

The procurement officer can see all reschedule requests.

Display:

Farmer Name

Survey Number

Product

Quantity

Original Appointment Date

Reason

Uploaded Proof

Requested New Date

Officer Remarks

Buttons:

APPROVE

REJECT

ASSIGN NEW DATE

When approved, officer can select:

New Date

New Time Slot

New Token Number

Automatically notify the farmer.

8. PROCUREMENT OFFICER DASHBOARD

Create a professional government-office dashboard.

Dashboard statistics:

Total Registered Farmers

Today's Appointments

Pending Requests

Completed Procurements

Reschedule Requests

Total Quantity Expected

Total Quantity Procured

Farmers Currently Waiting

Available Procurement Capacity

Use charts and graphs.

9. DAILY PROCUREMENT QUEUE

Create a real-time queue management page.

Display today's farmers:

TokenFarmerProductQuantityTimeStatus

Statuses:

Waiting

Called

Under Verification

Weighing

Quality Check

Procurement Processing

Completed

Officer should be able to update the status.

Example workflow:

WAITING
↓
DOCUMENT VERIFICATION
↓
QUALITY CHECK
↓
WEIGHING
↓
PROCUREMENT
↓
COMPLETED

10. SMART SLOT ALLOCATION

The system should help officers assign procurement slots based on:

Available daily capacity

Quantity of crop

Procurement centre capacity

Number of farmers

Farmer preferred date

Product type

Existing appointments

Do not allow overbooking.

Example:

Procurement Centre Capacity:

500 Quintals/day

Already Scheduled:

420 Quintals

Remaining Capacity:

80 Quintals

If a farmer requests 100 Quintals, show:

"Insufficient capacity for selected date. Suggested next available date: 15 September 2026."

11. PROCUREMENT CENTRE MANAGEMENT

Admin and officers can manage procurement centres.

Fields:

Centre Name

Centre ID

District

Taluk

Village

Address

Contact Number

Working Days

Opening Time

Closing Time

Daily Procurement Capacity

Current Available Capacity

Supported Crops

Officer Name

Show procurement centres on a map.

12. ADMIN DASHBOARD

Create a centralized government-level dashboard.

Show:

Total Farmers

Total Procurement Centres

Total Procurement Requests

Today's Appointments

Completed Procurements

Pending Requests

Reschedule Requests

Total Quantity Procured

Centre-wise Procurement

District-wise Procurement

Crop-wise Procurement

Create charts for:

Crop-wise Procurement

District-wise Procurement

Monthly Procurement

Centre-wise Farmer Count

Average Waiting Time

Rescheduling Statistics

13. WAITING TIME REDUCTION

One of the main objectives of the system is to reduce farmer waiting time.

Create a dashboard card:

Average Waiting Time

Before Digital System:
"4–6 Hours"

After KISANQUEUE:
"30–60 Minutes"

Use sample/demo data and clearly label it as simulated data.

Calculate:

Average waiting time

Daily queue length

Average processing time

Number of farmers served per day.

14. NOTIFICATION SYSTEM

Create notification functionality.

Farmers should receive notifications for:

Registration successful

Procurement request received

Procurement request approved

Appointment scheduled

Appointment reminder

Appointment changed

Reschedule request received

Reschedule approved

Reschedule rejected

Procurement completed

Create an in-app notification panel.

Use placeholder services for SMS/WhatsApp integration so that APIs can be connected later.

15. FARMER APPOINTMENT REMINDER

Show reminder:

"Your procurement appointment is tomorrow."

Display:

Date

Time

Centre

Token Number

Product

Quantity

Add a QR code for appointment verification.

16. OFFICER VERIFICATION

When farmer arrives at procurement centre, officer can scan the QR code or enter the Token Number.

Display:

Farmer Profile

Survey Number

Product

Expected Quantity

Appointment

Verification Status

Officer can mark:

Farmer Arrived

Then the farmer enters the digital queue.

17. PROCUREMENT COMPLETION

After procurement is completed, officer enters:

Actual Quantity Procured

Quality Grade

Weighing Result

Procurement Date

Officer Remarks

Status becomes:

PROCUREMENT COMPLETED

Farmer dashboard should show procurement history.

18. PROCUREMENT HISTORY

Create a page:

My Procurement History

Display:

Product

Requested Quantity

Actual Quantity

Procurement Centre

Date

Quality

Status

Token Number

Allow farmer to download/print a digital procurement receipt.

19. MULTI-LANGUAGE SUPPORT

Since this system is designed for farmers, support:

English

Tamil

Hindi

Add a language switcher in the top navigation.

The default demo language can be English.

Use simple terminology and large readable buttons.

20. UI/UX DESIGN

Design should look like a professional Government Digital Service platform.

Theme:

White

Dark Green

Light Green

Soft Blue

Minimal gradients

Avoid excessive animations.

Use:

Large buttons

Clear icons

Simple forms

Card-based dashboard

Responsive tables

Mobile-first design

High readability

Accessible contrast

The Farmer Dashboard should be extremely simple.

The Officer Dashboard can contain more advanced analytics.

21. LANDING PAGE

Create an attractive landing page.

Hero section:

KISANQUEUE

Smart Farmer Procurement & Appointment Management System

Subtitle:

"Register once. Get your procurement slot. Avoid long waiting queues."

Buttons:

REGISTER AS FARMER

OFFICER LOGIN

ADMIN LOGIN

Add a visual illustration of:

Farmer → Online Registration → Procurement Slot → Digital Queue → Procurement

22. LANDING PAGE SECTIONS

Add:

Problem

Farmers spend long hours waiting at procurement centres.

Solution

Digital registration + appointment scheduling + queue management.

How It Works

Farmer Registers

Adds Crop & Quantity

Officer Reviews

Procurement Slot Assigned

Farmer Receives Token

Farmer Visits Centre

Digital Verification

Procurement Completed

Benefits

Reduced waiting time

Better queue management

Transparent scheduling

Reduced overcrowding

Better procurement planning

Digital records

Easy rescheduling

Real-time monitoring

23. DATABASE DESIGN

Create a proper relational database.

Tables:

users

farmers

officers

admins

procurement_centres

farmer_products

procurement_requests

appointments

queue_tokens

reschedule_requests

procurement_records

notifications

audit_logs

documents

Create proper relationships between tables.

24. AUTHENTICATION & SECURITY

Implement:

Role-based authentication

Farmer login

Officer login

Admin login

Secure password hashing

Session/JWT authentication

Role-based route protection

Input validation

File upload validation

Audit logging

Sensitive identity information must not be unnecessarily exposed.

25. TECHNOLOGY STACK

Use a modern full-stack architecture.

Frontend:

React.js

Tailwind CSS

Responsive design

Charts:

Recharts or Chart.js

Backend:

Node.js

Express.js

Database:

MySQL or PostgreSQL

Authentication:

JWT

File storage:

Cloudinary or equivalent placeholder

Maps:

OpenStreetMap / Leaflet

QR:

QR code generation library

26. DEMO DATA

Create realistic demo data for:

20 farmers

5 procurement centres

Multiple crops

Multiple appointments

Queue tokens

Reschedule requests

Procurement records

Use Indian/Tamil Nadu-style sample villages and agricultural data.

Do not use real personal information.

27. IMPORTANT FEATURE: SMART PROCUREMENT CAPACITY

The officer dashboard should clearly show:

Daily Capacity

Booked Capacity

Remaining Capacity

Example:

Daily Capacity: 500 Quintals

Booked: 350 Quintals

Remaining: 150 Quintals

Use progress indicators.

If capacity is exceeded, prevent appointment confirmation.

28. IMPORTANT FEATURE: QUEUE PREDICTION

Add a demo feature called:

Estimated Waiting Time

Based on:

Number of farmers ahead

Average processing time

Number of active counters

Farmer's token number

Example:

Token: 25

Farmers Ahead: 8

Estimated Waiting Time: 42 minutes

Clearly mention that this is an estimated/demo calculation.

29. ADMIN REPORTS

Allow admin to generate:

Daily Procurement Report

Farmer Registration Report

Crop-wise Report

Centre-wise Report

District-wise Report

Waiting Time Report

Reschedule Report

Provide:

Export CSV

and

Download PDF

buttons.

30. FINAL REQUIREMENT

The final application must be fully responsive and should work properly on:

Mobile

Tablet

Laptop

Desktop

Create realistic navigation and functional interactions.

Do not make it just a static UI.

Implement working frontend state, forms, dashboards, tables, filters, appointment scheduling, rescheduling workflow, queue management, and role-based views.

Use mock API/database data if a real backend cannot be fully connected, but structure the project so that a real backend can easily be connected.

The final output should look like a professional SIH 2026 prototype, suitable for demonstrating to judges, government officials, and procurement-centre administrators.

Focus strongly on the core problem:

REDUCING FARMER WAITING TIME AT GOVERNMENT PROCUREMENT CENTRES THROUGH DIGITAL REGISTRATION, APPOINTMENT SCHEDULING AND SMART QUEUE MANAGEMENT.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://kisan-slot-flow.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/67c9492f-e5b5-456a-86b1-b60f09f2a63f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
