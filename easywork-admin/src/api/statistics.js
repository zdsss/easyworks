import http from './http'

export function getDashboard() {
  return http.get('/admin/statistics/dashboard')
}

export function getWorkerOutput(params) {
  return http.get('/admin/statistics/worker-output', { params })
}

export function getInspectionTrend(days = 7) {
  return http.get('/admin/statistics/inspection-trend', { params: { days } })
}
