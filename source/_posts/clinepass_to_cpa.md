---
title: ClinePass 通过 CPA（CLIProxyAPI）接入 Cherry Studio
date: 2026-09-26 4:30
tags: [ClinePass, Cherry Studio, CPA, CLIProxyAPI]
---
本文介绍如何通过 **CPA（CLIProxyAPI）** 及其插件 **ClinePassBridge**，将 ClinePass 的模型服务接入 **Cherry Studio**，实现本地代理转发

> 💡 本教程以 **Linux** 环境为例进行部署演示

## 🔗 相关项目地址

| 项目                 | 地址                                                                                            |
| - | - |
| CPA（CLIProxyAPI）   | [https://github.com/router-for-me/CLIProxyAPI](https://github.com/router-for-me/CLIProxyAPI)       |
| ClinePassBridge 插件 | [https://github.com/xiao-qiu-qiu/ClinePassBridge](https://github.com/xiao-qiu-qiu/ClinePassBridge) |

---

## 一、部署 CPA

### 1. 下载并解压

前往 CPA 的 [**Release 页面**](https://github.com/router-for-me/CLIProxyAPI/releases)，选择与系统对应的版本进行下载，下载后解压

### 2. 配置文件

解压完成后，将示例配置复制一份作为正式配置：

```bash
cp config.example.yaml config.yaml
```

编辑 `config.yaml`，需关注以下字段：

| 配置项 | 说明 |
| --- | --- |
| `secret-key` | **必填**，管理后台登录密码 |
| `plugins.enabled` | **必须改为 `true`**，否则无法使用插件功能 |
| `remote-management.allow-remote` | 如需远程管理，改为 `true`（可选） |

其余配置基本无需改动

### 3. 注册为系统服务（持久化运行）

创建服务文件 `/etc/systemd/system/cpa.service`，内容如下：

```ini
[Unit]
Description=CLI Proxy API Service
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory=/root/cpa
ExecStart=/root/cpa/cli-proxy-api --config /root/cpa/config.yaml
Restart=on-failure
RestartSec=5
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
```

> ⚠️ **注意**：`WorkingDirectory` 与 `ExecStart` 中的路径需要修改为你 CPA 的实际所在目录及配置文件实际路径

保存后，执行以下命令注册并启动服务：

```bash
systemctl daemon-reload
systemctl enable --now cpa
```

---

## 二、配置 CPA 管理面板

### 1. 登录管理后台

访问 `http://127.0.0.1:8317`，使用 `secret-key` 登录后即可对 CPA 进行管理和进一步配置

### 2. 安装并启用插件

1. 点击 **插件商店**，搜索 `ClinePassBridge` 进行安装
2. 安装完成后，点击 **插件管理** 进行启用

---

## 三、配置 ClinePassBridge 插件

启用插件后，访问插件控制台：

```
http://127.0.0.1:8317/v0/resource/plugins/clinepassbridge/console
```

### 1. 添加 API Key

在 **配置概览** 中，添加在 [**Cline 官网的 API Keys 页面**](https://app.cline.bot/dashboard/account?tab=api-keys) 创建的 API Key

> 添加后系统会自动识别出你的套餐信息

### 2. 配置模型映射

1. 在 **模型映射** 模块中点击 **添加模型**
2. 点击 **获取上游模型**
3. 勾选自己需要的模型后，点击 **应用更改**

### 3. 添加 CPA 的 API 密钥

回到 CPA 管理面板，点击 **配置面板**，在 **常用** 中找到 **API 密钥列表（api-keys）**，添加一个 API Key，用于请求 CPA 的接口

> 至此，CPA 的配置全部完成

---

## 四、接入 Cherry Studio

1. 进入 Cherry Studio 的 **设置**，点击 **添加服务商**，名称任意
2. **API 密钥** 填写上一步为 CPA 添加的密钥
3. 在 **端点设置** 中：
   - 选择 **OpenAI Responses** 并设为默认
   - 地址填入：`http://127.0.0.1:8317/`
4. 添加后选择该服务商，点击 **同步模型**，在列表中手动添加刚才勾选的几个模型

---

## 🎉 结语

到此，全部配置完成！你现在可以在 Cherry Studio 中使用 ClinePass 的模型服务了
