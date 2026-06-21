package com.household.api.transaction.repository;

import com.household.api.transaction.domain.TransactionRecord;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<TransactionRecord, Long> {
    List<TransactionRecord> findAllByOrderByTransactionDateDescCreatedAtDesc();
}
