package com.cmpe275.termproject.Service;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.cmpe275.termproject.Entity.Event;
import com.cmpe275.termproject.Model.Response.Response;
import com.cmpe275.termproject.Utilities.Utility.EventStatus;

@Service
public class SystemStatsService {
	  
	@Autowired
    private EventService eventService;
	
	@SuppressWarnings("unchecked")
	public ResponseEntity<?> getSystemReport(Timestamp currentTime){
		try {
			
			Calendar calendar = Calendar.getInstance();
			System.out.println("time = " + currentTime);
			calendar.setTime(currentTime);
			calendar.add(Calendar.DAY_OF_WEEK, -90);
			
			Timestamp pastTime = new Timestamp(calendar.getTime().getTime());
			
			List<Event> events = (List<Event>) eventService.searchEvent(null, null, null, null, pastTime.toString(), null, null, null,null).getBody();
			
			System.out.println("num of events are: " + events.size());
			
			int numberOfCreatedEvents = events.size();
			int numberOfPaidEvents = 0;
			int numberOfCanceledEvents = 0;
			int numberOfFinishedEvents = 0;
			int numberOfParticipationRequests = 0;
			int minimumParticipants = 0;
			int totalParticipants = 0;
			
			for(Event event : events) {
				if(event.getFee() > 0) {
					numberOfPaidEvents += 1;
				}
				
				if(event.getStatus() == EventStatus.CANCELED) {
					numberOfCanceledEvents += 1;	
					minimumParticipants += event.getMinParticipants();
					numberOfParticipationRequests += event.getParticipants().size();
//					System.out.println("event: " + event.getEventId() + " numOfReq: " + event.getParticipants().size());
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
			
			System.out.println("response = " + response);
			
			return new ResponseEntity<>(response.toMap(), HttpStatus.OK);
			
		} catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(new Response("An exception occured", HttpStatus.INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
	}
}
