import http from './http'

export function getDependencies(operationId) {
  return http.get(`/admin/operation-dependencies/${operationId}`)
}

export function addDependency(params) {
  return http.post('/admin/operation-dependencies', null, { params })
}
