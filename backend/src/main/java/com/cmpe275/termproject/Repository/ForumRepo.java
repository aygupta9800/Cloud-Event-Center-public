package com.cmpe275.termproject.Repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.cmpe275.termproject.Entity.Forum;

@Repository
public interface ForumRepo extends CrudRepository<Forum, Long> {
    @SuppressWarnings("unchecked")
	Forum save(Forum forum);
    Forum findByForumId(long forumId);

}
