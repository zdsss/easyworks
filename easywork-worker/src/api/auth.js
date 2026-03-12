import http from './http'

export function login(data) {
  return http.post('/device/login', data)
}
