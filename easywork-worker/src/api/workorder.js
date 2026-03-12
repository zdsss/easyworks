import http from './http'

export function getWorkOrders(params) {
  return http.get('/device/work-orders', { params })
}

export function getWorkOrder(id) {
  return http.get(`/device/work-orders/${id}`)
}

export function getInspectionDetail(workOrderId) {
  return http.get(`/device/inspections/${workOrderId}`)
}
