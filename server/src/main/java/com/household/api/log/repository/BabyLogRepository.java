package com.household.api.log.repository;

import com.household.api.log.domain.BabyLog;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BabyLogRepository extends JpaRepository<BabyLog, Long> {
    List<BabyLog> findByBabyIdOrderByOccurredAtDescCreatedAtDesc(Long babyId);
    List<BabyLog> findByBabyIdAndOccurredAtBetweenOrderByOccurredAtAsc(Long babyId, LocalDateTime start, LocalDateTime end);
}
