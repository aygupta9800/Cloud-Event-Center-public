package com.cmpe275.termproject.Entity;

import javax.persistence.*;

import com.cmpe275.termproject.Utilities.Utility.AccountType;
import com.cmpe275.termproject.Utilities.Utility.Gender;
import com.fasterxml.jackson.annotation.JsonIgnore;


import java.util.Set;

@Entity(name="User")
public class User {
	
	@Id
	@GeneratedValue
    private long userId;
	
	//@Column(nullable=false, columnDefinition="default User1")
    private String fullName;
    
    //@Column(unique=true, nullable=false)
    private String screenName;
    
   // @Column(unique=true, updatable=false, nullable=false)
    private String email; // cannot be changed
    
    private String password;

	private AccountType accountType;

    private Gender gender;

    private String description;

    @Embedded
    private Address address;

    @Column(name = "verification_code", length = 64)
    private String verificationCode;
     
    private boolean enabled;
    
    @OneToMany(mappedBy="organizer")
    @JsonIgnore
    private Set<Event> organizedEvents;

    @ManyToMany(targetEntity = Event.class, mappedBy = "participants", cascade=CascadeType.ALL)
	@JsonIgnore
    private Set<Event> participatedEvents;
    
    
    @OneToMany(mappedBy="givenToUser")
    @JsonIgnore
    private Set<Review> givenToReviews;
    
    @OneToMany(mappedBy="givenByUser")
    @JsonIgnore
    private Set<Review> givenByReviews;

    public Set<Review> getGivenToReviews() {
		return givenToReviews;
	}

	public void setGivenToReviews(Set<Review> givenToReviews) {
		this.givenToReviews = givenToReviews;
	}

	public Set<Review> getGivenByReviews() {
		return givenByReviews;
	}

	public void setGivenByReviews(Set<Review> givenByReviews) {
		this.givenByReviews = givenByReviews;
	}

	public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getScreenName() {
        return screenName;
    }

    public void setScreenName(String screenName) {
        this.screenName = screenName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Set<Event> getOrganizedEvents() {
        return organizedEvents;
    }

    public void setOrganizedEvents(Set<Event> organizedEvents) {
        this.organizedEvents = organizedEvents;
    }

    public Set<Event> getParticipatedEvents() {
        return participatedEvents;
    }
    
    public void addParticipatedEvents(Event event) {
    	this.participatedEvents.add(event);
    }

    public void setParticipatedEvents(Set<Event> participatedEvents) {
        this.participatedEvents = participatedEvents;
    }

	public String getVerificationCode() {
		return verificationCode;
	}

	public void setVerificationCode(String verificationCode) {
		this.verificationCode = verificationCode;
	}

	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}
    
}
