package com.cmpe275.termproject.Entity;

import javax.persistence.Embeddable;

@Embeddable
public class Address {
	private String number;
    private String street;
    private String city;
    private String state;
    private String zip;

    public Address() {
    	super();
    }
    
	public Address(String street, String number, String city, String state, String zip) {
		super();
		this.street = street;
		this.city = city;
		this.state = state;
		this.zip = zip;
		this.number = number;
	}
	

	public String getStreet() {
		return street;
	}
	public void setStreet(String street) {
		this.street = street;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getZip() {
		return zip;
	}
	public void setZip(String zip) {
		this.zip = zip;
	}
	public String getNumber() {
		return number;
	}
	public void setNumber(String number) {
		this.number = number;
	}
}
