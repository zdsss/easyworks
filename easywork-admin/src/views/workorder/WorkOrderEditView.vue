<template>
  <div v-loading="loading">
    <el-button :icon="ArrowLeft" @click="$router.back()" style="margin-bottom: 16px">返回</el-button>

    <el-card shadow="never">
      <template #header>
        <span>编辑工单 — {{ orderNumber }}</span>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        style="max-width: 640px"
      >
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="form.productName" />
        </el-form-item>
        <el-form-item label="产品编码" prop="productCode">
          <el-input v-model="form.productCode" />
        </el-form-item>
        <el-form-item label="计划数量" prop="plannedQuantity">
          <el-input-number v-model="form.plannedQuantity" :min="1" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-input-number v-model="form.priority" :min="0" :max="100" style="width: 100%" />
        </el-form-item>
        <el-form-item label="计划开始时间" prop="plannedStartTime">
          <el-date-picker
            v-model="form.plannedStartTime"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="计划完成时间" prop="plannedEndTime">
          <el-date-picker
            v-model="form.plannedEndTime"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="form.notes" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getWorkOrder, updateWorkOrder } from '@/api/workorder'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const orderNumber = ref('')
const formRef = ref(null)

const form = reactive({
  productName: '',
  productCode: '',
  plannedQuantity: 1,
  priority: 0,
  plannedStartTime: null,
  plannedEndTime: null,
  notes: '',
})

const rules = {
  plannedQuantity: [{ required: true, message: '请填写计划数量', trigger: 'blur' }],
}

async function loadWorkOrder() {
  loading.value = true
  try {
    const wo = await getWorkOrder(route.params.id)
    orderNumber.value = wo.orderNumber
    form.productName = wo.productName ?? ''
    form.productCode = wo.productCode ?? ''
    form.plannedQuantity = wo.plannedQuantity ? Number(wo.plannedQuantity) : 1
    form.priority = wo.priority ?? 0
    form.plannedStartTime = wo.plannedStartTime ? new Date(wo.plannedStartTime) : null
    form.plannedEndTime = wo.plannedEndTime ? new Date(wo.plannedEndTime) : null
    form.notes = wo.notes ?? ''
  } catch {
    // handled in interceptor
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    await updateWorkOrder(route.params.id, {
      productName: form.productName || null,
      productCode: form.productCode || null,
      plannedQuantity: form.plannedQuantity,
      priority: form.priority,
      plannedStartTime: form.plannedStartTime ? new Date(form.plannedStartTime).toISOString() : null,
      plannedEndTime: form.plannedEndTime ? new Date(form.plannedEndTime).toISOString() : null,
      notes: form.notes || null,
    })
    ElMessage.success('保存成功')
    router.push(`/workorders/${route.params.id}`)
  } catch {
    // handled in interceptor
  } finally {
    saving.value = false
  }
}

onMounted(loadWorkOrder)
</script>
