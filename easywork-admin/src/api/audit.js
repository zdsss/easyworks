import http from './http'

export function getAuditLogs(params) {
  return http.get('/admin/audit-logs', { params })
}
