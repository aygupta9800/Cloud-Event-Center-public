package com.cmpe275.termproject.Repository;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.cmpe275.termproject.Entity.Event;
import com.cmpe275.termproject.Entity.UserStats;

@Repository
public interface EventRepo extends CrudRepository<Event, Long> {
	Event save(Event event);
	Event findByEventId(Long eventId);
	Event deleteByEventId(Long eventId);
	
//	Number of created events (based on creation time) and the percentage of paid events.
//	Number of canceled events (based on registration deadline) and total number of participation requests (regardless of approval or not) divided by the total number of minimum participants for such events.
//	Number of finished events (based on finishing time), and the average number of participants of these events.  
//	Number of paid events finished (based on finishing time) and total revenue from these events.
	
	
	@Query(value = " SELECT * from event AS e \n"
			+ "WHERE e.user_id = :userId AND e.status=:eventStatus and e.end_time>=:endDate Order by e.end_time ", nativeQuery = true)
	List<Event> countFinishedEvent(Long userId, int eventStatus, Timestamp endDate);

}
