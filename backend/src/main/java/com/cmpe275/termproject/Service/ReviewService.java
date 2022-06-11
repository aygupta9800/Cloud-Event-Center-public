package com.cmpe275.termproject.Service;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.cmpe275.termproject.Entity.Event;
import com.cmpe275.termproject.Entity.Review;
import com.cmpe275.termproject.Entity.User;
import com.cmpe275.termproject.Model.Response.Response;
import com.cmpe275.termproject.Repository.EventRepo;
import com.cmpe275.termproject.Repository.ReviewRepo;
import com.cmpe275.termproject.Repository.UserRepo;
import com.cmpe275.termproject.Utilities.Utility.ReviewType;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
public class ReviewService {
	
	@Autowired
	ReviewRepo reviewRepo;
	
	@Autowired
	UserRepo userRepo;

	@Autowired
	EventRepo eventRepo;
	
	@Autowired
	UserService userService;
	// service to post a review 
//	   6                7
	// givenByUserId, givenToUserId, reviewText, rating, reviewTime, reviewType
	public ResponseEntity<?> submitReview(ObjectNode jsonBody) {
		try {
			System.out.println("jsonbody"+ jsonBody);
			long givenToUserId = jsonBody.get("givenToUserId").asLong();
			long givenByUserId = jsonBody.get("givenByUserId").asLong();
			long eventId = jsonBody.get("eventId").asLong();
			String reviewText = jsonBody.get("reviewText").asText();
			int rating = jsonBody.get("rating").asInt();
			DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	        Date date = df.parse(jsonBody.get("reviewTime").asText());
	        Timestamp reviewTime = new Timestamp(date.getTime());
	        ReviewType reviewType = ReviewType.valueOf(jsonBody.get("reviewType").asText());
	        String errorMsg = "";
	        
	        
	        
	        // TODO: check the time is btw start and 1 week after the endtime -> Keep on frontend
	        // Add eventid in pojo if required.
	        // Both User Exist
	        // Participant Approved check at frontend + backend
	        // if type Onparticipant-> onUser, onOrganize -> byUser
//	        if (reviewType == ReviewType.onOrganizer) {
	        System.out.println("reviewTime"+ reviewTime);
			System.out.println("reviewType:"+ reviewType);
			
			User givenToUser = userRepo.findByUserId(givenToUserId);
			User givenByUser = userRepo.findByUserId(givenByUserId);
			Event event = eventRepo.findByEventId(eventId);
			if (givenToUser == null || givenByUser == null || event == null ) {
				errorMsg = "Either of participant, organizer users or event doesnt exist";
				Response exceptionSubmitResponse = new Response(errorMsg, HttpStatus.BAD_REQUEST);
				System.out.println(errorMsg);
				return new ResponseEntity<>(exceptionSubmitResponse, HttpStatus.BAD_REQUEST);

			}
	        List<Review> oldReviews = reviewRepo.findAllReviewByEventAndGivenByUserAndGivenToUserAndReviewType(event, givenByUser,givenToUser, reviewType);
	        if (oldReviews != null && oldReviews.size() > 0) {
	        	errorMsg = "You cant review same user again for same event";
	        	Response exceptionSubmitResponse = new Response(errorMsg, HttpStatus.BAD_REQUEST);
				System.out.println(errorMsg);
				return new ResponseEntity<>(exceptionSubmitResponse, HttpStatus.BAD_REQUEST);
	        }
			
			
			Review review = new Review(0, event, givenByUser, givenToUser, reviewText, rating, reviewTime, reviewType);
			review = reviewRepo.save(review);
			//givenToUserId
			userService.sendEmail(givenToUser, "You have received a new review.", "You have received a new review : " + reviewText);
			return new ResponseEntity<>(review, HttpStatus.OK);
			
		} catch(Exception e) {
			Response exceptionSubmitResponse = new Response("An exception occurred", HttpStatus.INTERNAL_SERVER_ERROR);
			System.out.println(e);
			return new ResponseEntity<>(exceptionSubmitResponse, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	
	// Get all reviews of a User
	public ResponseEntity<?> fetchReviewsOnUser(long givenToUserId, ReviewType reviewType) {
		try {
//			System.out.println("jsonbody"+ jsonBody);
//			long givenToUserId = jsonBody.get("givenToUserId").asLong();
//			long givenByUserId = jsonBody.get("givenByUserId").asLong();
//			String reviewText = jsonBody.get("reviewText").asText();
//			int rating = jsonBody.get("rating").asInt();
//			DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//	        Date date = df.parse(jsonBody.get("reviewTime").asText());
//	        Timestamp reviewTime = new Timestamp(date.getTime());
//	        
	        String errorMsg = "";
	        
	        // TODO: check the time is btw start and 1 week after the endtime -> Keep on frontend
	        // Add eventid in pojo if required.
	        // Both User Exist
	        // Participant Approved check at frontend + backend
	        // if type Onparticipant-> onUser, onOrganize -> byUser

//			ReviewType reviewType = ReviewType.valueOf(jsonBody.get("reviewType").asText());
//			System.out.println("reviewTime"+ reviewTime);
//			System.out.println("reviewType:"+ reviewType);
	        User givenToUser = userRepo.findByUserId(givenToUserId);
			List<Review> reviews = reviewRepo.findReviewByGivenToUserAndReviewType(givenToUser, reviewType);
//			User givenByUser = userRepo.findByUserId(givenByUserId);
//			Review review = new Review(0, givenByUser, givenToUser, reviewText, rating, reviewTime, reviewType);
//			review = reviewRepo.save(review);
			return new ResponseEntity<>(reviews, HttpStatus.OK);
			
		} catch(Exception e) {
			Response exceptionSubmitResponse = new Response("An exception occurred", HttpStatus.BAD_REQUEST);
			System.out.println(e);
			return new ResponseEntity<>(exceptionSubmitResponse, HttpStatus.BAD_REQUEST);
		}
	}
}
