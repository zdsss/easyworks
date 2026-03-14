package com.xiaobai.workorder.modules.inspection.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xiaobai.workorder.modules.inspection.entity.InspectionRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Mapper
public interface InspectionRecordMapper extends BaseMapper<InspectionRecord> {

    @Select("SELECT DATE(created_at) AS date, inspection_result AS result, COUNT(*) AS cnt " +
            "FROM inspection_records WHERE deleted = 0 AND created_at >= #{startDate} " +
            "GROUP BY DATE(created_at), inspection_result ORDER BY date ASC")
    List<Map<String, Object>> countByDateGrouped(@Param("startDate") LocalDate startDate);
}
