package com.cmpe275.termproject.Entity;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.cmpe275.termproject.Utilities.Utility.ReviewType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
public class Review {
	
	@Id
	@GeneratedValue
	private long reviewId;
	
	@ManyToOne
	@JoinColumn(name="eventId", nullable= false)
	@OnDelete(action=OnDeleteAction.CASCADE)
	private Event event;
	// one to many mapping with user
	public Review() {
		
	}
	
	public Review(long reviewId, Event event, User givenByUser, User givenToUser, String reviewText, int rating,
			Timestamp reviewTime, ReviewType reviewType) {
		super();
		this.reviewId = reviewId;
		this.event = event;
		this.givenByUser = givenByUser;
		this.givenToUser = givenToUser;
		this.reviewText = reviewText;
		this.rating = rating;
		this.reviewTime = reviewTime;
		this.reviewType = reviewType;
	}


	public Event getEvent() {
		return event;
	}

	public void setEvent(Event event) {
		this.event = event;
	}

	@ManyToOne
    @JoinColumn(name="givenByUserId", nullable=false)
	@JsonIgnoreProperties({"organizedEvents", "participatedEvents"})
	private User givenByUser;
	
	// one to many mapping with user
	@ManyToOne
    @JoinColumn(name="givenToUserId", nullable=false)
	@JsonIgnoreProperties({"organizedEvents", "participatedEvents"})
	private User givenToUser;
	
	private String reviewText;
	
	private int rating;
	
	private Timestamp reviewTime;
	
	private ReviewType reviewType;
	
	// if only score can exist
	// boolean onlyRating
	
	
	public long getReviewId() {
		return reviewId;
	}

	public void setReviewId(long reviewId) {
		this.reviewId = reviewId;
	}

	public User getGivenByUser() {
		return givenByUser;
	}

	public void setGivenByUser(User givenByUser) {
		this.givenByUser = givenByUser;
	}

	public User getGivenToUser() {
		return givenToUser;
	}

	public void setGivenToUser(User givenToUser) {
		this.givenToUser = givenToUser;
	}

	public String getReviewText() {
		return reviewText;
	}

	public void setReviewText(String reviewText) {
		this.reviewText = reviewText;
	}

	public int getRating() {
		return rating;
	}

	public void setRating(int rating) {
		this.rating = rating;
	}

	public Timestamp getReviewTime() {
		return reviewTime;
	}

	public void setReviewTime(Timestamp reviewTime) {
		this.reviewTime = reviewTime;
	}

	public ReviewType getReviewType() {
		return reviewType;
	}

	public void setReviewType(ReviewType reviewType) {
		this.reviewType = reviewType;
	}


}
