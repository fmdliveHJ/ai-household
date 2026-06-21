package com.household.api.log.controller;

import com.household.api.log.dto.BabyLogResponse;
import com.household.api.log.dto.CreateBabyLogRequest;
import com.household.api.log.service.BabyLogService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/logs")
public class BabyLogController {

    private final BabyLogService babyLogService;

    public BabyLogController(BabyLogService babyLogService) {
        this.babyLogService = babyLogService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BabyLogResponse create(@Valid @RequestBody CreateBabyLogRequest request) {
        return babyLogService.create(request);
    }

    @GetMapping
    public List<BabyLogResponse> findByBaby(@RequestParam Long babyId) {
        return babyLogService.findByBaby(babyId);
    }
}
