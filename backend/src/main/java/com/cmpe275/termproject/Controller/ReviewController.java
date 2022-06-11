package com.cmpe275.termproject.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.cmpe275.termproject.Service.ReviewService;
import com.cmpe275.termproject.Utilities.Utility.ReviewType;
import com.fasterxml.jackson.databind.node.ObjectNode;

@RestController
@CrossOrigin
public class ReviewController {
	
	@Autowired
	ReviewService reviewService;
	
	@PostMapping("/review")
	private ResponseEntity<?> submitReview(@RequestBody ObjectNode jsonBody){
		return reviewService.submitReview(jsonBody);
	}
	
	@GetMapping("user/{givenToUserId}/reviews")
	private ResponseEntity<?> fetchReviewsOnUser(@PathVariable long givenToUserId, @RequestParam ReviewType reviewType) {
		return reviewService.fetchReviewsOnUser(givenToUserId, reviewType);
	}
	
}
