(Refer to Project-Report.pdf for more info)
- [Project-Report.pdf](https://github.com/aygupta9800/Cloud-Event-Center-public/blob/master/Project-Report.pdf)

# CloudEventCenter
In this term project, we build an online service called Cloud Event Center (CEC) to organize online or in-person events. Any person or organization can post events in CEC, and those who are interested can sign up. We also provide capabilities for potential participants to ask questions prior to the events, and share moments with messages and pictures during and after the events. A reputation system will be implemented to rate participants and organizers based on the feedback for each other. 

The service needs to be hosted in the cloud, and you also need to provide a client app, in the form of a web app. We use React, javascript for frontend and Spring Boot, Java for backend. We exercise the principles, patterns, and methodologies DI, AOP, MVC, ORM, and transactions in backend. We use a relational database, Amazon RDS. 

While we try to provide most of the key features that are considered essential for such a system, we also simplify or ignore a good portion of noncritical requirements such that the amount and complexity of work fit the purposes of our term project and the limited time we can work on it. 

## App Url:  

## Instructions to run the application

1. Download the submitted zipped project folder.
2. Unzip it to a root folder. ( After unzipping it should contain a frontend folder, backend folder) 
3. Add Firebase, database etc credentials in the app in the respective files.
4. Open the terminal at frontend folder.
5. On the terminal, run "npm install" to install project libraries dependecies. Wait until the installation of the libraries complete.
6. Once the installation completes, run "npm start"
7. Open the backend folder in IDE like eclipse. Run the TermProjectApplication.java file (in src/main/java/com.cmpe275.termproject) as spring boot app.
8. Open browser and go to http://xyz:3000/
9. This will open up the application

### Project
### Entities and Relationships
The users of the service can be a person or an organization. Persons and organizations can act as event organizers, and only persons participate in events. An event can have one or more participants. For each event, there is the sign-up forum where anyone can ask questions, and the participant forum where only the participants and organizer can read and post messages.

Each user can potentially have two reputation scores, one as participant and the other as organizer. For simplicity, CEC does not have admins, and we do not provide the capability to handle grievances on issues like inaccurate feedback, fraud, or gaming on reputation.

### Project specification 
#### User Registration and Authentication 
User registration info. A user, either a person or organization, needs to provide the following info upon registration. 
Email: a valid email address. Must be unique and cannot be changed. Beside identification within the service, it is used for verification, notification, and communication purposes too. 
Account Type: Person or Organization. 
Full Name: Required for all users. For simplicity, we can use one string to capture first, middle, and last names. 
Screen Name: also string type, and must be unique among all screen names. An org’s screen name must equal to its full name, or start with the full name with an optional suffix to achieve uniqueness.  
Gender: optional, and applies to persons only.
Description: optional text to describe the user.
Address: Street and number (optional), City, State, Zip Code. We are assuming US addresses only. You can provide default values for the latter three to simplify the registration process. 
#### User Roles 
There are two roles, organizers and participants. Only persons can participate in events.
As an organizer, they have the privilege and responsibilities to conduct organizational duties for the events, including creating events, accept/reject sign-ups, and close the participant forums.
You must support Oauth/OpenID for user sign-up and authentication; specifically, you need to support signing in with Google (and/or Facebook). In addition, you must also support the option of letting the user set up a “local” password in CEC with their email as the user name.  (Note: it is harder to get Oauth fully working with Facebook, but it is up to you.)
Account verification
No matter which registration option is used, local account with own password, or signing in with Facebook or Google, CEC must send an email to the user with a verification code or link.
The user needs to use that verification code or link to verify his account registration. 
Until the account is verified, a user cannot use any feature in CEC. 
It is OK to use libraries like Firebase Authentication to assist user auth. 
#### Event Creation and Cancellation 
Any user can create a new event. An event has the following attributes
Title: brief text to name the event.
Descrition: text to describe the event.
StartTime: date and time for the event to start. Must be in the future. 
EndTime: Must be after the start time.
Deadline: date and time that participants must sign up before. A deadline must be no later than the start time. This is also the time the sign-up forum closes for new postings and entering read-only mode.
Address: Street and number (optional), City, State, Zip Code. We are assuming US addresses only. You can provide default values for the latter three to simplify the registration process.
MinParticipants: (inclusive) the minimum number of participants that must sign up before the deadline, or the event will be canceled.  
MaxParticipants: (inclusive) capacity of the event; if reached, no  new sign-ups are accepted.
Fee: amount in USD. An event can either be free or paid - only an event created by an organization can require a fee.  
AdmissionPolicy: first-come-first-served, or approval-required. For the former, the approval is automatic - registrations are confirmed right away. For the latter, registrations are not confirmed until approved by the organizer.  
Once an event is created, it becomes available for browsing and searching.
An organizer cannot directly cancel an event, but an event gets automatically canceled if the number of successfully registered participants (those who have been automatically or manually approved by the organizer) has not reached the minimum number of participants by the sign-up deadline. 
#### Find and Sign Up for Events 
Once a user signs in, they can browse for events.
Filters are supported for a user to slice and dice events.
At least the following filters need to be provided 
Location. This should default to the city the user lives in, and the user can change to other cities. When explicitly left empty, it matches any location.
Status: the following three statuses are allowed
Active: An event that has not been canceled and has not finished is considered active.
OpenForRegistration (including those who have reached the maximum number of sign-ups, all though such events must be rendered with a clear flag to indicate the registration is full), 
or All (including canceled and past events). 
Defaults to Active if not given.
StartTime & EndTime: (EndTime is optional, defaulting to infinite future) Only events that occur within the given time window will be shown in the filtered results. The StartTime should default to the current time, if not given. 
Keyword: you should have a search text box to take queries from the user for keyword search. This search needs to partially match (be a substring of) against at least the title and description fields. Case needs to be ignored for matching. You do not have to support stemming. When not given, it is ignored, hence matches everything.
Organizer: this is used to partially match against (be a substring of) the screen name of organizers, also in a case insensitive way. When not given, it matches every organizer.
Each filter is required to take at least one value (if you support more than one, their relationship becomes OR)
All filters are conjoined together; i.e., the results have to match all filters as specified above.
When showing the filtering results, you need to show at least the title, time, location, organizer, and current status (e.g., open for sign-up, sign-up closed, ongoing, finished, and canceled) of each matching event.
The user must be able to select an event to view its details, including description, fee, min/max sign-ups, current number of sign-ups, etc. If the event is accepting sign-up (i.e., the sign-up deadline has not passed) and the maximum number of participants has not been reached, a person user must be able to send a request to sign up too.
In the case the event involves a fee, the prompt should be given to the user to confirm the willingness to pay. If the event is auto approved, the payment (any form of emulation is fine) needs to be done upon signing up, otherwise the actual payment will be charged (again, just some form of emulation) upon approval by the organizer. 
If the deadline has passed and there has not been at least the minimum required number of participants, the event is canceled automatically, with notification sent to all participants who have signed up. 
#### Event Forums 
Sign-up forum is open to every user once the event has been created.
 Everyone can post questions and answer questions.
 Messages from the organizer should be clearly marked in the UI so that it is obvious that the sender is the organizer.  
Messages should allow a mix of text and pictures.
The sign-up forum becomes closed for posting of new messages once the event registration deadline passes, or the event has been canceled.
Once a user selects an event, the sign-up forum should be easy to locate; e.g., you can render it as a tab parallel to the event details, or below the event details.
The participant forum is created once an event passes the registration deadline. 
Only participants and the organizer can view and post in the participant forum. 
It is open for posting until 72 hours after the end of the event, or anytime the organizer manually closes the participant forum after the event finishes.
A closed participant forum is still readable to the participants and organizer.
The rendering allowed for participant forums should be similar to the sign-up forums. Mixing of text and images is allowed for participant forums too.
If a forum is closed, its status should be clearly indicated in the rendering, and there should be a brief text description for the reason that the forum has been closed, e.g., canceled because of not having enough participants, or the event has finished, or the organizer has closed this participant forum.  
#### Mimic time elapsing 
CEC must always show the virtual time, which defaults to the real current time, but can be changed to a future time within 12 months of the current time. For simplicity, you are only required to support changing the virtual date part of the time to a future date, and the time of day can remain the same as the current time of day. If, however, you choose to support changing the time of day as well, that is fine too. 
This is to assist the testing of things such as sign-up deadline passing and event finishes. 
#### Review and Reputation 
Every approved participant can provide a review for the organizer.
Every organizer can provide a review for any approved participant.
The review can take place between the event’s start time and one week after its end time.
Each review contains an integer star rating 1-5, inclusive, and a textual feedback.
Any user’s participant (or organizer) reputation is the average of the rating scores they get as a participant (or organizer). If no ratings are received, the according reputation score does not exist (or you can represent it as 0). Please note a user’s participant and organizer reputations are not related, and it is totally possible one is very low and the other is very high.
Organizers must be able to see the reputation score and reviews of all users who have requested to participate. As such, an organizer can reject a sign-up request because the reputation is low (note: this does not apply to an auto-approval event). Vice versa, participants must be able to see organizer’s reputation score and reviews so they are taken into consideration when deciding to sign up or not.  
For simplicity, you do not have to support changing of a review once it is submitted. 
#### Messaging and notification 
A notification email should be automatically sent to the relevant participant(s) during the following circumstances
User has signed up.
User account has been successfully verified.
User has successfully created an event as an organizer.
User has signed up for an event.
Participation sign-up request has been approved.
Sign-up has been rejected.
Event has been canceled (those who registered, no matter approved or not, will get the notification).
Event you have signed-up has started (only to successfully registered participants).
You have received a review.
New message posted in the forum (only the organizer is required to receive a notification). 
All the notifications should happen right after the according event takes place. 
#### Reporting 
System Reports
System event report: available to every user. This report shows the following numbers of from the last 90 days (based on the current virtual time):
Number of created events (based on creation time) and the percentage of paid events.
Number of canceled events (based on registration deadline) and total number of participation requests (regardless of approval or not) divided by the total number of minimum participants for such events.
Number of finished events (based on finishing time), and the average number of participants of these events.  
User Level Reports, for the current user’s activities. They are all based on the last 90 days of the current virtual time. 
Participation report.
Number of signed-up events (based on singing-up time).
Number of rejects and approvals (based respective action time).
Number of finished events (based on finishing time).  
Organizer report.
Number of created events (based on creation time) and the percentage of paid events.
Number of canceled events (based on registration deadline) and total number of participation requests (regardless of approval or not) divided by the total number of minimum participants for such events.
Number of finished events (based on finishing time), and the average number of participants of these events.  
Number of paid events finished (based on finishing time) and total revenue from these events.



