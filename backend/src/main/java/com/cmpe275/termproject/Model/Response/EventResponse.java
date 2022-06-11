package com.cmpe275.termproject.Model.Response;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;

import com.cmpe275.termproject.Entity.Address;
import com.cmpe275.termproject.Entity.Event;
import com.cmpe275.termproject.Entity.Forum;
import com.cmpe275.termproject.Entity.Participant;
import com.cmpe275.termproject.Entity.User;
import com.cmpe275.termproject.Utilities.Utility;
import com.cmpe275.termproject.Utilities.Utility.AdmissionPolicy;
import com.cmpe275.termproject.Utilities.Utility.EventStatus;

public class EventResponse {
    public long eventId;
    public String title;
    public String description;
    public Timestamp startTime;
    public Timestamp endTime;
    public Timestamp deadline;
    public Timestamp creationTime;
    public float fee;
    public Address address;
    public int minParticipants;
    public int maxParticipants;
    public User organizer;
    public Map<Utility.ForumType, Forum> forums;
    public List<Participant> participants;
    public AdmissionPolicy admissionPolicy;
    public EventStatus status;
    public float organizerReputationScore;
    public HttpStatus statusCode;
  
    
    public EventResponse(Event e, float organizerReputationScore, List<Participant> participants){
    	this.eventId = e.getEventId();
    	this.title = e.getTitle();
    	this.description = e.getDescription();
    	this.startTime = e.getStartTime();
    	this.deadline = e.getDeadline();
    	this.creationTime = e.getCreationTime();
    	this.endTime = e.getEndTime();
    	this.address =e.getAddress();
    	this.minParticipants = e.getMinParticipants();
    	this.maxParticipants = e.getMaxParticipants();
    	this.forums = e.getForums();
    	this.participants = participants;
    	this.admissionPolicy = e.getAdmissionPolicy();
    	this.organizer = e.getOrganizer();
    	this.fee = e.getFee();
    	this.status = e.getStatus();
		this.organizerReputationScore = organizerReputationScore;
    }
}

