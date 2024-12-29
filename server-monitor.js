const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const os = require('os');

// SSH 连接配置
const sshConfig = {
    host: '207.188.0.0',
    username: '用户名',
    password: '你的密码',
    tryKeyboard: true,
    algorithms: {
        kex: [
            'diffie-hellman-group1-sha1',
            'ecdh-sha2-nistp256',
            'ecdh-sha2-nistp384',
            'ecdh-sha2-nistp521',
            'diffie-hellman-group-exchange-sha256',
            'diffie-hellman-group14-sha1'
        ]
    }
};

// 存储IP访问统计
const ipStats = new Map();
// 存储性能数据
const performanceData = [];

const ssh = new NodeSSH();

// 监控系统性能
async function monitorSystemPerformance() {
    try {
        // 获取CPU使用情况
        const cpuResult = await ssh.execCommand('top -bn1 | grep "Cpu(s)"');
        // 获取内存使用情况
        const memResult = await ssh.execCommand('free -m');
        // 获取网络连接统计
        const netstatResult = await ssh.execCommand('netstat -n | awk \'/^tcp/ {print $5}\' | cut -d: -f1 | sort | uniq -c');

        const timestamp = new Date().toISOString();
        
        // 处理netstat结果，更新IP统计
        const connections = netstatResult.stdout.trim().split('\n');
        connections.forEach(line => {
            const [count, ip] = line.trim().split(/\s+/);
            if (ip) {
                ipStats.set(ip, (ipStats.get(ip) || 0) + parseInt(count));
            }
        });

        // 创建性能快照
        const performanceSnapshot = {
            timestamp,
            cpu: cpuResult.stdout,
            memory: memResult.stdout,
            connections: netstatResult.stdout
        };
        
        performanceData.push(performanceSnapshot);

        // 保存性能数据到文件
        fs.appendFileSync('performance_log.txt', 
            `${timestamp}\n` +
            `CPU使用情况:\n${cpuResult.stdout}\n` +
            `内存使用情况:\n${memResult.stdout}\n` +
            `网络连接:\n${netstatResult.stdout}\n` +
            `-------------------\n`
        );

    } catch (error) {
        console.error('监控错误:', error);
    }
}

// 输出统计信息
function printStats() {
    console.log('\n--- 统计报告 ---');
    console.log('IP访问统计:');
    ipStats.forEach((count, ip) => {
        console.log(`${ip}: ${count}次连接`);
    });

    // 保存统计数据到文件
    const stats = {
        timestamp: new Date().toISOString(),
        ipStats: Object.fromEntries(ipStats),
        performanceData: performanceData.slice(-10) // 保存最近10条性能记录
    };

    fs.writeFileSync('stats.json', JSON.stringify(stats, null, 2));
}

// 主函数
async function main() {
    try {
        console.log('正在连接服务器...');
        await ssh.connect(sshConfig);
        console.log('SSH连接成功，开始监控...');

        // 每分钟执行一次性能监控
        setInterval(monitorSystemPerformance, 60 * 1000);
        
        // 每5分钟输出一次统计信息
        setInterval(printStats, 5 * 60 * 1000);

        // 首次执行
        await monitorSystemPerformance();
        printStats();

    } catch (error) {
        console.error('连接错误:', error);
    }
}

main(); 