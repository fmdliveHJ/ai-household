package com.household.api.log.domain;

import com.household.api.baby.domain.Baby;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "baby_logs")
public class BabyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "baby_id", nullable = false)
    private Baby baby;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BabyLogType type;

    @Column(nullable = false)
    private LocalDateTime occurredAt;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private FeedingType feedingType;

    private Integer amountMl;

    private Integer durationMinutes;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private DiaperContent diaperContent;

    private LocalDateTime startedAt;

    private LocalDateTime endedAt;

    private Double weightKg;

    private Double heightCm;

    @Column(length = 255)
    private String note;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    protected BabyLog() {
    }

    public BabyLog(
            Baby baby,
            BabyLogType type,
            LocalDateTime occurredAt,
            FeedingType feedingType,
            Integer amountMl,
            Integer durationMinutes,
            DiaperContent diaperContent,
            LocalDateTime startedAt,
            LocalDateTime endedAt,
            Double weightKg,
            Double heightCm,
            String note
    ) {
        this.baby = baby;
        this.type = type;
        this.occurredAt = occurredAt;
        this.feedingType = feedingType;
        this.amountMl = amountMl;
        this.durationMinutes = durationMinutes;
        this.diaperContent = diaperContent;
        this.startedAt = startedAt;
        this.endedAt = endedAt;
        this.weightKg = weightKg;
        this.heightCm = heightCm;
        this.note = note;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Baby getBaby() { return baby; }
    public BabyLogType getType() { return type; }
    public LocalDateTime getOccurredAt() { return occurredAt; }
    public FeedingType getFeedingType() { return feedingType; }
    public Integer getAmountMl() { return amountMl; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public DiaperContent getDiaperContent() { return diaperContent; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public LocalDateTime getEndedAt() { return endedAt; }
    public Double getWeightKg() { return weightKg; }
    public Double getHeightCm() { return heightCm; }
    public String getNote() { return note; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
