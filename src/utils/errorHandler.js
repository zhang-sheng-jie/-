// 全局错误处理
export class ErrorHandler {
  static handleError(error, context = '') {
    console.error(`[${context}] 错误详情:`, error)
    
    // 根据错误类型提供用户友好的消息
    let userMessage = '操作失败，请稍后重试'
    
    if (error.message) {
      if (error.message.includes('Network Error')) {
        userMessage = '网络连接失败，请检查网络连接'
      } else if (error.message.includes('401')) {
        userMessage = '认证失败，请重新登录'
      } else if (error.message.includes('403')) {
        userMessage = '权限不足，无法执行此操作'
      } else if (error.message.includes('404')) {
        userMessage = '请求的资源不存在'
      } else if (error.message.includes('database')) {
        userMessage = '数据库操作失败，请检查数据库连接'
      }
    }
    
    // 显示错误提示（在实际应用中可以使用Toast或Modal）
    if (typeof window !== 'undefined' && window.alert) {
      alert(userMessage)
    }
    
    return userMessage
  }
  
  // 处理Supabase特定错误
  static handleSupabaseError(error, operation = '') {
    console.error(`[Supabase ${operation}] 错误:`, error)
    
    let message = '数据库操作失败'
    
    if (error.code) {
      switch (error.code) {
        case 'PGRST116':
          message = '请求的资源不存在'
          break
        case 'PGRST201':
          message = '缺少必要参数'
          break
        case 'PGRST202':
          message = '函数或表不存在'
          break
        case 'PGRST203':
          message = '权限不足'
          break
        case 'PGRST204':
          message = '数据格式错误'
          break
        case 'PGRST205':
          message = '数据库表不存在，请先创建表结构'
          break
        default:
          message = `数据库错误: ${error.code}`
      }
    }
    
    return message
  }
}

// 全局错误捕获
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('全局错误捕获:', event.error)
    ErrorHandler.handleError(event.error, 'Global Error')
  })
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的Promise拒绝:', event.reason)
    ErrorHandler.handleError(event.reason, 'Unhandled Promise Rejection')
  })
}