
package com.cmpe275.termproject.Entity;

import java.io.Serializable;
import java.util.Objects;

public class ParticipantId implements Serializable{
	private long userId;
	private long eventId;
	
	public ParticipantId(long userId, long eventId) {
		super();
		this.userId = userId;
		this.eventId = eventId;
	}
	
	public ParticipantId() {
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(eventId, userId);
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ParticipantId other = (ParticipantId) obj;
		return eventId == other.eventId && userId == other.userId;
	}
	
	

}
