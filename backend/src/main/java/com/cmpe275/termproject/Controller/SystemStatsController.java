package com.cmpe275.termproject.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cmpe275.termproject.Entity.VirtualTime;
import com.cmpe275.termproject.Repository.VirtualTimeRepo;
import com.cmpe275.termproject.Service.SystemStatsService;


@RestController
@RequestMapping("/stats")
@CrossOrigin
public class SystemStatsController {

	@Autowired
	SystemStatsService systemStatsService;

	
	@Autowired
	VirtualTimeRepo virtualTimeRepo;
	
	@GetMapping("/system")
	private ResponseEntity<?> getSystemReport(){
		VirtualTime virtualTime = virtualTimeRepo.findFirstByOrderByVirtualTimeId();
		
		System.out.println("time to take: " + virtualTime.getVirtualTime());
		
		return systemStatsService.getSystemReport(virtualTime.getVirtualTime());
	}
	
}
