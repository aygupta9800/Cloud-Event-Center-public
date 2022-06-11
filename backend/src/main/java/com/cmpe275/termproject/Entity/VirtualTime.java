package com.cmpe275.termproject.Entity;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;


@Entity
public class VirtualTime {
	
	@Id
	@GeneratedValue
	private long virtualTimeId;
	
	private Timestamp virtualTime;
	
	public VirtualTime() {}
		
	
	public VirtualTime(Timestamp virtualTime) {
		this.virtualTime = virtualTime;
	}

	public long getvirtualTimeId() {
		return virtualTimeId;
	}


	public Timestamp getVirtualTime() {
		return virtualTime;
	}

	public void setVirtualTime(Timestamp virtualTime) {
		this.virtualTime = virtualTime;
	}
}
