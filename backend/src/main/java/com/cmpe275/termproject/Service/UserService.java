package com.cmpe275.termproject.Service;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.cmpe275.termproject.Entity.Event;
import com.cmpe275.termproject.Entity.Participant;
import com.cmpe275.termproject.Entity.Review;
import com.cmpe275.termproject.Entity.User;
import com.cmpe275.termproject.Model.Response.Response;
import com.cmpe275.termproject.Repository.EventRepo;
import com.cmpe275.termproject.Repository.ParticipantRepo;
import com.cmpe275.termproject.Repository.ReviewRepo;
import com.cmpe275.termproject.Repository.UserRepo;
import com.cmpe275.termproject.Utilities.Utility.ParticipantStatus;
import com.cmpe275.termproject.Utilities.Utility.ReviewType;

import net.bytebuddy.utility.RandomString;

@Service
public class UserService {

	@Autowired
	UserRepo userRepo;
	
	@Autowired
	EventRepo eventRepo;
	
	@Autowired
	ParticipantRepo participantRepo;
	
	@Autowired
	ReviewRepo reviewRepo;
     
    @Autowired
    private JavaMailSender mailSender;
    
    @Value( "${backend_url}" )
    private String backend_url;
 
	int strength = 10; // work factor of bcrypt

//    BCryptPasswordEncoder bCryptPasswordEncoder =new BCryptPasswordEncoder(strength, new SecureRandom());
 
    
    public void register(User user, String siteURL) {
     
    }
     
	public ResponseEntity<?> submitUser(User user){
		try{
			if(user.getFullName()==null) {
				Response emptyFullName = new Response("Fullname cannot be empty", HttpStatus.BAD_REQUEST);
				return new ResponseEntity<>(emptyFullName, HttpStatus.BAD_REQUEST);
			}else
			if(user.getEmail()==null) {
				Response emptyEmail = new Response("Email cannot be empty", HttpStatus.BAD_REQUEST);
				return new ResponseEntity<>(emptyEmail, HttpStatus.BAD_REQUEST);
			}else
				if(user.getScreenName()==null) {
					Response emptyScreenName = new Response("Screen name cannot be empty", HttpStatus.BAD_REQUEST);
					return new ResponseEntity<>(emptyScreenName, HttpStatus.BAD_REQUEST);
				}
			User testEmail = userRepo.findByEmail(user.getEmail());
			if(testEmail!=null) {
				Response emptyScreenName = new Response("Email already used", HttpStatus.BAD_REQUEST);
				return new ResponseEntity<>(emptyScreenName, HttpStatus.BAD_REQUEST);
			}
			User testScreenName = userRepo.findByScreenName(user.getScreenName());
			if(testScreenName!=null) {
				Response emptyScreenName = new Response("ScreenName already used", HttpStatus.BAD_REQUEST);
				return new ResponseEntity<>(emptyScreenName, HttpStatus.BAD_REQUEST);
			}
			String randomCode = RandomString.make(64);
		    user.setVerificationCode(randomCode);
		    user.setEnabled(false); 
		    sendVerification(user);
			
			return new ResponseEntity<>(userRepo.save(user), HttpStatus.OK);
		}catch(Exception e){
			Response exceptionFetchResponse = new Response("An exception occurred", HttpStatus.BAD_REQUEST);
			System.out.println(e);
			return new ResponseEntity<>(exceptionFetchResponse, HttpStatus.BAD_REQUEST);
		}
	}
	
