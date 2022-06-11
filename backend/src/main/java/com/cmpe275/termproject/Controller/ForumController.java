package com.cmpe275.termproject.Controller;

import com.cmpe275.termproject.Entity.VirtualTime;
import com.cmpe275.termproject.Model.Response.Response;
import com.cmpe275.termproject.Repository.VirtualTimeRepo;
//import com.cmpe275.termproject.Service.FileService;
import com.cmpe275.termproject.Service.ForumService;
import com.cmpe275.termproject.Service.VirtualTimeService;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/forum")
@CrossOrigin
public class ForumController {

    @Autowired
    private ForumService forumService;

//    @Autowired
//    private FileService fileService;
    
    @Autowired
	VirtualTimeService virtualTimeService;
    
    @Autowired
	VirtualTimeRepo virtualTimeRepo;

    @GetMapping
    private ResponseEntity<?> getForum(@RequestParam(required = true) long forumId, @RequestParam(required = true) long userId){
    	
    	try {
    			return forumService.getForum(forumId, userId);
    		
    		} catch(Exception e) {
    			Response exceptionSubmitResponse = new Response("An exception occurred", HttpStatus.INTERNAL_SERVER_ERROR);
    			System.out.println(e);
    			return new ResponseEntity<>(exceptionSubmitResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    		}
    }

    @PostMapping("/upload")
    public Object upload(@RequestParam("file") MultipartFile multipartFile) {
        System.out.println("HIT -/upload | File Name : " + multipartFile.getOriginalFilename());
        //return fileService.upload(multipartFile);
        return null;
    }

    @PostMapping("/postmessage")
    public ResponseEntity<?> postMessage(@RequestBody ObjectNode jsonBody){
        long participantID = jsonBody.get("participantID").asLong();
        String participantName = jsonBody.get("participantName").asText();
        String message = jsonBody.get("message").asText();
        String imageURL = jsonBody.get("imageURL").asText();
        long forumId = jsonBody.get("forumId").asLong();
        return forumService.postMessage(forumId, participantID, participantName, message, imageURL);
    }
    
    
    @PutMapping("/closeParticipantForum")
	private ResponseEntity<?> closeParticipantForum(@RequestBody ObjectNode jsonBody) {
    
    	long forumId = jsonBody.get("forumId").asLong();
    	long userId = jsonBody.get("userId").asLong();
    	
    	VirtualTime virtualTime = virtualTimeRepo.findFirstByOrderByVirtualTimeId();
		
		System.out.println("time to take: " + virtualTime.getVirtualTime());
    	
		return forumService.closeParticipantForum(forumId, userId, virtualTime.getVirtualTime());
		
	}
	

//    @GetMapping("/getmessages")
//    public ResponseEntity<?> getMessages(@PathVariable long forumId)

//    @GetMapping("/download/{fileName}")
//    public Object download(@PathVariable String fileName) throws IOException {
//        System.out.println("HIT -/download | File Name : " + fileName);
//        return fileService.download(fileName);
//    }







}
