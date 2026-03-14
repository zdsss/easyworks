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
        <el-table-column prop="operationType" label="操作类型" width="140" />
        <el-table-column prop="targetType" label="目标类型" width="140" />
        <el-table-column prop="targetId" label="目标ID" width="100" />
        <el-table-column label="变更前状态" width="160">
          <template #default="{ row }">
            <el-tooltip v-if="row.beforeState" :content="row.beforeState" placement="top">
              <span class="state-chip state-before">{{ parseState(row.beforeState) }}</span>
            </el-tooltip>
            <span v-else class="state-empty">-</span>
          </template>
        </el-table-column>
        <el-table-column label="变更后状态" width="160">
          <template #default="{ row }">
            <el-tooltip v-if="row.afterState" :content="row.afterState" placement="top">
              <span class="state-chip state-after">{{ parseState(row.afterState) }}</span>
            </el-tooltip>
            <span v-else class="state-empty">-</span>
          </template>
        </el-table-column>
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

function parseState(json) {
  if (!json) return '-'
  try {
    const obj = JSON.parse(json)
    if (obj.status) return obj.status
    return JSON.stringify(obj)
  } catch {
    return json
  }
}

onMounted(() => loadLogs())
</script>

<style scoped>
.state-chip {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: default;
}
.state-before {
  background: #fef0f0;
  color: #f56c6c;
}
.state-after {
  background: #f0f9eb;
  color: #67c23a;
}
.state-empty {
  color: #c0c4cc;
}
</style>
