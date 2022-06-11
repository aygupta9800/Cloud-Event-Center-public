package com.cmpe275.termproject.Service;

import com.cmpe275.termproject.Entity.Event;
import com.cmpe275.termproject.Entity.Message;
import com.cmpe275.termproject.Entity.User;
import com.cmpe275.termproject.Model.Response.Response;
import com.cmpe275.termproject.Repository.MessageRepo;
import com.cmpe275.termproject.Utilities.Utility;
import com.cmpe275.termproject.Utilities.Utility.EventStatus;
import com.cmpe275.termproject.Utilities.Utility.ForumMode;
import com.cmpe275.termproject.Utilities.Utility.ForumType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.cmpe275.termproject.Entity.Forum;
import com.cmpe275.termproject.Repository.EventRepo;
import com.cmpe275.termproject.Repository.ForumRepo;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
public class ForumService {
    @Autowired
    private MessageRepo messageRepo;

    @Autowired
    private ForumRepo forumRepo;
    
    @Autowired
    private EventRepo eventRepo;
 
    @Autowired
    private UserService userService;

    public ResponseEntity<?> submitForum(Forum forum){
        return new ResponseEntity<>(forumRepo.save(forum), HttpStatus.OK);
    }

    public ResponseEntity<?> getForum(long forumId, long userId){
    	Forum forum = forumRepo.findByForumId(forumId);
    	
        if(forum!=null){
            if(forum.getForumType().equals(Utility.ForumType.SIGNUP)){
                return new ResponseEntity<>(forum, HttpStatus.OK);
            }

            if(forum.getForumMode().equals(Utility.ForumMode.INACCESSIBLE)){
                return new ResponseEntity<>(new Response("This forum is not currently accessible", HttpStatus.FORBIDDEN), HttpStatus.FORBIDDEN);
            }

            try {
            	Event event = forum.getEvent();
                long organizer = forum.getEvent().getOrganizer().getUserId();
                System.out.println("organizer = " + organizer);
                
                if (userId == organizer) {
                    System.out.println("in");
                    return new ResponseEntity<>(forum, HttpStatus.OK);
                }
                
                if(event.getParticipants() != null && event.getParticipants().isEmpty()==false) {
                    System.out.println("inside if");
                    Set<User> participants = event.getParticipants();

                    for (User participant : participants) {
                        if (participant.getUserId() == userId) {
                            return new ResponseEntity<>(forum, HttpStatus.OK);
                        }
                    }
                }
                else{
                    return new ResponseEntity<>(new Response("This forum is accessible only to event participants", HttpStatus.FORBIDDEN), HttpStatus.FORBIDDEN);
                }

                System.out.println("outside if");
                return new ResponseEntity<>(new Response("Forum not accessible", HttpStatus.FORBIDDEN), HttpStatus.FORBIDDEN);

            } catch (Exception e){
                e.printStackTrace();
                return new ResponseEntity<>(new Response("An exception occured", HttpStatus.INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        else{
            return new ResponseEntity<>(new Response("Forum not found", HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<?> postMessage(long forumId, long participantID, String participantName, String message, String imageURL){
        try {
            Forum forum = forumRepo.findByForumId(forumId);
           
            if(forum!=null) {
                Message userMessage = new Message();
                User user = forum.getEvent().getOrganizer();
                if(forum.getEvent().getOrganizer().getUserId() == participantID){
                    userMessage.setParticipantName("ORGANIZER: " + participantName);

                } else {
                    userMessage.setParticipantName(participantName);
                }

                userMessage.setParticipantID(participantID);

                userMessage.setMessage(message);
                userMessage.setImageURL(imageURL);
                userMessage.setForum(forum);
                Timestamp timestamp = new Timestamp(System.currentTimeMillis());
                userMessage.setPostedAt(timestamp);
                Message savedMessage = messageRepo.save(userMessage);
                System.out.println(savedMessage);
                forum.addMessage(savedMessage);
                userService.sendEmail( user, " A new message posted on " + forum.getEvent().getTitle(), "A new message has been posted on the forum" + forum.getEvent().getTitle());
                forumRepo.save(forum);

                return new ResponseEntity<>(savedMessage, HttpStatus.OK);
            } else {
                Response forumNotFoundResponse = new Response("Forum not found", HttpStatus.NOT_FOUND);
                return new ResponseEntity<>(forumNotFoundResponse, HttpStatus.NOT_FOUND);
            }

        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(new Response("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    public Map<ForumType, Forum> setForumMode(Event event, Timestamp currentTime) {
    	Map<Utility.ForumType, Forum> forums = new HashMap<>();
    	System.out.println("event id: " + event.getEventId());
    	forums = event.getForums();
    	
    	Forum signUpForum = forums.get(ForumType.SIGNUP);
    	Forum participantForum = forums.get(ForumType.PARTICIPANT);	
    			
  
    	if(event.getStatus() == EventStatus.OPEN) { //Open for registration
    		
    		signUpForum.setForumMode(ForumMode.OPEN);
    		participantForum.setForumMode(ForumMode.INACCESSIBLE);
    		participantForum.setDescription("This forum is not yet open or inaccessible to you");
    		
    	} else if(event.getStatus() == EventStatus.CLOSED) { //Closed for registration but not yet started
    		
    		signUpForum.setForumMode(ForumMode.READONLY);
    		signUpForum.setDescription("This forum is not taking any more posts");
    		
    		participantForum.setForumMode(ForumMode.OPEN);
    		
    	} else if(event.getStatus() == EventStatus.ONGOING) { //Started
    		
    		signUpForum.setForumMode(ForumMode.READONLY);
    		signUpForum.setDescription("This forum is not taking any more posts");
    		
    		participantForum.setForumMode(ForumMode.OPEN);
    		
    	} else if(event.getStatus() == EventStatus.FINISHED) {  //Event over
    		System.out.println("entered here to set forums to readonly");
    		signUpForum.setForumMode(ForumMode.READONLY);
    		signUpForum.setDescription("This forum is not taking any more posts");
    		
    		//System.out.println("timeeee: " + (currentTime.getTime() - event.getEndTime().getTime()));
    		
    		if(currentTime.getTime() - event.getEndTime().getTime() >= 259200000) {
    			System.out.println("72 hours have passed for event " + event.getEventId());
    			participantForum.setForumMode(ForumMode.READONLY);	
    			participantForum.setDescription("This forum is not taking any more posts");
    		}
    		
    		else {
    			participantForum.setForumMode(ForumMode.OPEN); 
    		}
    		 
    	} else if(event.getStatus() == EventStatus.CANCELED) {  //Canceled due to min. part
    		
    		signUpForum.setForumMode(ForumMode.READONLY);
    		signUpForum.setDescription("This forum is closed because the event has been canceled due to less participants");
    		
    		participantForum.setForumMode(ForumMode.INACCESSIBLE);
    		participantForum.setDescription("This forum is closed because the event has been canceled due to less participants");
    	}
    	
    	System.out.println("signup forum status = " + signUpForum.getForumMode().toString());
    	System.out.println("part forum status = " + participantForum.getForumMode().toString());
    	
    	forumRepo.save(signUpForum);
    	forumRepo.save(participantForum);
    	
		return forums;
    }
    
    public ResponseEntity<?> closeParticipantForum(long forumId, long userId, Timestamp currentTime){
    	
    	try {
    	Forum forum = forumRepo.findByForumId(forumId);
    	Event event = forum.getEvent();
    		
        long organizer = forum.getEvent().getOrganizer().getUserId();
        System.out.println("organizer = " + organizer);
        
        if (userId == organizer) {
        	Map<Utility.ForumType, Forum> forums = new HashMap<>();
        	
        	forums = event.getForums();
        	
        	Forum participantForum = forums.get(ForumType.PARTICIPANT);
        	
            System.out.println("in");
            if((currentTime.getTime() - event.getEndTime().getTime() <= 259200000) && event.getStatus()==EventStatus.FINISHED && participantForum.getForumMode()==ForumMode.OPEN) {
    			System.out.println("less than 72 hours have passed for event " + event.getEventId());
    			
    			participantForum.setForumMode(ForumMode.READONLY);	
    			participantForum.setDescription("This forum has been closed by the organizer after end of event");
    			
    			forumRepo.save(participantForum);
    			
    			forums.put(ForumType.PARTICIPANT, participantForum);
    			event.setForums(forums);
    			
    			eventRepo.save(event);
    			
    			return new ResponseEntity<>(participantForum, HttpStatus.OK);
    		
    		}
            
            else {
            	return new ResponseEntity<>(new Response("This forum has already been closed", HttpStatus.FORBIDDEN), HttpStatus.FORBIDDEN);
  
            }
            
        } else {
        	return new ResponseEntity<>(new Response("Only the organizer has rights to close this forum", HttpStatus.FORBIDDEN), HttpStatus.FORBIDDEN);
        }
    	
    	} catch(Exception e) {
    		e.printStackTrace();
            return new ResponseEntity<>(new Response("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        
    	}
    	
    }
    

//    public ResponseEntity<?> getMessages(long forumId){
//        try {
//            Forum forum = forumRepo.findByForumId(forumId);
//
//            if (forum != null) {
//                List<Message> messages = forum.getMessages();
//                if(messages!=null && messages.isEmpty() != true){
//                    return new ResponseEntity<>(messages, HttpStatus.OK);
//
//                } else{
//                    Response messagesNotFoundResponse = new Response("No messages found", HttpStatus.NOT_FOUND);
//                    return new ResponseEntity<>(messagesNotFoundResponse, HttpStatus.NOT_FOUND);
//                }
//
//            } else{
//                Response forumNotFoundResponse = new Response("Forum not found", HttpStatus.NOT_FOUND);
//                return new ResponseEntity<>(forumNotFoundResponse, HttpStatus.NOT_FOUND);
//            }
//        } catch (Exception e){
//            e.printStackTrace();
//            return new ResponseEntity<>(new Response("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }


}
