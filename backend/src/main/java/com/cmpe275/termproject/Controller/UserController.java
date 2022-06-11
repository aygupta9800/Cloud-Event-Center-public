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
import com.cmpe275.termproject.Utilities.Utility.ParticipantStatus;
import com.fasterxml.jackson.databind.node.ObjectNode;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {
	
	@Autowired UserService userService;
	
	@PostMapping(path="")
	private ResponseEntity<?> submitUser(@RequestBody User user) {
		//System.err.print("NUMBER TO BE PRINTER");
		//System.err.println(number);
		System.out.print(user);
		return userService.submitUser(user);
	}
	
	@PostMapping(path="/signin")
	private ResponseEntity<?> getUser(@RequestBody ObjectNode jsonBody) {
		String email = jsonBody.get("email").asText();
		String password = jsonBody.get("password").asText();
		return userService.fetchUserData(email, password);
	}
	
	@PostMapping(path="/signingmail")
	private ResponseEntity<?> signInGmail(@RequestBody String email){
		return userService.fetchByGmail(email);
	}
	
	@GetMapping("/verify")
	public String verifyUser(@Param("code") String code) {
	    if (userService.verify(code)) {
	        return "Congratulations! Your account is verified. We will soon enable the UI, so next time you will be directed to user homepage.";
	    } else {
	        return "verify_fail";
	    }
	}
	
	@GetMapping("/participantsList")
	public ResponseEntity<?> getParticipants(@RequestParam Long userId, @RequestParam Long eventId, @RequestParam(required=false) ParticipantStatus status) {
		System.err.println(userId+ eventId);
		return userService.getParticipants(userId, eventId, status);
		
	}

}
