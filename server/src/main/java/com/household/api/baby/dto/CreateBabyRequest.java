package com.household.api.baby.dto;

import com.household.api.baby.domain.BabyGender;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CreateBabyRequest(
        @NotBlank String name,
        @NotNull LocalDate birthDate,
        BabyGender gender
) {
}
