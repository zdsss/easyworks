# XiaoBai Easy WorkOrder System

轻量级制造业工单系统（MES）。

## 环境要求

- Java 21
- Maven 3.9+
- Docker & Docker Compose

## 启动方法

### 1. 启动基础设施（PostgreSQL + Redis）

```bash
docker-compose up -d postgres redis
```

### 2. 启动应用

> 注意：必须使用 Java 21，系统默认 Java 版本若高于 21 需显式指定。

```bash
JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home mvn spring-boot:run
```

## 访问地址

- API 基础地址：`http://localhost:8080`
- Swagger 文档：`http://localhost:8080/swagger-ui.html`

## 默认账号

| 员工号 | 密码 |
|--------|------|
| `ADMIN001` | `admin123` |

## 停止服务

```bash
# 停止基础设施
docker-compose down
```
