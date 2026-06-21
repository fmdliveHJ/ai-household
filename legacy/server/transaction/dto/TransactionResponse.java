package com.household.api.transaction.dto;

import com.household.api.transaction.domain.TransactionRecord;
import com.household.api.transaction.domain.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TransactionResponse(
        Long id,
        TransactionType type,
        String category,
        BigDecimal amount,
        String memo,
        LocalDate transactionDate,
        LocalDateTime createdAt
) {
    public static TransactionResponse from(TransactionRecord record) {
        return new TransactionResponse(
                record.getId(),
                record.getType(),
                record.getCategory(),
                record.getAmount(),
                record.getMemo(),
                record.getTransactionDate(),
                record.getCreatedAt()
        );
    }
}
