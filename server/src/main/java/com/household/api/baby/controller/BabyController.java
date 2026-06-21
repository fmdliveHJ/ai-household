package com.household.api.baby.controller;

import com.household.api.baby.dto.BabyResponse;
import com.household.api.baby.dto.CreateBabyRequest;
import com.household.api.baby.service.BabyService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/babies")
public class BabyController {

    private final BabyService babyService;

    public BabyController(BabyService babyService) {
        this.babyService = babyService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BabyResponse create(@Valid @RequestBody CreateBabyRequest request) {
        return babyService.create(request);
    }

    @GetMapping
    public List<BabyResponse> findAll() {
        return babyService.findAll();
    }
}
