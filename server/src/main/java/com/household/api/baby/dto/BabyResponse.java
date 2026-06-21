package com.household.api.baby.dto;

import com.household.api.baby.domain.Baby;
import com.household.api.baby.domain.BabyGender;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record BabyResponse(
        Long id,
        String name,
        LocalDate birthDate,
        BabyGender gender,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static BabyResponse from(Baby baby) {
        return new BabyResponse(
                baby.getId(),
                baby.getName(),
                baby.getBirthDate(),
                baby.getGender(),
                baby.getCreatedAt(),
                baby.getUpdatedAt()
        );
    }
}
