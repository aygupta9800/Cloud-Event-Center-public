package com.cmpe275.termproject.Entity;

import java.sql.Timestamp;
import java.util.Map;
import java.util.Set;

import javax.persistence.*;

import com.cmpe275.termproject.Utilities.Utility;
import com.cmpe275.termproject.Utilities.Utility.AdmissionPolicy;
import com.cmpe275.termproject.Utilities.Utility.EventStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity(name="Event")
public class Event {
	
	@Id
	@GeneratedValue
	private long eventId;
	
	private String title;
	
	private String description;
	
	private Timestamp startTime;
	
	private Timestamp endTime;
	
	private Timestamp deadline;
	
	private Timestamp creationTime;
	
	@Embedded
	private Address address;
	
	private int minParticipants;

	private int maxParticipants;
	
	private float fee;
	
	@ManyToOne
    @JoinColumn(name="userId", nullable=false)
	@JsonIgnoreProperties({"organizedEvents", "participatedEvents"})
    private User organizer;
	
	private EventStatus status;

	@OneToMany(cascade = CascadeType.ALL, fetch= FetchType.EAGER)
	@JoinTable(name = "event_forum_mapping",
			joinColumns = {@JoinColumn(name = "eventId")})
			//inverseJoinColumns = {@JoinColumn(name = "forumId")})
	@MapKey(name = "forumType")
	@JsonIgnoreProperties({"event", "messages"})
	private Map<Utility.ForumType, Forum> forums;
    
    @ManyToMany(targetEntity = User.class , fetch= FetchType.EAGER, cascade = CascadeType.ALL)
	@JsonIgnoreProperties({"participatedEvents, organizedEvents"})
    @JoinTable(
//      name = "event_participant", 
      name="participant",
      joinColumns = @JoinColumn(name = "eventId", referencedColumnName = "eventId"), 
      inverseJoinColumns = @JoinColumn(name = "userId", referencedColumnName="userId"))
    private Set<User> participants;

	private AdmissionPolicy admissionPolicy;

	public Event(){
		this.forums = null;
	}

	public Event(long eventId, String title, String description, Timestamp startTime, Timestamp endTime,
				 Timestamp deadline, Timestamp creationTime, Address address, int minParticipants, int maxParticipants, float fee, User organizer,
				 EventStatus status, AdmissionPolicy admissionPolicy, Map<Utility.ForumType, Forum> forums) {

		this.eventId = eventId;
		this.title = title;
		this.description = description;
		this.startTime = startTime;
		this.endTime = endTime;
		this.deadline = deadline;
		this.address = address;
		this.minParticipants = minParticipants;
		this.maxParticipants = maxParticipants;
		this.fee = fee;
		this.organizer = organizer;
		this.status = status;
		this.admissionPolicy = admissionPolicy;
		this.forums = forums;
		this.creationTime = creationTime;
		
	}

	public long getEventId() {
		return eventId;
	}
	public void setEventId(long eventId) {
		this.eventId = eventId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Timestamp getStartTime() {
		return startTime;
	}
	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}
	public Timestamp getEndTime() {
		return endTime;
	}
	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}
	public Timestamp getDeadline() {
		return deadline;
	}
	public void setDeadline(Timestamp deadline) {
		this.deadline = deadline;
	}
	public Address getAddress() {
		return address;
	}
	public void setAddress(Address address) {
		this.address = address;
	}
	public int getMinParticipants() {
		return minParticipants;
	}
	public void setMinParticipants(int minParticipants) {
		this.minParticipants = minParticipants;
	}
	public int getMaxParticipants() {
		return maxParticipants;
	}
	public void setMaxParticipants(int maxParticipants) {
		this.maxParticipants = maxParticipants;
	}
	public float getFee() {
		return fee;
	}
	public void setFee(float fee) {
		this.fee = fee;
	}
	public User getOrganizer() {
		return organizer;
	}
	public void setOrganizer(User organizer) {
		this.organizer = organizer;
	}
	public EventStatus getStatus() {
		return status;
	}
	public void setStatus(EventStatus status) {
		this.status = status;
	}
	public Set<User> getParticipants() {
		return participants;
	}
	public void setParticipants(Set<User> participants) {
		this.participants = participants;
	}
	public AdmissionPolicy getAdmissionPolicy() {
		return admissionPolicy;
	}
	public void setAdmissionPolicy(AdmissionPolicy admissionPolicy) {
		this.admissionPolicy = admissionPolicy;
	}

	public Map<Utility.ForumType, Forum> getForums() {
		return forums;
	}
	
	public void setForums(Map<Utility.ForumType, Forum> forums) {
		this.forums = forums;
	}
	
	public Timestamp getCreationTime() {
		return creationTime;
	}

	public void setCreationTime(Timestamp creationTime) {
		this.creationTime = creationTime;
	}

}
