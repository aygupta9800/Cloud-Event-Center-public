package com.cmpe275.termproject.Repository;


import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.cmpe275.termproject.Entity.Participant;
import com.cmpe275.termproject.Entity.UserStats;
import com.cmpe275.termproject.Utilities.Utility.ParticipantStatus;


	//Number of rejects and approvals (based respective action time).
	//Number of finished events (based on finishing time).  
	//Organizer report.
	//Number of created events (based on creation time) and the percentage of paid events.
	//Number of canceled events (based on registration deadline) and total number of participation requests (regardless of approval or not) divided by the total number of minimum participants for such events.
	//Number of finished events (based on finishing time), and the average number of participants of these events.


@Repository
public interface ParticipantRepo extends CrudRepository<Participant, Long> {
	@SuppressWarnings("unchecked")
	Participant save(Participant participant);
	List<Participant> findByEventId(Long eventId);
//	List<Participant> findByEventIdAndUserId(Long eventId, User);
	List<Participant> findByUserId(Long userId);
	Participant findByEventIdAndUserId(Long eventId, Long userId);
	List<Participant> findByEventIdAndParticipantStatus(Long eventId, ParticipantStatus status);
	
//	@Query(value = "SELECT new com.cmpe275.termproject.Entity.UserStats(p.timestamp,COUNT(p.event_id))"
//			  + "FROM participant AS p WHERE p.user_id = :userId GROUP BY p.timestamp ", nativeQuery = true)
//	 List<UserStats> countSignedupEventByTime(Long userId);
	
	@Query(value = "SELECT p.timestamp AS timestamp, COUNT(p.event_id) AS totalEvents "
			  + "FROM participant AS p WHERE p.user_id = :userId AND p.timestamp>=:pastTime And p.timestamp<=:currentTime GROUP BY p.timestamp order by p.timestamp ", nativeQuery = true)
	 List<UserStats> countSignedupEventByTime(Long userId, Timestamp currentTime, Timestamp pastTime);
	
	@Query(value = "SELECT p.timestamp AS timestamp, COUNT(p.event_id) AS totalEvents "
			  + "FROM participant AS p WHERE p.user_id = :userId AND p.participant_status= :status AND p.timestamp>=:pastTime And p.timestamp<=:currentTime GROUP BY p.timestamp order by p.timestamp ", nativeQuery = true)
	List<UserStats> countApprovedRejectedEventByTime(Long userId, int status, Timestamp currentTime, Timestamp pastTime);
	
	
	@Query(value = " SELECT e.end_time AS timestamp, COUNT(p.event_id) AS totalEvents \n"
			+ "FROM participant p \n"
			+ "inner join event e ON e.event_id = p.event_id "
			+ "WHERE p.user_id = :userId AND e.status=:eventStatus and e.end_time>=:endDate GROUP BY e.end_time Order by e.end_time ", nativeQuery = true)
	List<UserStats> countFinishedEvent(Long userId, int eventStatus, Timestamp endDate);
	
	
	

	

}
