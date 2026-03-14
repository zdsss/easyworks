package com.xiaobai.workorder.modules.workorder.dto;

import jakarta.validation.constraints.DecimalMin;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class UpdateWorkOrderRequest {

    private String productName;
    private String productCode;

    @DecimalMin(value = "1", message = "Planned quantity must be at least 1")
    private BigDecimal plannedQuantity;

    private Integer priority;
    private LocalDateTime plannedStartTime;
    private LocalDateTime plannedEndTime;
    private String notes;
}
