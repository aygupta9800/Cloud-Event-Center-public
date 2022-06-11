package com.cmpe275.termproject.Service;

import java.sql.Timestamp;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cmpe275.termproject.Entity.VirtualTime;
import com.cmpe275.termproject.Repository.VirtualTimeRepo;

@Service
public class VirtualTimeService {
	
	@Autowired
	private VirtualTimeRepo virtualTimeRepo;
	
	public Timestamp appTime = null;
	public boolean setTime = true;
	public static final long duration = (60*60) * 1000;  //millisec
	
	
	public Timestamp setDefaultTime(){
		
		if(setTime==true) {
			// For setting time for application
				if(appTime==null) {
					// for setting time initially
					Date date = new Date();
					Timestamp appTime = new Timestamp(date.getTime());
					//System.out.println(appTime);
					VirtualTime virtualTime = virtualTimeRepo.findFirstByOrderByVirtualTimeId();
					
					if(virtualTime == null) {
						virtualTime = new VirtualTime(appTime);
					}
					
					else {
						virtualTime.setVirtualTime(appTime);
					}
					
					virtualTimeRepo.save(virtualTime);
					
					return appTime;
				}else {
					// updating time by 1 hour.
					
					appTime.setTime(appTime.getTime() + duration);
					
					VirtualTime virtualTime = virtualTimeRepo.findFirstByOrderByVirtualTimeId();
					
					System.out.println("virtual time = " + virtualTime.getvirtualTimeId());
					
					virtualTime.setVirtualTime(appTime);
					virtualTimeRepo.save(virtualTime);
					
					System.out.println(appTime);
					return appTime;
				}
		}else {

			setTime = true;
			return appTime;
		}
	}
	
	public Timestamp setByUserTime(Timestamp timeStamp){
		appTime = timeStamp;
		setTime=false;
		
		VirtualTime virtualTime = virtualTimeRepo.findFirstByOrderByVirtualTimeId();
		
		virtualTime.setVirtualTime(appTime);
		virtualTimeRepo.save(virtualTime);
		
		System.out.println(appTime);
		return appTime;
	}
}
