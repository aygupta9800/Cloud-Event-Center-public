package com.cmpe275.termproject.Utilities;

public class Utility {

	public boolean isEmpty(String s) {
		return s.trim().length() == 0;
	}
	
    public enum AccountType{
        PERSON,
        ORGANIZATION
    }
	
    public enum Gender {
        MALE,
        FEMALE
    }

    public enum EventStatus {
        OPEN,
        CLOSED,
        ONGOING,
        FINISHED,
        CANCELED
    }
    
    public enum AdmissionPolicy{
    	FCFS,
    	AR
    }

    public enum ForumType {
        SIGNUP,
        PARTICIPANT
    }

    public enum ForumMode {
        READONLY,
        OPEN,
        INACCESSIBLE
    }
    
    public enum ParticipantStatus {
    	Enrolled,
    	Pending,
    	Reject
    }
    
    public enum ReviewType {
    	onParticipant,
    	onOrganizer
    }
}
