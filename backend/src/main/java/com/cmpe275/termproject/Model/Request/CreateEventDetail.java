package com.cmpe275.termproject.Model.Request;

import java.sql.Timestamp;

import com.cmpe275.termproject.Entity.Address;
import com.cmpe275.termproject.Utilities.Utility.AdmissionPolicy;
import com.cmpe275.termproject.Utilities.Utility.EventStatus;

public class CreateEventDetail {
	
	public String title;
	
	public String description;
	
	public Timestamp startTime;
	
	public Timestamp endTime;
	
	public Timestamp deadline;
	
	public Address address;
	
	public int minParticipants;
	
	public int maxParticipants;
	
	public float fee;
	
	public long organizerId;
	
	public EventStatus status;
	
	public EventStatus getStatus() {
		return status;
	}

	public void setStatus(EventStatus status) {
		this.status = status;
	}

	public AdmissionPolicy admissionPolicy;

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

	public long getOrganizerId() {
		return organizerId;
	}

	public void setOrganizerId(long organizerId) {
		this.organizerId = organizerId;
	}

	public AdmissionPolicy getAdmissionPolicy() {
		return admissionPolicy;
	}

	public void setAdmissionPolicy(AdmissionPolicy admissionPolicy) {
		this.admissionPolicy = admissionPolicy;
	}

}
