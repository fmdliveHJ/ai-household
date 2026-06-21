package com.household.api.summary.dto;

import java.time.LocalDate;

public record TodaySummaryResponse(
        LocalDate date,
        long feedingCount,
        int totalFeedingAmountMl,
        long diaperCount,
        long peeCount,
        long poopCount,
        long sleepSessionCount,
        long totalSleepMinutes,
        boolean sleepingNow
) {
}
