package com.household.api.log.dto;

import com.household.api.log.domain.BabyLog;
import com.household.api.log.domain.BabyLogType;
import com.household.api.log.domain.DiaperContent;
import com.household.api.log.domain.FeedingType;
import java.time.LocalDateTime;

public record BabyLogResponse(
        Long id,
        Long babyId,
        BabyLogType type,
        LocalDateTime occurredAt,
        FeedingType feedingType,
        Integer amountMl,
        Integer durationMinutes,
        DiaperContent diaperContent,
        LocalDateTime startedAt,
        LocalDateTime endedAt,
        Double weightKg,
        Double heightCm,
        String note,
        LocalDateTime createdAt
) {
    public static BabyLogResponse from(BabyLog log) {
        return new BabyLogResponse(
                log.getId(),
                log.getBaby().getId(),
                log.getType(),
                log.getOccurredAt(),
                log.getFeedingType(),
                log.getAmountMl(),
                log.getDurationMinutes(),
                log.getDiaperContent(),
                log.getStartedAt(),
                log.getEndedAt(),
                log.getWeightKg(),
                log.getHeightCm(),
                log.getNote(),
                log.getCreatedAt()
        );
    }
}
