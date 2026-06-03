package com.household.api.transaction.service;

import com.household.api.transaction.domain.TransactionRecord;
import com.household.api.transaction.dto.CreateTransactionRequest;
import com.household.api.transaction.dto.TransactionResponse;
import com.household.api.transaction.repository.TransactionRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public TransactionResponse create(CreateTransactionRequest request) {
        TransactionRecord record = new TransactionRecord(
                request.type(),
                request.category(),
                request.amount(),
                request.memo(),
                request.transactionDate()
        );

        TransactionRecord saved = transactionRepository.save(record);
        return TransactionResponse.from(saved);
    }

    public List<TransactionResponse> findAll() {
        return transactionRepository.findAllByOrderByTransactionDateDescCreatedAtDesc()
                .stream()
                .map(TransactionResponse::from)
                .toList();
    }
}
