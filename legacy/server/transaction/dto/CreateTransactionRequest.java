package com.household.api.transaction.dto;

import com.household.api.transaction.domain.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateTransactionRequest(
        @NotNull TransactionType type,
        @NotBlank String category,
        @NotNull @Positive BigDecimal amount,
        String memo,
        @NotNull LocalDate transactionDate
) {
}
