const express =  require('express')
const cors =  require('cors')
const tex2svg = require('node-tikzjax').default;
const path = require('path')

// 创建express实例
const app = express()

// 中间件配置
app.use(cors()) // 启用 CORS, 是否允许跨域
app.use(express.json()) // 解析 JSON 请求体

// TikZ 渲染 API - 使用 POST 方法
app.post('/api/render', async (req, res) => {
  try {
    // 从请求体中获取数据
    const { input } = req.body
    
    // 验证输入
    if (!input || typeof input !== 'string') {
      return res.status(400).json({
        error: '缺少有效的 input 参数',
        message: '请提供 TikZ 代码作为 input 参数'
      })
    }
    
    if (!input.trim()) {
      return res.status(400).json({
        error: '输入为空',
        message: 'TikZ 代码不能为空'
      })
    }
    
    // 渲染 SVG
    const svg = await tex2svg(input, {
      // Print log of TeX engine to console. Default: false.
      showConsole: true,
      // Additional TeX packages to load. Default: {}.
      // The following example results in `\usepackage{pgfplots}\usepackage[intlimits]{amsmath}`.
      texPackages: { pgfplots: '', amsmath: 'intlimits' },
      // Additional TikZ libraries to load. Default: ''.
      // The following example results in `\usetikzlibrary{arrows.meta,calc}`.
      tikzLibraries: 'arrows.meta,calc',
      // Additional source code to add to the preamble of input. Default: ''.
      addToPreamble: '% comment',
      // Add `<defs><style>@import url('fonts.css');</style></defs>` to SVG. Default: false.
      // This could be useful if you want to embed the SVG in a HTML file.
      embedFontCss: true,
      // URL of the font CSS file. Default: 'https://cdn.jsdelivr.net/npm/node-tikzjax@latest/css/fonts.css'.
      fontCssUrl: 'https://cdn.jsdelivr.net/npm/node-tikzjax@latest/css/fonts.css',
      // Disable SVG optimization with SVGO. Default: false.
      disableOptimize: false,
    });
    
    // 设置响应头，返回 SVG
    res.setHeader('Content-Type', 'image/svg+xml')
    res.send(svg)
    
  } catch (error) {
    console.error('TikZ 渲染错误:', error)
    
    // 返回详细的错误信息
    res.status(500).json({
      error: '渲染失败',
      message: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString()
    })
  }
})

// 健康检查
app.get('/api/healthz', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'TikZ Render API'
  })
})

// 示例
app.get('/api/example', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'public', 'example.html'))
})

// 说明
app.get('/api/doc', (req, res) => {
  res.json({
    message: 'TikZ 渲染服务已启动',
    endpoints: {
      render: {
        POST: '/api/render',
      },
      health: '/api/healthz',
      example: '/api/example'
    },
    usage: '发送 POST 请求到 /api/render，body: { "input": "你的 TikZ 代码" }'
  })
})

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: '未找到路由',
    path: req.originalUrl
  })
})

module.exports = app
