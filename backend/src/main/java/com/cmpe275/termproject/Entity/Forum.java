package com.cmpe275.termproject.Entity;

import javax.persistence.*;
import com.cmpe275.termproject.Utilities.Utility.ForumType;
import com.cmpe275.termproject.Utilities.Utility.ForumMode;
import com.cmpe275.termproject.Entity.Event;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;
import java.util.List;

@Entity(name="Forum")
public class Forum {
    @Id
    @GeneratedValue
    private long forumId;
    private ForumType forumType;
    private ForumMode forumMode;
    private String description;

    @ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="eventId")
    @JsonIgnoreProperties({"forums", "address", "minParticipants", "maxParticipants", "fee", "organizer", "participants", "admissionPolicy"})
    private Event event;

    @OneToMany(targetEntity=Message.class, mappedBy="forum", fetch=FetchType.EAGER)
    @JsonIgnoreProperties({"forum"})
    private List<Message> messages;

    public Forum() {
        super();
    }

    public Forum(long forumId, ForumType forumType, ForumMode forumMode){
        this.forumId = forumId;
        this.forumType = forumType;
        this.forumMode = forumMode;
    }

    public long getForumId() {
        return forumId;
    }

    public void setForumId(long forumId) {
        this.forumId = forumId;
    }

    public ForumType getForumType() {
        return forumType;
    }

    public void setForumType(ForumType forumType) {
        this.forumType = forumType;
    }

    public ForumMode getForumMode() {
        return forumMode;
    }

    public void setForumMode(ForumMode forumMode) {
        this.forumMode = forumMode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public void addMessage(Message message){
        if(this.messages == null || this.messages.isEmpty() == true){
            this.messages = new ArrayList<>();
        }

        this.messages.add(message);
    }

}
