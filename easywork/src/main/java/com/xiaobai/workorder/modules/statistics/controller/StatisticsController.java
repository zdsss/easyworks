package com.xiaobai.workorder.modules.statistics.controller;

import com.xiaobai.workorder.common.response.ApiResponse;
import com.xiaobai.workorder.modules.statistics.dto.StatisticsDTO;
import com.xiaobai.workorder.modules.statistics.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@Tag(name = "Admin - Statistics", description = "Production statistics and dashboard")
@RestController
@RequestMapping("/api/admin/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    @Operation(summary = "Get dashboard statistics overview")
    @GetMapping("/dashboard")
    public ApiResponse<StatisticsDTO> getDashboard() {
        return ApiResponse.success(statisticsService.getDashboardStats());
    }

    @Operation(summary = "Get inspection trend by day")
    @GetMapping("/inspection-trend")
    public ApiResponse<List<Map<String, Object>>> getInspectionTrend(
            @RequestParam(defaultValue = "7") int days) {
        return ApiResponse.success(statisticsService.getInspectionTrend(days));
    }
}
