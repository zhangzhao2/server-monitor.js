# Linux 服务器性能监控工具

一个基于 Node.js 的服务器性能监控工具，用于实时监控 Linux 服务器的各项性能指标。

## 功能特性

- 实时监控 CPU 使用率
- 内存使用情况监控
- IP 访问统计
- 网络连接监控
- 自动生成性能报告
- 数据持久化存储

## 环境要求

- Node.js >= 14.0.0
- Linux 服务器（支持 SSH 连接）
- 必要的 Linux 命令：`top`, `free`, `netstat`

## 安装

1. 克隆项目
```

## 配置

在 `server-monitor.js` 中修改 SSH 连接配置：
```javascript
const sshConfig = {
    host: '你的服务器IP',
    username: '用户名',
    password: '密码',
    // 如果使用密钥认证，替换为：
    // privateKey: require('fs').readFileSync('/path/to/private/key')
};
```

## 使用方法

运行监控脚本：
```bash
node server-monitor.js
```server-monitor.js

## 输出文件

- `performance_log.txt`: 详细的性能监控日志
  - CPU 使用情况
  - 内存使用情况
  - 网络连接信息
  
- `stats.json`: JSON 格式的统计数据
  - IP 访问统计
  - 最近 10 条性能记录
  - 时间戳信息

## 监控指标说明

1. **CPU 监控**
   - 总体使用率
   - 用户空间使用率
   - 系统空间使用率
   - 空闲率

2. **内存监控**
   - 总内存
   - 已用内存
   - 可用内存
   - 缓存使用情况

3. **网络连接监控**
   - 活动连接数
   - 连接源 IP 统计
   - 连接频率统计

## 数据更新频率

- 性能数据采集：每 1 分钟
- 统计报告生成：每 5 分钟

## 注意事项

1. 确保服务器允许 SSH 连接
2. 确保用户具有执行 `top`, `free`, `netstat` 命令的权限
3. 建议使用 SSH 密钥认证以提高安全性
4. 注意保护好 `stats.json` 中的敏感信息

## 故障排除

1. SSH 连接失败
   - 检查服务器 IP 和端口是否正确
   - 验证用户名和密码
   - 确认服务器 SSH 服务是否运行

2. 命令执行失败
   - 检查用户权限
   - 确认所需命令是否已安装

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证

MIT License

## 作者

Your Name