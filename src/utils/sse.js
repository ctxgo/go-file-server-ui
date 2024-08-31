import { fetchEventSource } from '@microsoft/fetch-event-source'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'

const sseService = {
  createSse(openWhenHidden = false) {
    const controllers = []
    const headers = {
      'Accept': 'text/event-stream'
    }

    if (store.getters.token) {
      const token = getToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    return {
      fetch(endpoint, onMessage) {
        const url = `${process.env.VUE_APP_BASE_API}${endpoint}`
        const controller = new AbortController()
        controllers.push(controller)

        fetchEventSource(url, {
          openWhenHidden: openWhenHidden,
          method: 'GET',
          headers,
          signal: controller.signal,
          onopen: response => {
            if (response.ok) {
              console.log(`SSE Connection opened for ${endpoint}`)
            } else {
              Message({
                message: 'sse连接异常',
                type: 'error'
              })
              console.error(`Failed to open connection for ${endpoint}`, response.status)
            }
          },
          onmessage: event => {
            if (onMessage) {
              onMessage(event)
            }
            if (event.event === 'error') {
              Message({
                message: 'sse数据接受异常: ' + event.data,
                type: 'error'
              })
              controller.abort()
              console.error(`SSE Error from ${endpoint}:`, event.data)
              return
            }
          },
          onerror: error => {
            Message({
              message: 'sse内部错误',
              type: 'error'
            })
            console.error(`SSE Error from ${endpoint}:`, error)
          },
          onclose: () => {
            console.log(`SSE Connection closed for ${endpoint}`)
          }
        })
      },

      disconnect() {
        controllers.forEach(controller => {
          controller.abort()
          console.log('Connection aborted for all endpoints')
        })
        controllers.length = 0 // Clear the controllers array
      }
    }
  }
}

export default sseService
