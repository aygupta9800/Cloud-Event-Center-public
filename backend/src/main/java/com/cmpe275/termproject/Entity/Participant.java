package com.cmpe275.termproject.Entity;


import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;

import com.cmpe275.termproject.Utilities.Utility.ParticipantStatus;


@Entity(name="Participant")
@IdClass(ParticipantId.class)
public class Participant {
	
	@Id
	private long eventId;
	
	@Id
	private long userId;
	
	private ParticipantStatus participantStatus;
	
	private Timestamp timestamp;

	
	public Participant() {
		
	}

	public Participant(long eventId, long userId, ParticipantStatus participantStatus) {
		super();
		this.eventId = eventId;
		this.userId = userId;
		this.participantStatus = participantStatus;
	}

	public long getEventId() {
		return eventId;
	}

	public void setEventId(long eventId) {
		this.eventId = eventId;
	}

	public long getUserId() {
		return userId;
	}

	public void setUserId(long userId) {
		this.userId = userId;
	}

	public ParticipantStatus getParticipantStatus() {
		return participantStatus;
	}

	public void setParticipantStatus(ParticipantStatus participantStatus) {
		this.participantStatus = participantStatus;
	}

	public Timestamp getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Timestamp timestamp2) {
		this.timestamp = timestamp2;
	}
	
}