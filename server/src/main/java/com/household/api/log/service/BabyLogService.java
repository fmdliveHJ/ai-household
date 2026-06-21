package com.household.api.log.service;

import com.household.api.baby.domain.Baby;
import com.household.api.baby.repository.BabyRepository;
import com.household.api.log.domain.BabyLog;
import com.household.api.log.dto.BabyLogResponse;
import com.household.api.log.dto.CreateBabyLogRequest;
import com.household.api.log.repository.BabyLogRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class BabyLogService {

    private final BabyRepository babyRepository;
    private final BabyLogRepository babyLogRepository;

    public BabyLogService(BabyRepository babyRepository, BabyLogRepository babyLogRepository) {
        this.babyRepository = babyRepository;
        this.babyLogRepository = babyLogRepository;
    }

    @Transactional
    public BabyLogResponse create(CreateBabyLogRequest request) {
        Baby baby = babyRepository.findById(request.babyId())
                .orElseThrow(() -> new IllegalArgumentException("Baby not found: " + request.babyId()));

        BabyLog log = new BabyLog(
                baby,
                request.type(),
                request.occurredAt(),
                request.feedingType(),
                request.amountMl(),
                request.durationMinutes(),
                request.diaperContent(),
                request.startedAt(),
                request.endedAt(),
                request.weightKg(),
                request.heightCm(),
                request.note()
        );

        return BabyLogResponse.from(babyLogRepository.save(log));
    }

    public List<BabyLogResponse> findByBaby(Long babyId) {
        return babyLogRepository.findByBabyIdOrderByOccurredAtDescCreatedAtDesc(babyId)
                .stream()
                .map(BabyLogResponse::from)
                .toList();
    }
}
