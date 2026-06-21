package com.household.api.baby.service;

import com.household.api.baby.domain.Baby;
import com.household.api.baby.dto.BabyResponse;
import com.household.api.baby.dto.CreateBabyRequest;
import com.household.api.baby.repository.BabyRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class BabyService {

    private final BabyRepository babyRepository;

    public BabyService(BabyRepository babyRepository) {
        this.babyRepository = babyRepository;
    }

    @Transactional
    public BabyResponse create(CreateBabyRequest request) {
        Baby baby = new Baby(request.name(), request.birthDate(), request.gender());
        return BabyResponse.from(babyRepository.save(baby));
    }

    public List<BabyResponse> findAll() {
        return babyRepository.findAll()
                .stream()
                .map(BabyResponse::from)
                .toList();
    }
}
