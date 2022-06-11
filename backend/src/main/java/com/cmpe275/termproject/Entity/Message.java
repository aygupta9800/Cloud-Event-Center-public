package com.cmpe275.termproject.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

@Entity(name="Message")
public class Message {
    @Id
    @GeneratedValue
    private long messageId;

    private String participantName;

    private long participantID;

    private String message;
    private String imageURL;

    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="forumId")
    @JsonIgnoreProperties({"messages"})
    private Forum forum;

    private java.sql.Timestamp postedAt;

    @Transient
    private final SimpleDateFormat DATE_TIME_FORMAT = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    private java.sql.Timestamp parseTimeStamp(String timeStamp) {
        try {
            return new Timestamp(DATE_TIME_FORMAT.parse(timeStamp).getTime());
        } catch (ParseException e) {
            throw new IllegalArgumentException(e);
        }
    }


    public long getMessageId() {
        return messageId;
    }

    public void setMessageId(long messageId) {
        this.messageId = messageId;
    }

    public String getParticipantName() {
        return participantName;
    }

    public void setParticipantName(String participantName) {
        this.participantName = participantName;
    }

    public long getParticipantID() {
        return participantID;
    }

    public void setParticipantID(long participantID) {
        this.participantID = participantID;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    public Timestamp getPostedAt() {
        return postedAt;
    }

    public void setPostedAt(Timestamp postedAt) {
        this.postedAt = postedAt;
    }

    public Forum getForum() {
        return forum;
    }

    public void setForum(Forum forum) {
        this.forum = forum;
    }

    public long getUserId(){
        return participantID;
    }
}
