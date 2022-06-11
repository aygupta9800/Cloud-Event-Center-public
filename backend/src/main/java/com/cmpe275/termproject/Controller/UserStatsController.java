package com.cmpe275.termproject.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cmpe275.termproject.Entity.User;
import com.cmpe275.termproject.Service.UserService;
import com.cmpe275.termproject.Service.UserStatsService;
import com.cmpe275.termproject.Utilities.Utility.ParticipantStatus;
import com.fasterxml.jackson.databind.node.ObjectNode;

//
//Participation report.
//Number of signed-up events (based on singing-up time).
//Number of rejects and approvals (based respective action time).
//Number of finished events (based on finishing time).  
//Organizer report.
//Number of created events (based on creation time) and the percentage of paid events.
//Number of canceled events (based on registration deadline) and total number of participation requests (regardless of approval or not) divided by the total number of minimum participants for such events.
//Number of finished events (based on finishing time), and the average number of participants of these events.  

@RestController
@RequestMapping("/stats/user")
@CrossOrigin
public class UserStatsController {

		
	@Autowired UserStatsService userStatsService;
	
	@GetMapping(path="/participation")
	private ResponseEntity<?> participant(@RequestParam Long userId) {
		//System.err.print("NUMBER TO BE PRINTER");
		//System.err.println(number);
		System.out.print(userId);
		return userStatsService.getParticipationReport(userId);
	}
	
	@GetMapping(path="/organizer")
	private ResponseEntity<?> organizer(@RequestParam Long userId) {
		//System.err.print("NUMBER TO BE PRINTER");
		//System.err.println(number);
		System.out.print(userId);
		return userStatsService.getOrganizerReport(userId);
	}
	
//	@PostMapping(path="/signin")
//	private ResponseEntity<?> getUser(@RequestBody ObjectNode jsonBody) {
//		String email = jsonBody.get("email").asText();
//		String password = jsonBody.get("password").asText();
//		return userService.fetchUserData(email, password);
//	}
//	
//	@PostMapping(path="/signingmail")
//	private ResponseEntity<?> signInGmail(@RequestBody String email){
//		return userService.fetchByGmail(email);
//	}
//	
//	@GetMapping("/verify")
//	public String verifyUser(@Param("code") String code) {
//	    if (userService.verify(code)) {
//	        return "Congratulations! Your account is verified. We will soon enable the UI, so next time you will be directed to user homepage.";
//	    } else {
//	        return "verify_fail";
//	    }
//	}
//	
//	@GetMapping("/participantsList")
//	public ResponseEntity<?> getParticipants(@RequestParam Long userId, @RequestParam Long eventId, @RequestParam(required=false) ParticipantStatus status) {
//		System.err.println(userId+ eventId);
//		return userService.getParticipants(userId, eventId, status);
//		
//	}
//
//	

	
}
