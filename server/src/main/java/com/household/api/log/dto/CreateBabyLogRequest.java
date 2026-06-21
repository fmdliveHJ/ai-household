package com.household.api.log.dto;

import com.household.api.log.domain.BabyLogType;
import com.household.api.log.domain.DiaperContent;
import com.household.api.log.domain.FeedingType;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record CreateBabyLogRequest(
        @NotNull Long babyId,
        @NotNull BabyLogType type,
        @NotNull LocalDateTime occurredAt,
        FeedingType feedingType,
        Integer amountMl,
        Integer durationMinutes,
        DiaperContent diaperContent,
        LocalDateTime startedAt,
        LocalDateTime endedAt,
        Double weightKg,
        Double heightCm,
        String note
) {
}
