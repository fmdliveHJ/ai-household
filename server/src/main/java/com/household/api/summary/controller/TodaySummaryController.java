package com.household.api.summary.controller;

import com.household.api.summary.dto.TodaySummaryResponse;
import com.household.api.summary.service.TodaySummaryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/summaries")
public class TodaySummaryController {

    private final TodaySummaryService todaySummaryService;

    public TodaySummaryController(TodaySummaryService todaySummaryService) {
        this.todaySummaryService = todaySummaryService;
    }

    @GetMapping("/today")
    public TodaySummaryResponse today(@RequestParam Long babyId) {
        return todaySummaryService.getTodaySummary(babyId);
    }
}
