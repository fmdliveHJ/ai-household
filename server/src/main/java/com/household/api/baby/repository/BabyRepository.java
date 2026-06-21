package com.household.api.baby.repository;

import com.household.api.baby.domain.Baby;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BabyRepository extends JpaRepository<Baby, Long> {
}
