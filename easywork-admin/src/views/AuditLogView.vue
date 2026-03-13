<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span>审计日志</span>
          <el-form inline>
            <el-form-item label="目标类型">
              <el-select
                v-model="filters.targetType"
                clearable
                placeholder="全部"
                style="width: 160px"
              >
                <el-option label="操作记录" value="OPERATION" />
                <el-option label="返工记录" value="REWORK_RECORD" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loadLogs(1)">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </template>

      <el-table :data="logs" v-loading="logsLoading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="operationType" label="操作类型" />
        <el-table-column prop="targetType" label="目标类型" width="160" />
        <el-table-column prop="targetId" label="目标ID" width="100" />
        <el-table-column prop="ipAddress" label="IP 地址" width="140" />
        <el-table-column prop="createdAt" label="时间" width="180">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="margin-top: 16px; justify-content: flex-end; display: flex"
        v-model:current-page="pagination.current"
        :total="pagination.total"
        layout="total, prev, pager, next"
        @current-change="loadLogs"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getAuditLogs } from '@/api/audit'

const logs = ref([])
const logsLoading = ref(false)

const filters = reactive({
  targetType: '',
})

const pagination = reactive({
  current: 1,
  total: 0,
})

async function loadLogs(page = 1) {
  logsLoading.value = true
  try {
    const params = {
      page,
      size: 20,
    }
    if (filters.targetType) {
      params.targetType = filters.targetType
    }
    const res = await getAuditLogs(params)
    if (res.data.code === 200) {
      logs.value = res.data.data.records
      pagination.total = res.data.data.total
      pagination.current = res.data.data.current
    }
  } finally {
    logsLoading.value = false
  }
}

function formatDate(val) {
  if (!val) return '-'
  return new Date(val).toLocaleString('zh-CN', { hour12: false })
}

onMounted(() => loadLogs())
</script>
