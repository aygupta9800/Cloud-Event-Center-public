package com.cmpe275.termproject.Service;


import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import com.cmpe275.termproject.Entity.Forum;
import com.cmpe275.termproject.Entity.Participant;
import com.cmpe275.termproject.Entity.Review;
import com.cmpe275.termproject.Repository.ForumRepo;
import com.cmpe275.termproject.Repository.ParticipantRepo;
import com.cmpe275.termproject.Repository.ReviewRepo;
import com.cmpe275.termproject.Utilities.Utility;
import com.cmpe275.termproject.Utilities.Utility.AdmissionPolicy;
import com.cmpe275.termproject.Utilities.Utility.EventStatus;
import com.cmpe275.termproject.Utilities.Utility.ForumMode;
import com.cmpe275.termproject.Utilities.Utility.ForumType;
import com.cmpe275.termproject.Utilities.Utility.ParticipantStatus;
import com.cmpe275.termproject.Utilities.Utility.ReviewType;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.cmpe275.termproject.Model.Request.CreateEventDetail;
import com.cmpe275.termproject.Model.Response.EventResponse;
import com.cmpe275.termproject.Model.Response.Response;
import com.cmpe275.termproject.Entity.Event;
import com.cmpe275.termproject.Entity.User;
import com.cmpe275.termproject.Entity.VirtualTime;
import com.cmpe275.termproject.Repository.EventRepo;
import com.cmpe275.termproject.Repository.UserRepo;
import com.cmpe275.termproject.Repository.VirtualTimeRepo;
import com.cmpe275.termproject.Utilities.Utility.EventStatus;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class EventService {
	
	@Autowired
	EventRepo eventRepo;
	
	@Autowired
	UserRepo userRepo;

	@Autowired
	ForumRepo forumRepo;
	
	@Autowired
	ReviewRepo reviewRepo;
	
	@Autowired
	ParticipantRepo participantRepo;

	@Autowired
	ForumService forumService;
	
	@Autowired
	private EntityManager entityManager;
	
	 @Autowired
	VirtualTimeRepo virtualTimeRepo;
	 
	 @Autowired
	 UserService userService;
	
	public ResponseEntity<?> submitEvent(CreateEventDetail event){
		System.out.println(event+ "==");
		try{
			
			User organizer = userRepo.findByUserId(event.getOrganizerId());
			Timestamp startTime = event.startTime;
			Timestamp endTime = event.endTime;
			Timestamp deadline = event.deadline;
			
			System.out.println("Start Time ---->" + startTime);
			System.out.println("End Time ---->" + endTime);
			System.out.println("DeadLine Time ---->" + deadline);
			
			int t1 = startTime.compareTo(endTime);
			int t2 = deadline.compareTo(startTime);
			
			if(t1>= 0) {
				Response fetchEventInvalidIdResponse = new Response("Starttime greater than End time", HttpStatus.NOT_FOUND);
				return new ResponseEntity<>(fetchEventInvalidIdResponse, HttpStatus.NOT_FOUND);
			}
			
			if(t2>= 0) {
				Response fetchEventInvalidIdResponse = new Response("Deadline greater than Start time", HttpStatus.NOT_FOUND);
				return new ResponseEntity<>(fetchEventInvalidIdResponse, HttpStatus.NOT_FOUND);
			}
			
			Map<Utility.ForumType, Forum> forums = new HashMap<>();

			Forum signUpForum = (Forum) forumService.submitForum(new Forum(0, Utility.ForumType.SIGNUP, Utility.ForumMode.OPEN)).getBody();
			Forum participantForum = (Forum) forumService.submitForum(new Forum(0, Utility.ForumType.PARTICIPANT, Utility.ForumMode.INACCESSIBLE)).getBody();

			forums.put(Utility.ForumType.SIGNUP, signUpForum);
			forums.put(Utility.ForumType.PARTICIPANT, participantForum);
			
			VirtualTime virtualTime = virtualTimeRepo.findFirstByOrderByVirtualTimeId();
			
			System.out.println("time to take: " + virtualTime.getVirtualTime());

//			if(organizer != null) {
				Event newEvent = new Event(0, event.title, event.description, event.startTime, event.endTime,
						event.deadline, virtualTime.getVirtualTime(), event.address, event.minParticipants, event.maxParticipants, event.fee, organizer,
						event.status, event.admissionPolicy, forums);

				Event createdEvent = eventRepo.save(newEvent);
				userService.sendEmail(organizer, "Event Created :" + createdEvent.getTitle(), "Your event has been successfully created.");
				signUpForum.setEvent(createdEvent);
				participantForum.setEvent(createdEvent);

				forumRepo.save(signUpForum);
				forumRepo.save(participantForum);

				return new ResponseEntity<>(createdEvent, HttpStatus.OK);
//			}
		
		} catch(Exception e){
			Response exceptionSubmitResponse = new Response("An exception occurred", HttpStatus.BAD_REQUEST);
			System.out.println(e);
			return new ResponseEntity<>(exceptionSubmitResponse, HttpStatus.BAD_REQUEST);
		}
	}
	
	public ResponseEntity<?> getEvent(long eventId){
		try{
			
			Event event = eventRepo.findByEventId(eventId);
			if (event==null){
				Response fetchEventInvalidIdResponse = new Response("Invalid Event ID", HttpStatus.NOT_FOUND);
				return new ResponseEntity<>(fetchEventInvalidIdResponse, HttpStatus.NOT_FOUND);
			}
			User u = userRepo.findByUserId(event.getOrganizer().getUserId());
			List<Review> reviews = reviewRepo.findReviewByGivenToUserAndReviewType(u, ReviewType.onOrganizer);
			int totalReviews = reviews.size();
			
			int ratingSum = 0;
			float avg = 0;
			if (totalReviews > 0) {
				for (Review review: reviews ) {
					ratingSum += review.getRating();
				}
				avg = (float) ratingSum / totalReviews;
			}
			List<Participant> participants = participantRepo.findByEventId(eventId);
			return new ResponseEntity<>(new EventResponse(event, avg, participants), HttpStatus.OK);
		
		} catch(Exception e){
			Response exceptionSubmitResponse = new Response("An exception occurred", HttpStatus.BAD_REQUEST);
			System.out.println(e);
			return new ResponseEntity<>(exceptionSubmitResponse, HttpStatus.BAD_REQUEST);
		}
	}
	
	
	public ResponseEntity<?> deleteEvent(long eventId){
		try{
			Event event = eventRepo.findByEventId(eventId);
			System.out.println(event+ ":event");
			if (event==null){
				Response fetchEventInvalidIdResponse = new Response("Event ID not found", HttpStatus.NOT_FOUND);
				return new ResponseEntity<>(fetchEventInvalidIdResponse, HttpStatus.NOT_FOUND);
			}
			eventRepo.deleteById(eventId);
			return new ResponseEntity<>(event, HttpStatus.OK);
		
		} catch(Exception e){
			Response exceptionSubmitResponse = new Response("An exception occurred", HttpStatus.BAD_REQUEST);
			System.out.println(e);
			return new ResponseEntity<>(exceptionSubmitResponse, HttpStatus.BAD_REQUEST);
		}
	}
	
	
	public ResponseEntity<?> searchEvent(String location, String status, String startTime, String endTime, String creationTime, String keyword, String organizer, Long organizerId, String deadline){

		try {
			
//			Keyword: you should have a search text box to take queries from the user for keyword search. 
//			This search needs to partially match (be a substring of) against at least the title and description fields. 
//			Case needs to be ignored for matching. You do not have to support stemming. When not given, it is ignored, hence matches everything.
			
			CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
			CriteriaQuery<Event> criteriaQuery = criteriaBuilder.createQuery(Event.class);
			Root<Event> root = criteriaQuery.from(Event.class);
			List<Event> events = new ArrayList<Event>();
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
			
			System.out.println("Keyword ->" +keyword);

//			String location = personSearchRequestModel.getFirstName();
//			String lastName = personSearchRequestModel.getLastName();
//			LocalDate startRangeDateOfBirth = personSearchRequestModel.getStartRangeBirthDate();
//			LocalDate endRangeDateOfBirth = personSearchRequestModel.getEndRangeBirthDate();
//			Long mobile = personSearchRequestModel.getMobile();
			
			/*
			 *  Adding search criteria's for query using CriteriaBuilder
			 *  
			 *  
			 */
			List<Predicate> searchCriterias = new ArrayList<>();
			
			List<Predicate> keywordCriterias = new ArrayList<>();

			List<Predicate> finalCriterias = new ArrayList<>();
			
			Predicate predicateForKeyword = null;

			
			if( (keyword != "") && (keyword != null) ) {
				keywordCriterias.add( criteriaBuilder.like( criteriaBuilder.lower(root.get("title")), "%"+keyword.toLowerCase()+"%") );
				keywordCriterias.add( criteriaBuilder.like( criteriaBuilder.lower(root.get("description")), "%"+keyword.toLowerCase()+"%") );
				keywordCriterias.add( criteriaBuilder.like( criteriaBuilder.lower(root.get("organizer").get("fullName")), "%"+keyword.toLowerCase()+"%") );
				predicateForKeyword = criteriaBuilder.or(keywordCriterias.toArray(new Predicate[] {}));
				searchCriterias.add(predicateForKeyword);

				
			}
			
			if( (location != "") && (location != null) && !location.equalsIgnoreCase("All") ) {
				searchCriterias.add( criteriaBuilder.equal( root.get("address").get("city"), location));
			}
			
			
			if ((status!= "") &&( status != null) && !status.equalsIgnoreCase("All")) {
				searchCriterias.add( criteriaBuilder.equal( root.get("status"), EventStatus.valueOf(status)));
			}
			if (startTime ==null && endTime!=null) {
				Date startDate = new Date();
				Date endDate = formatter.parse(endTime);

				searchCriterias.add(criteriaBuilder.between( root.get("startTime"), startDate, endDate));
			}
			if(startTime!=null && endTime!=null) {
				Date startDate=formatter.parse(startTime);
				Date endDate= formatter.parse(endTime);
				searchCriterias.add( criteriaBuilder.between( root.get("startTime"), startDate, endDate) );
			}
				
			if(startTime!=null && endTime==null) {
				Date startDate=formatter.parse(startTime);
//				greaterThanOrEqualTo(pageRoot.get("activeEndDate").as(Date.class), beforeEndDate))				
				searchCriterias.add( criteriaBuilder.greaterThanOrEqualTo( root.get("startTime").as(Date.class), startDate) );
			}
			
			if(creationTime!= null) {
				Date creationDate = formatter.parse(creationTime);
//				greaterThanOrEqualTo(pageRoot.get("activeEndDate").as(Date.class), beforeEndDate))				
				searchCriterias.add( criteriaBuilder.greaterThanOrEqualTo( root.get("creationTime").as(Date.class), creationDate) );
			}
			
			if(deadline!= null) {
				Date deadlineDate = formatter.parse(deadline);
//				greaterThanOrEqualTo(pageRoot.get("activeEndDate").as(Date.class), beforeEndDate))				
				searchCriterias.add( criteriaBuilder.greaterThanOrEqualTo( root.get("deadline").as(Date.class), deadlineDate) );
			}
			
			if (organizer!=null && organizer!="" && !organizer.equalsIgnoreCase("All")) {
				searchCriterias.add(criteriaBuilder.like( root.get("organizer").get("fullName"), "%"+organizer+"%"));

			}
			
			if (organizerId!=null) {
				System.err.println("Coming inside organizerid: "+organizerId);
				searchCriterias.add(criteriaBuilder.equal( root.get("organizer").get("userId"), organizerId));

			}
				
			Predicate finalPredicate = criteriaBuilder.and(searchCriterias.toArray(new Predicate[] {}));
			criteriaQuery.where(finalPredicate);

			
			events = entityManager.createQuery(criteriaQuery).getResultList();
			
			
			return new ResponseEntity<>(events, HttpStatus.OK);
			
		} catch(Exception e) {
			Response exceptionSubmitResponse = new Response("An exception occurred", HttpStatus.BAD_REQUEST);
			System.out.println(e);
			return new ResponseEntity<>(exceptionSubmitResponse, HttpStatus.BAD_REQUEST);			
		}
		
	}
	
	public ResponseEntity<?> eventSignup(long eventId, long userId ) {	
		try {
			Event event = eventRepo.findByEventId(eventId);
			if (event==null){
				Response fetchEventInvalidIdResponse = new Response("Event ID not found", HttpStatus.NOT_FOUND);
				return new ResponseEntity<>(fetchEventInvalidIdResponse, HttpStatus.NOT_FOUND);
			}
			User user = userRepo.findByUserId(userId);
			if (user==null){
				Response fetchEventInvalidIdResponse = new Response("User not found", HttpStatus.NOT_FOUND);
				return new ResponseEntity<>(fetchEventInvalidIdResponse, HttpStatus.NOT_FOUND);
			}
			
			VirtualTime virtualTime = virtualTimeRepo.findFirstByOrderByVirtualTimeId();

			System.err.println(event);
			System.err.println(user);
			
		    Set<Event> participatedEvents = user.getParticipatedEvents();
		    participatedEvents.add(event);
		    
		    user.setParticipatedEvents(participatedEvents);
			User savedUser = userRepo.save(user);
		    event.getParticipants().add(savedUser);

			event = eventRepo.save(event);
			
			//Get created participant from participant table by composite ID, then set status and save again
			Participant participant = participantRepo.findByEventIdAndUserId(eventId, userId);
			if (event.getAdmissionPolicy().equals(AdmissionPolicy.AR)) {
				participant.setParticipantStatus(ParticipantStatus.Pending);
			} else {
				participant.setParticipantStatus(ParticipantStatus.Enrolled);
			}
			
			participant.setTimestamp(virtualTime.getVirtualTime());
			participantRepo.save(participant);
			userService.sendEmail(savedUser, "Event SignUp:" + event.getTitle(), "You have successfully signed up for the event.");
			System.err.println("participated events");
			System.err.println(userRepo.findByUserId(userId).getParticipatedEvents());
			
			User u = userRepo.findByUserId(event.getOrganizer().getUserId());
			List<Review> reviews = reviewRepo.findReviewByGivenToUserAndReviewType(u, ReviewType.onOrganizer);
			int totalReviews = reviews.size();
			
			int ratingSum = 0;
			float avg = 0;
			if (totalReviews > 0) {
				for (Review review: reviews ) {
					ratingSum += review.getRating();
				}
				avg = (float) ratingSum / totalReviews;
			}
			List<Participant> participants = participantRepo.findByEventId(eventId);
			return new ResponseEntity<>(new EventResponse(event, avg, participants), HttpStatus.OK);
			
		} catch(Exception e) {
			Response exceptionSubmitResponse = new Response("An exception occurred", HttpStatus.BAD_REQUEST);
			System.out.println(e);
			return new ResponseEntity<>(exceptionSubmitResponse, HttpStatus.BAD_REQUEST);			
		}
		
	}
	
	public ResponseEntity<?> changeParticipantStatus(ObjectNode jsonBody) {
		try {
			long eventId = jsonBody.get("eventId").asLong();
			long userId = jsonBody.get("participantId").asLong();
			boolean approve = jsonBody.get("approve").asBoolean();
			VirtualTime virtualTime = virtualTimeRepo.findFirstByOrderByVirtualTimeId();

			User user  = userRepo.findByUserId(userId);
			
			Participant p = participantRepo.findByEventIdAndUserId(eventId, userId);
			String errorMsg = "";
			if (p.getParticipantStatus().equals(ParticipantStatus.Pending)) {
				Event e = eventRepo.findByEventId(eventId);
				if (approve) {
					if (e.getMaxParticipants() <= e.getParticipants().size()) {
						errorMsg = "Maximum participant limit already reached";
						Response exceptionSubmitResponse = new Response(errorMsg, HttpStatus.BAD_REQUEST);
						return new ResponseEntity<>(exceptionSubmitResponse, HttpStatus.BAD_REQUEST);
					} 
					userService.sendEmail(user, "Successfully Enrolled for the Event. " + e.getTitle(), "You are successful enrolled for event :" + e.getTitle()  );
					p.setParticipantStatus(ParticipantStatus.Enrolled);
				} else {
					userService.sendEmail(user, "Enrollment request rejected for " + e.getTitle(), "Sorry, your enrollment request has been rejected for the event: " + e.getTitle()  );
					p.setParticipantStatus(ParticipantStatus.Reject);
				}
				p.setTimestamp(virtualTime.getVirtualTime());
				participantRepo.save(p);
			} else {
				Response exceptionSubmitResponse = new Response("Request is not in pending request", HttpStatus.BAD_REQUEST);
				return new ResponseEntity<>(exceptionSubmitResponse, HttpStatus.BAD_REQUEST);
			}
			
			return new ResponseEntity<>(p, HttpStatus.OK);
		} catch(Exception e) {
			Response exceptionSubmitResponse = new Response("An exception occurred"+ e.toString(), HttpStatus.BAD_REQUEST);
			System.out.println(e);
			return new ResponseEntity<>(exceptionSubmitResponse, HttpStatus.BAD_REQUEST);
		}
		
		
	}
	
	
	// API to mimick Time by changing all the Event status in our db
	public ResponseEntity<?> updateDbEvent(Timestamp currentTime) {
		try {
			List<Event> events = (List<Event>) searchEvent(null, null, null, null, null, null, null, null,null).getBody();
			System.out.println(events);
			for (Event e: events) {
//				System.out.println("=====5");
				EventStatus previousStatus = e.getStatus();
				EventStatus newStatus = getEventCurrentStatus(currentTime, e);
				
				
//				 System.out.println("new status"+ newStatus + e.getEventId());
				if (previousStatus != newStatus) {
					//new status cancel -> all participants of event.
					Set<User> users = e.getParticipants();
					Iterator<User> userItr = users.iterator();
					if(newStatus==Utility.EventStatus.OPEN) {

						while(userItr.hasNext()) {
							userService.sendEmail(userItr.next(), "Event Status has been changed." + e.getTitle(), "The event status has been changed to open." );
						}
					}else if(newStatus==Utility.EventStatus.CLOSED) {
						while(userItr.hasNext()) {
							userService.sendEmail(userItr.next(), "Event Status has been changed." + e.getTitle(), "The event status has been changed to closed." );
						}

					}else if(newStatus==Utility.EventStatus.ONGOING) {
						while(userItr.hasNext()) {
							userService.sendEmail(userItr.next(), "Event Status has been changed." + e.getTitle(), "The event status has been changed to ongoing." );
						}

					}else if(newStatus==Utility.EventStatus.FINISHED) {
						while(userItr.hasNext()) {
							userService.sendEmail(userItr.next(), "Event Status has been changed." + e.getTitle(), "The event status has been changed to finished." );
						}

					}else if(newStatus==Utility.EventStatus.CANCELED) {
						while(userItr.hasNext()) {
							userService.sendEmail(userItr.next(), "Event Status has been changed." + e.getTitle(), "The event status has been changed to canceled." );
						}

					}
					e.setStatus(newStatus);
					e.setForums(forumService.setForumMode(e, currentTime));
					eventRepo.save(e);
				} else if((currentTime.getTime() - e.getEndTime().getTime() >= 259200000) && e.getForums().get(ForumType.PARTICIPANT).getForumMode()==ForumMode.OPEN) {
					e.setForums(forumService.setForumMode(e, currentTime));
					eventRepo.save(e);
				}
			}

			return new ResponseEntity<>("Event status changed", HttpStatus.OK);
		} catch(Exception e) {
			Response exceptionSubmitResponse = new Response("An exception occurred"+ e.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
			System.out.println(e);
			return new ResponseEntity<>(exceptionSubmitResponse, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	
	// Function to check what will be the status of the Event given currentTime, and event
	public EventStatus getEventCurrentStatus(Timestamp currentTime, Event e) {
		
		Timestamp deadline = e.getDeadline();
		Timestamp startTime = e.getStartTime();
		Timestamp endTime = e.getEndTime();
		// System.out.println("deadline"+deadline);
		// System.out.println("currentTime"+ currentTime);


		int t1 = currentTime.compareTo(deadline);
		// System.out.println("t1"+ t1);
		int t2 = currentTime.compareTo(startTime);
		int t3 = currentTime.compareTo(endTime);
		
//		if(e.getEventId()==80) {
//			System.out.println("Start Time ---->" + startTime);
//			System.out.println("End Time ---->" + endTime);
//			System.out.println("DeadLine Time ---->" + deadline);
//			System.out.println("Current Time ---->" + currentTime);
//			System.out.println("t1" + t1);
//			System.out.println("t2" + t2);
//			System.out.println("t3" + t3);
//		}

		
		// check whether the event is before the deadline => than status should be open
		if (t1<0) {
			return EventStatus.OPEN;
		} else if (isCancellable(currentTime, e)) {
			return EventStatus.CANCELED;
		} else if (t2 < 0) {
			return EventStatus.CLOSED;
		} else if(t3 <0) {
			return EventStatus.ONGOING;
		} else {
			return EventStatus.FINISHED;
		}
	}
	
	// function to check whether the Event is cancellable or not
	public boolean isCancellable(Timestamp currentTime, Event e) {
		int min = e.getMinParticipants();
		int totalParticipant = e.getParticipants().size();
		Timestamp deadline = e.getDeadline();
		int t1 = currentTime.compareTo(deadline);
		if (totalParticipant < min && t1 >= 0) {
			return true;
		}
		return false;
	}

	public ResponseEntity<?> getPast90DaysEvents(String creationTime) throws ParseException {
//		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
//		CriteriaQuery<Event> criteriaQuery = criteriaBuilder.createQuery(Event.class);
//		Root<Event> root = criteriaQuery.from(Event.class);
//		List<Event> events = new ArrayList<Event>();
//		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
//		
//		List<Predicate> searchCriterias = new ArrayList<>();
		
//		if(creationTime!= null) {
//			Date creationDate = formatter.parse(creationTime);
////			greaterThanOrEqualTo(pageRoot.get("activeEndDate").as(Date.class), beforeEndDate))				
//			searchCriterias.add( criteriaBuilder.greaterThanOrEqualTo( root.get("creationTime").as(Date.class), creationDate) );
//		}
		
//		Predicate finalPredicate = criteriaBuilder.and(searchCriterias.toArray(new Predicate[] {}));
//		criteriaQuery.where(finalPredicate);
//		events = entityManager.createQuery(criteriaQuery).getResultList();
//		
//		
//		return new ResponseEntity<>(events, HttpStatus.OK);
//		
		return null;
	}

	
}
