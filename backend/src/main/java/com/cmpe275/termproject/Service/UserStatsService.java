package com.cmpe275.termproject.Service;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.cmpe275.termproject.Entity.Event;
import com.cmpe275.termproject.Entity.Participant;
import com.cmpe275.termproject.Entity.User;
import com.cmpe275.termproject.Entity.UserStats;
import com.cmpe275.termproject.Entity.VirtualTime;
import com.cmpe275.termproject.Model.Response.Response;
import com.cmpe275.termproject.Repository.EventRepo;
import com.cmpe275.termproject.Repository.ParticipantRepo;
import com.cmpe275.termproject.Repository.ReviewRepo;
import com.cmpe275.termproject.Repository.UserRepo;
import com.cmpe275.termproject.Repository.VirtualTimeRepo;
import com.cmpe275.termproject.Utilities.Utility.EventStatus;
import com.cmpe275.termproject.Utilities.Utility.ParticipantStatus;




@Service
public class UserStatsService {
	
	
	@Autowired
	UserRepo userRepo;
	
	@Autowired
	EventRepo eventRepo;
	
	@Autowired
	ParticipantRepo participantRepo;
	
	@Autowired
	ReviewRepo reviewRepo;
     
	@Autowired
    private EventService eventService;
 
	@Autowired
	VirtualTimeRepo virtualTimeRepo;

	
	//Participation report.
	//Number of signed-up events (based on singing-up time).
	//Number of rejects and approvals (based respective action time).
	//Number of finished events (based on finishing time).  
	//Organizer report.
	//Number of created events (based on creation time) and the percentage of paid events.
	//Number of canceled events (based on registration deadline) and total number of participation requests (regardless of approval or not) divided by the total number of minimum participants for such events.
	//Number of finished events (based on finishing time), and the average number of participants of these events.  
	
	


	public ResponseEntity<?> getParticipationReport(Long userId) {
		try{
			List<Participant> user = participantRepo.findByUserId(userId);
			
		 
		    
		
			if(user != null) {
				
					VirtualTime virtualTime = virtualTimeRepo.findFirstByOrderByVirtualTimeId();
					
					Calendar calendar = Calendar.getInstance();
					System.out.println("time = " + virtualTime.getvirtualTimeId());
					calendar.setTime(virtualTime.getVirtualTime());
					calendar.add(Calendar.DAY_OF_WEEK, -90);
					
					Timestamp pastTime = new Timestamp(calendar.getTime().getTime());
					Timestamp currentTime = virtualTime.getVirtualTime();
				   List<UserStats> signedupEvents = participantRepo.countSignedupEventByTime(userId, currentTime, pastTime);
				   System.err.println(signedupEvents);
				   List<UserStats> enrolledEvents = participantRepo.countApprovedRejectedEventByTime(userId, 0, currentTime, pastTime);
				   System.err.println(enrolledEvents);
				  				   
				   List<UserStats> rejectedEvents = participantRepo.countApprovedRejectedEventByTime(userId,2, currentTime, pastTime);
				   System.err.println(rejectedEvents);
				   
				   List<UserStats> finishedEvents = participantRepo.countFinishedEvent(userId,4, pastTime);
				   System.err.println(rejectedEvents);
				   
				   
				   
				    JSONObject response = new JSONObject();
					response.put("signedupEvents", signedupEvents);
					response.put("enrolledEvents", enrolledEvents);
					response.put("rejectedEvents", rejectedEvents);
					response.put("finishedEvents", finishedEvents);
//					response.put("finishedEvents", numberOfFinishedEvents);
//					response.put("participationRequests", numberOfParticipationRequests);
//					response.put("minimumParticipants", minimumParticipants);
//					response.put("totalParticipants", totalParticipants);
//					
					System.out.println("response = " + response);
					
					return new ResponseEntity<>(response.toMap(), HttpStatus.OK);				   
				   //return new ResponseEntity<>(events, HttpStatus.OK);

				   
//				if(bCryptPasswordEncoder.matches(password, user.getPassword())) {
//				if(user.getPassword().equals(password) && user.isEnabled()==true) {
//					return new ResponseEntity<>(user, HttpStatus.OK);
//				}else if (user.getPassword().equals(password) && user.isEnabled()==false){
//					Response userNotFound = new Response("Please verify the user and then login again.", HttpStatus.BAD_REQUEST);
//					return new ResponseEntity<>(userNotFound, HttpStatus.BAD_REQUEST);
//				}else {
//					Response userNotFound = new Response("Incorrect Username or Password", HttpStatus.BAD_REQUEST);
//					return new ResponseEntity<>(userNotFound, HttpStatus.BAD_REQUEST);
//				}
					
			}
			else {
				Response userNotFound = new Response("User not found", HttpStatus.NOT_FOUND);
				return new ResponseEntity<>(userNotFound, HttpStatus.NOT_FOUND);
			}
		} catch(Exception e){
			Response exceptionFetchResponse = new Response("An exception occurred", HttpStatus.BAD_REQUEST);
			System.out.println(e);
			return new ResponseEntity<>(exceptionFetchResponse, HttpStatus.BAD_REQUEST);
		}
	}
	
	
	
//	Number of created events (based on creation time) and the percentage of paid events.
//	Number of canceled events (based on registration deadline) and total number of participation requests (regardless of approval or not) divided by the total number of minimum participants for such events.
//	Number of finished events (based on finishing time), and the average number of participants of these events.  
//	Number of paid events finished (based on finishing time) and total revenue from these events.

	
	@SuppressWarnings("unchecked")

