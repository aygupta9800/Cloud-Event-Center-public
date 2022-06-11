package com.cmpe275.termproject.Repository;


import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.cmpe275.termproject.Entity.User;

@Repository
public interface UserRepo extends CrudRepository<User, Long> {
	
	@SuppressWarnings("unchecked")
	User save(User user);
	User findByEmail(String email);
	User findByUserId(Long userId);
	User findByVerificationCode(String verificationCode);
	User findByScreenName(String screenName);
}
