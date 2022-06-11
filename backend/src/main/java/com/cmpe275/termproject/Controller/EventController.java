package com.cmpe275.termproject.Controller;


import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cmpe275.termproject.Model.Request.CreateEventDetail;
import com.cmpe275.termproject.Model.Response.Response;
import com.cmpe275.termproject.Service.EventService;
import com.cmpe275.termproject.Service.VirtualTimeService;
import com.fasterxml.jackson.databind.node.ObjectNode;

@RestController
@RequestMapping("/event")
@CrossOrigin
public class EventController {
	
	@Autowired
	EventService eventService;
	@Autowired
	VirtualTimeService virtualTimeService;
	@PostMapping("")
	private ResponseEntity<?> submitEvent(@RequestBody CreateEventDetail event){
		return eventService.submitEvent(event);
	}
	
	
	@GetMapping()
	private ResponseEntity<?> filterEvent(
			   @RequestParam(required = false) String location,
			   @RequestParam(required = false) String status,
			   @RequestParam(required = false) String startTime,
			   @RequestParam(required = false) String endTime,
			   @RequestParam(required = false) String creationTime,
			   @RequestParam(required = false) String keyword,
			   @RequestParam(required = false) String organizer) {
				return eventService.searchEvent(location, status, startTime, endTime, creationTime, keyword, organizer, null, null);
		
	}

	@GetMapping("/{eventId}")
	private ResponseEntity<?> getEvent(@PathVariable long eventId){
		return eventService.getEvent(eventId);
	}
	
	@DeleteMapping("/{eventId}")
	private ResponseEntity<?> deleteEvent(@PathVariable long eventId) {
		return eventService.deleteEvent(eventId);
	}
	
//	@GetMapping("/locations")
//	private ResponseEntity<?> getEventLocations(){
//		return eventService.getLocations();
//	}
	
	
	
	@PostMapping("/signup")
	private ResponseEntity<?> eventSignup(@RequestParam(required = true) long eventId,
			   @RequestParam(required = true) long userId){
	
		return eventService.eventSignup(eventId, userId);
	}
	
	@PutMapping("/participant/status")
	private ResponseEntity<?> changeParticipantStatus(@RequestBody ObjectNode jsonBody) {
		return eventService.changeParticipantStatus(jsonBody);
		
	}
	
	
	@PutMapping("/updateDbEvent")
	private ResponseEntity<?> updateDbEvents(@RequestParam(required = false) String currentTime) {
		
		try {
		Timestamp currentTimestamp;

		if(currentTime==null) {
			currentTimestamp = virtualTimeService.setDefaultTime();
		}
		else {
			DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		    Date date = df.parse(currentTime);
		    long time = date.getTime();
		    currentTimestamp = new Timestamp(time);
			currentTimestamp = virtualTimeService.setByUserTime(currentTimestamp);
		}
		
		System.out.println(currentTimestamp);
		return eventService.updateDbEvent(currentTimestamp);
			
		} catch(Exception e) {
			Response exceptionSubmitResponse = new Response("An exception occurred"+ e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
			System.out.println(e);
			return new ResponseEntity<>(exceptionSubmitResponse, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@Scheduled(fixedDelay = 3600000)
	public ResponseEntity<?> autoUpdateDbEvents() {
		Timestamp timestamp = virtualTimeService.setDefaultTime();
		System.out.println("Auto Update Timestamp "  + timestamp);
		return eventService.updateDbEvent(timestamp);
	}	

}	
