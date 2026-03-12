package com.xiaobai.workorder.modules.statistics.service;

import com.xiaobai.workorder.modules.report.repository.ReportRecordMapper;
import com.xiaobai.workorder.modules.statistics.dto.StatisticsDTO;
import com.xiaobai.workorder.modules.user.entity.User;
import com.xiaobai.workorder.modules.user.repository.UserMapper;
import com.xiaobai.workorder.modules.workorder.repository.WorkOrderMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StatisticsServiceTest {

    @Mock WorkOrderMapper workOrderMapper;
    @Mock ReportRecordMapper reportRecordMapper;
    @Mock UserMapper userMapper;

    @InjectMocks StatisticsService statisticsService;

    @Test
    void getDashboardStats_noData_returnsAllZeros() {
        when(workOrderMapper.countByStatus()).thenReturn(List.of());
        when(workOrderMapper.countByTypeAndStatus()).thenReturn(List.of());
        when(reportRecordMapper.sumByUser()).thenReturn(List.of());

        StatisticsDTO stats = statisticsService.getDashboardStats();

        assertThat(stats.getTotalWorkOrders()).isZero();
        assertThat(stats.getNotStartedCount()).isZero();
        assertThat(stats.getStartedCount()).isZero();
        assertThat(stats.getReportedCount()).isZero();
        assertThat(stats.getCompletedCount()).isZero();
        assertThat(stats.getOverallCompletionRate()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    void getDashboardStats_correctTotalCount() {
        when(workOrderMapper.countByStatus()).thenReturn(List.of(
                Map.of("status", "NOT_STARTED", "cnt", 1L),
                Map.of("status", "STARTED", "cnt", 1L),
                Map.of("status", "REPORTED", "cnt", 1L)));
        when(workOrderMapper.countByTypeAndStatus()).thenReturn(List.of());
        when(reportRecordMapper.sumByUser()).thenReturn(List.of());

        StatisticsDTO stats = statisticsService.getDashboardStats();

        assertThat(stats.getTotalWorkOrders()).isEqualTo(3L);
    }

    @Test
    void getDashboardStats_correctStatusCounts() {
        when(workOrderMapper.countByStatus()).thenReturn(List.of(
                Map.of("status", "NOT_STARTED", "cnt", 1L),
                Map.of("status", "STARTED", "cnt", 1L),
                Map.of("status", "REPORTED", "cnt", 1L),
                Map.of("status", "INSPECT_PASSED", "cnt", 1L)));
        when(workOrderMapper.countByTypeAndStatus()).thenReturn(List.of());
        when(reportRecordMapper.sumByUser()).thenReturn(List.of());

        StatisticsDTO stats = statisticsService.getDashboardStats();

        assertThat(stats.getNotStartedCount()).isEqualTo(1L);
        assertThat(stats.getStartedCount()).isEqualTo(1L);
        assertThat(stats.getReportedCount()).isEqualTo(1L);
        assertThat(stats.getCompletedCount()).isEqualTo(1L);
    }

    @Test
    void getDashboardStats_correctCompletionRate() {
        // 4 total: NOT_STARTED, STARTED, REPORTED, INSPECT_PASSED → 2 done → 50%
        when(workOrderMapper.countByStatus()).thenReturn(List.of(
                Map.of("status", "NOT_STARTED", "cnt", 1L),
                Map.of("status", "STARTED", "cnt", 1L),
                Map.of("status", "REPORTED", "cnt", 1L),
                Map.of("status", "INSPECT_PASSED", "cnt", 1L)));
        when(workOrderMapper.countByTypeAndStatus()).thenReturn(List.of());
        when(reportRecordMapper.sumByUser()).thenReturn(List.of());

        StatisticsDTO stats = statisticsService.getDashboardStats();

        assertThat(stats.getOverallCompletionRate()).isEqualByComparingTo("50.0");
    }

    @Test
    void getDashboardStats_typeStatsGroupedByOrderType() {
        when(workOrderMapper.countByStatus()).thenReturn(List.of(
                Map.of("status", "NOT_STARTED", "cnt", 3L)));
        when(workOrderMapper.countByTypeAndStatus()).thenReturn(List.of(
                Map.of("order_type", "PRODUCTION", "status", "NOT_STARTED", "cnt", 2L),
                Map.of("order_type", "INSPECTION", "status", "NOT_STARTED", "cnt", 1L)));
        when(reportRecordMapper.sumByUser()).thenReturn(List.of());

        StatisticsDTO stats = statisticsService.getDashboardStats();

        assertThat(stats.getTypeStats()).hasSize(2);
        StatisticsDTO.WorkOrderTypeStat productionStat = stats.getTypeStats().stream()
                .filter(ts -> "PRODUCTION".equals(ts.getOrderType())).findFirst().orElseThrow();
        assertThat(productionStat.getCount()).isEqualTo(2L);
    }

    @Test
    void getDashboardStats_workerStatsComputedCorrectly() {
        when(workOrderMapper.countByStatus()).thenReturn(List.of(
                Map.of("status", "REPORTED", "cnt", 1L)));
        when(workOrderMapper.countByTypeAndStatus()).thenReturn(List.of());
        when(reportRecordMapper.sumByUser()).thenReturn(List.of(
                Map.of("userId", 10L, "reportCount", 2L, "totalReported", new BigDecimal("8"))));

        User user = new User();
        user.setId(10L);
        user.setRealName("Worker One");
        user.setEmployeeNumber("EMP001");
        when(userMapper.selectById(10L)).thenReturn(user);

        StatisticsDTO stats = statisticsService.getDashboardStats();

        assertThat(stats.getWorkerStats()).hasSize(1);
        StatisticsDTO.WorkerStat ws = stats.getWorkerStats().get(0);
        assertThat(ws.getReportCount()).isEqualTo(2L);
        assertThat(ws.getTotalReported()).isEqualByComparingTo("8");
    }
}
