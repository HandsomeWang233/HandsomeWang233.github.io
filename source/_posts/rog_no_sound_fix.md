---
title: ROG笔记本更新Windows后没有声音
date: 2026-09-27 21:30
tags: [ROG, 笔记本, Windows, 驱动]
---

## 问题描述

朋友的 ROG 笔记本在更新 Windows 后出现系统声音丢失的问题

尝试通过 ROG 官网下载声卡驱动重新安装，依然无法解决

以下是我最终采用的解决方案

## 所需工具

| 工具 | 官网 |
|------|------|
| Geek Uninstaller | https://geekuninstaller.com/ |
| 360 驱动大师 | https://dm.weishi.360.cn/home.html |

## 解决步骤

### 一、卸载原有声卡驱动

1. 使用 GeekUninstaller 找到 **Realtek Audio Driver** 并卸载
2. 卸载完成后**重启电脑**

### 二、重装声卡驱动

1. 下载并安装 360 驱动大师
2. 运行驱动扫描，此时会出现 **Realtek Audio Driver** 的声卡驱动
3. 选中后下载安装，等待安装完成

### 三、清理驱动安装工具

1. 再次打开 GeekUninstaller，卸载 360 驱动大师
2. 若捆绑安装了鲁大师，需一并卸载
3. **重启电脑**

## 结果

重启后声音恢复正常，问题解决
