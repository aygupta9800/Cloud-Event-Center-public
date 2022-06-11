package com.cmpe275.termproject.Repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.cmpe275.termproject.Entity.VirtualTime;

@Repository
public interface VirtualTimeRepo extends CrudRepository<VirtualTime, Long> {
	VirtualTime save(VirtualTime virtualTime);
	VirtualTime findFirstByOrderByVirtualTimeId();
}