	public ResponseEntity<?> fetchUserData(String email, String password){
		try{
			User user = userRepo.findByEmail(email);
			System.err.println(email);
			System.err.println(password);
			if(user != null) {
				
//				if(bCryptPasswordEncoder.matches(password, user.getPassword())) {
				if(user.getPassword().equals(password) && user.isEnabled()==true) {
					return new ResponseEntity<>(user, HttpStatus.OK);
				}else if (user.getPassword().equals(password) && user.isEnabled()==false){
					Response userNotFound = new Response("Please verify the user and then login again.", HttpStatus.BAD_REQUEST);
					return new ResponseEntity<>(userNotFound, HttpStatus.BAD_REQUEST);
				}else {
					Response userNotFound = new Response("Incorrect Username or Password", HttpStatus.BAD_REQUEST);
					return new ResponseEntity<>(userNotFound, HttpStatus.BAD_REQUEST);
				}
					
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
	
	public void sendVerification(User user) throws MessagingException, UnsupportedEncodingException{
		String toAddress = user.getEmail();
		String fromAddress = "nain.chetan10@gmail.com";
		String senderName = "Cloud Event Center";
		String subject ="User Authentication";
		String content = "Dear [[name]],<br>"
	            + "Please click the link below to verify your registration:<br>"
	            + "<h3><a href="
	            + "http://3.86.32.217:8080/users/verify?code=" + user.getVerificationCode()
//	            + "target=\"_self\""
	            + ">VERIFY</a></h3>"
	            + "Thank you,<br>"
	            + "Coud event ";

		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message);
		
		helper.setFrom(fromAddress, senderName);
		helper.setTo(toAddress);
		helper.setSubject(subject);
		
		content = content.replace("[[name]]", user.getFullName());
		String verifyURL = "http://3.86.32.217:8080/users/verify?code="+ user.getVerificationCode();		
	
		content = content.replace("[[URL]]", verifyURL);
		System.err.println(content+" "+verifyURL);
		helper.setText(content, true);	
		
		mailSender.send(message);
	}
	
	public void sendEmail(User user, String subjectOfEmail, String contentOfEmail ) throws MessagingException, UnsupportedEncodingException{
		String toAddress = user.getEmail();
		String fromAddress = "nain.chetan10@gmail.com";
		String senderName = "Cloud Event Center";
		String subject =subjectOfEmail;
		String content = "Dear [[name]],<br>"
	            + contentOfEmail
	            + "<br>Thank you,<br>"
	            + "Coud event ";

		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message);
		
		helper.setFrom(fromAddress, senderName);
		helper.setTo(toAddress);
		helper.setSubject(subject);
		content = content.replace("[[name]]", user.getFullName());
		helper.setText(content, true);	
		mailSender.send(message);
	}
	
	public boolean verify(String verificationCode) {
	    User user = userRepo.findByVerificationCode(verificationCode);
	    if (user == null || user.isEnabled()) {
	        return false;
	    } else {
	        user.setVerificationCode(null);
	        user.setEnabled(true);
	        userRepo.save(user);
	        return true;
	    }
	}
	
	public ResponseEntity<?> fetchByGmail(String email){
		try{
			System.err.println(email);
			User user = userRepo.findByEmail(email);
			System.err.println(user);
			if(user != null && user.isEnabled()==true) {
					return new ResponseEntity<>(user, HttpStatus.OK);
			}else if(user != null && user.isEnabled()==false) {
				Response userNotFound = new Response("Please verify your account.", HttpStatus.NOT_FOUND);
				return new ResponseEntity<>(userNotFound, HttpStatus.NOT_FOUND);
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
	public ResponseEntity<?> getParticipants(Long userId, Long eventId, ParticipantStatus status) {
		try{
			List<List<String>> lst = new ArrayList<>();
			List<Participant> parts;
			Event e = eventRepo.findByEventId(eventId);
			if (!userId.equals(e.getOrganizer().getUserId())) {
				Response exceptionFetchResponse = new Response("User not organizer of the event", HttpStatus.BAD_REQUEST);
				System.out.println(e);
				return new ResponseEntity<>(exceptionFetchResponse, HttpStatus.BAD_REQUEST);
			}
			if (status == null) {
				parts = participantRepo.findByEventId(eventId);
			} else {
				parts = participantRepo.findByEventIdAndParticipantStatus(eventId, status);
			}
			
			for (Participant p: parts) {
				User u = userRepo.findByUserId(p.getUserId());
				List<Review> reviews = reviewRepo.findReviewByGivenToUserAndReviewType(u, ReviewType.onParticipant);
				int totalReviews = reviews.size();
				
				int ratingSum = 0;
				float avg = 0;
				if (totalReviews > 0) {
					for (Review review: reviews ) {
						ratingSum += review.getRating();
					}
					avg = (float) ratingSum / totalReviews;
				}
				List<String> lstIn = new ArrayList<>();
				String uid = Long.toString(u.getUserId());
				lstIn.add(uid);
;				lstIn.add(u.getScreenName());
				lstIn.add(u.getFullName());
				lstIn.add(p.getParticipantStatus().toString());
				// participant user rating score
				lstIn.add(Float.toString(avg));
				lst.add(lstIn);
			}
			return new ResponseEntity<>(lst, HttpStatus.OK);
			
		} catch(Exception e){
			Response exceptionFetchResponse = new Response("An exception occurred", HttpStatus.BAD_REQUEST);
			System.out.println(e);
			return new ResponseEntity<>(exceptionFetchResponse, HttpStatus.BAD_REQUEST);
		}
		
	}
}
