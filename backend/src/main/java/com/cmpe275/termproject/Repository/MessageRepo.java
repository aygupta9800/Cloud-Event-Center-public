package com.cmpe275.termproject.Repository;

import com.cmpe275.termproject.Entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.cmpe275.termproject.Entity.Message;

@Repository
public interface MessageRepo extends CrudRepository<User, Long> {
    Message save(Message message);
}
