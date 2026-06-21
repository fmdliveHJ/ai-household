package com.household.api.summary.service;

import com.household.api.log.domain.BabyLog;
import com.household.api.log.domain.BabyLogType;
import com.household.api.log.domain.DiaperContent;
import com.household.api.log.repository.BabyLogRepository;
import com.household.api.summary.dto.TodaySummaryResponse;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class TodaySummaryService {

    private final BabyLogRepository babyLogRepository;

    public TodaySummaryService(BabyLogRepository babyLogRepository) {
        this.babyLogRepository = babyLogRepository;
    }

    public TodaySummaryResponse getTodaySummary(Long babyId) {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();
        List<BabyLog> logs = babyLogRepository.findByBabyIdAndOccurredAtBetweenOrderByOccurredAtAsc(babyId, start, end);

        long feedingCount = logs.stream().filter(log -> log.getType() == BabyLogType.FEEDING).count();
        int totalFeedingAmountMl = logs.stream()
                .filter(log -> log.getType() == BabyLogType.FEEDING)
                .map(BabyLog::getAmountMl)
                .filter(amount -> amount != null)
                .mapToInt(Integer::intValue)
                .sum();

        long diaperCount = logs.stream().filter(log -> log.getType() == BabyLogType.DIAPER).count();
        long peeCount = logs.stream()
                .filter(log -> log.getDiaperContent() == DiaperContent.PEE || log.getDiaperContent() == DiaperContent.BOTH)
                .count();
        long poopCount = logs.stream()
                .filter(log -> log.getDiaperContent() == DiaperContent.POOP || log.getDiaperContent() == DiaperContent.BOTH)
                .count();

        List<BabyLog> sleepLogs = logs.stream()
                .filter(log -> log.getType() == BabyLogType.SLEEP)
                .toList();
        long totalSleepMinutes = sleepLogs.stream()
                .mapToLong(log -> sleepMinutes(log, LocalDateTime.now()))
                .sum();
        boolean sleepingNow = sleepLogs.stream().anyMatch(log -> log.getStartedAt() != null && log.getEndedAt() == null);

        return new TodaySummaryResponse(
                today,
                feedingCount,
                totalFeedingAmountMl,
                diaperCount,
                peeCount,
                poopCount,
                sleepLogs.size(),
                totalSleepMinutes,
                sleepingNow
        );
    }

    private long sleepMinutes(BabyLog log, LocalDateTime now) {
        if (log.getStartedAt() == null) {
            return 0;
        }
        LocalDateTime endedAt = log.getEndedAt() == null ? now : log.getEndedAt();
        return Math.max(0, Duration.between(log.getStartedAt(), endedAt).toMinutes());
    }
}
