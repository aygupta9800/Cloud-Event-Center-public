package com.cmpe275.termproject.Repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.cmpe275.termproject.Entity.Event;
import com.cmpe275.termproject.Entity.Review;
import com.cmpe275.termproject.Entity.User;
import com.cmpe275.termproject.Utilities.Utility.ReviewType;

@Repository
public interface ReviewRepo extends CrudRepository<Review, Long> {

	Review save(Review review);
	List<Review> findReviewByGivenToUser(User user);
	List<Review> findReviewByGivenToUserAndReviewType(User user, ReviewType reviewType);
	List<Review> findAllReviewByEventAndGivenByUserAndGivenToUserAndReviewType(Event event, User givenByuser, User givenToUser, ReviewType reviewType);
}
