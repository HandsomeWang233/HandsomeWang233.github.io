---
title: FiveM 启动报错：Error generating ROS entitlement token
date: 2026-09-24 14:27
tags: FiveM
---

启动 FiveM 时，遇到了以下报错：

```text
Error generating ROS entitlement token:
1 (Failed to connect to 127.0.0.1 port 10717
after 2068 ms: Connection refused)
```

*注：该报错为 FiveM 获取 Rockstar 游戏授权令牌失败*

若只需要获得解决方案，不想看分析，请点击 <a href="#solution" style="color: red;"><strong><u>查看解决方案</u></strong></a>

排查后发现，FiveM 的启动环境中存在指向 `127.0.0.1:10717` 的代理变量，但本机该端口没有程序监听
**清除当前启动环境中的代理变量后，FiveM 成功启动**

该文章记录完整的排查过程和处理方法

*注：ROS 授权报错可能由多种原因引起；以下方法适用于**代理地址失效**这一种情况*

## 一、确认 10717 端口是否有程序监听

在 PowerShell 中执行：

```powershell
netstat -ano | findstr ":10717"
```

发现执行没有输出，说明**检查时没有查到该端口的连接或监听记录**

本次遇到的并非 **端口被占用** 的问题，而是 FiveM 尝试连接的端口 **没有服务接收请求**

## 二、检查代理环境变量

继续在 PowerShell 中执行：

```powershell
Get-ChildItem Env: | Where-Object Name -match 'proxy'
```

回显如下：

```text
HTTP_PROXY     http://127.0.0.1:10717
HTTPS_PROXY    http://127.0.0.1:10717
NO_PROXY       ...
```

其中，`HTTP_PROXY` 和 `HTTPS_PROXY` 指向的地址与报错中的地址完全一致
这些变量会告诉支持它们的程序使用哪个代理
**即使 Windows 设置中的代理已关闭，程序仍可能读取并使用代理环境变量**

`NO_PROXY` 是代理例外列表，本次不需要修改。

为了排除其他配置，我还检查了 WinHTTP 代理：

```powershell
netsh winhttp show proxy
```

回显：

```text
直接访问(没有代理服务器)。
```

随后检查当前用户的系统代理设置：

```powershell
Get-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings' |
    Select-Object ProxyEnable, ProxyServer, AutoConfigURL
```

回显：

```text
ProxyEnable ProxyServer     AutoConfigURL
----------- -----------     -------------
          0 127.0.0.1:40808
```

注：该端口为Flclash的混合代理端口

这里的 `ProxyEnable = 0` 表示手动代理未启用
虽然 `ProxyServer` 中还留有 `127.0.0.1:40808`，但仅有这个值并不代表代理正在生效（笔者在排查前已经关闭了代理）
相比之下，环境变量中的 `10717` 与报错直接对应，是本次更关键的线索

## 三、原因

结合端口检查结果和后续启动测试，本次问题可以概括为：

```text
FiveM 的启动环境中存在 HTTP_PROXY / HTTPS_PROXY
                         ↓
授权请求尝试连接 127.0.0.1:10717
                         ↓
本机 10717 端口没有代理服务监听
                         ↓
连接被拒绝，授权令牌获取失败
```

本次是代理入口不可用
**代理软件退出、端口变更或旧环境变量残留，都可能造成类似现象**

## 四、尝试解决

先彻底退出 FiveM，然后在**同一个 PowerShell 窗口**中执行：

```powershell
Remove-Item Env:HTTP_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:HTTPS_PROXY -ErrorAction SilentlyContinue

Start-Process "D:\FIVEM\FiveM.exe" -WorkingDirectory "D:\FIVEM"
```

> 请将 `D:\FIVEM\FiveM.exe` 和工作目录替换为你自己的安装路径

本次使用上述方法后，FiveM 成功启动

之所以要在同一个窗口中启动，是因为 `Remove-Item Env:` 只清除**当前 PowerShell 进程**中的变量，以及之后从它启动的子进程所继承的变量

这种做法不会永久删除用户或系统环境变量，也不会关闭代理软件或修改其他已运行程序的环境

<a id="solution"></a>

## 五、解决方案：创建 FiveM 启动脚本

如果其他软件仍需要使用代理，不建议为了启动 FiveM 就直接删除全局代理配置
更合适的做法是：**仅在启动 FiveM 时清除相关代理变量。**

打开记事本，粘贴以下内容：

```bat
@echo off
setlocal

set "HTTP_PROXY="
set "HTTPS_PROXY="
set "ALL_PROXY="

start "" /D "D:\FIVEM" "D:\FIVEM\FiveM.exe"

endlocal
```

将文件保存为 `StartFiveM.bat`
脚本中的 `ALL_PROXY` 是额外清理的通用代理变量；**本次实际查到并通过清除后成功启动的是 `HTTP_PROXY` 和 `HTTPS_PROXY`**
使用脚本前，记得先退出已经运行的 FiveM

该脚本只影响本次启动进程及其继承环境的子进程，不会永久修改 Windows 代理设置，也不会关闭代理软件、TUN 模式或虚拟网卡

## 六、使用游戏加速器

如果需要同时使用游戏加速器，建议按以下顺序操作：

```text
启动加速器并等待加速成功
    ↓
通过 StartFiveM.cmd 启动 FiveM
```

笔者这里使用的是`UU加速器`，加速游戏选择的是FiveM
经测试，FiveM正常启动，加速器正常加速，可以正常连接到游戏服务器并加载资源