	public ResponseEntity<?> getOrganizerReport(Long userId) {

			try {
				VirtualTime virtualTime = virtualTimeRepo.findFirstByOrderByVirtualTimeId();
				
				Calendar calendar = Calendar.getInstance();
				System.out.println("time = " + virtualTime.getvirtualTimeId());
				calendar.setTime(virtualTime.getVirtualTime());
				calendar.add(Calendar.DAY_OF_WEEK, -90);
				
				Timestamp pastTime = new Timestamp(calendar.getTime().getTime());
				
				List<Event> events = (List<Event>) eventService.searchEvent(null, null, null, null, pastTime.toString(), null, null,userId, null).getBody();
				
				List<Event> finishedEvents = eventRepo.countFinishedEvent(userId, 4, pastTime);
				System.out.println("num of events are: " + events.size());
				
				int numberOfCreatedEvents = events.size();
				int numberOfPaidEvents = 0;
				int numberOfCanceledEvents = 0;
				int numberOfFinishedEvents = 0;
				int numberOfParticipationRequests = 0;
				int minimumParticipants = 0;
				int totalParticipants = 0;
				float totalRevenue = 0;
				
				int numberOfPaidFinished = 0;
				
				for(Event event: finishedEvents) {
					
					if(event.getFee() > 0) {
						numberOfPaidFinished += 1;
						totalRevenue+= event.getFee();
					}
					
				}
				
				for(Event event : events) {
					if(event.getFee() > 0) {
						numberOfPaidEvents += 1;
					}
					
					if(event.getStatus() == EventStatus.CANCELED) {
						numberOfCanceledEvents += 1;	
						minimumParticipants += event.getMinParticipants();
						numberOfParticipationRequests += event.getParticipants().size();
					}
					
					
					if(event.getStatus() == EventStatus.FINISHED) {
						numberOfFinishedEvents += 1;
						totalParticipants += event.getParticipants().size();
					}
					
				}
			
				JSONObject response = new JSONObject();
				response.put("createdEvents", numberOfCreatedEvents);
				response.put("paidEvents", numberOfPaidEvents);
				response.put("canceledEvents", numberOfCanceledEvents);
				response.put("finishedEvents", numberOfFinishedEvents);
				response.put("participationRequests", numberOfParticipationRequests);
				response.put("minimumParticipants", minimumParticipants);
				response.put("totalParticipants", totalParticipants);
				response.put("totalPaidFinishedEvents", numberOfPaidFinished);
				response.put("totalFreeFinishedEvents", finishedEvents.size()-numberOfPaidFinished);
				response.put("totalRevenue", totalRevenue);
				

				
				System.out.println("response = " + response);
				
				return new ResponseEntity<>(response.toMap(), HttpStatus.OK);
				
			} catch (Exception e){
	            e.printStackTrace();
	            return new ResponseEntity<>(new Response("An exception occured", HttpStatus.INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
			}
			
		
			}
	

}
