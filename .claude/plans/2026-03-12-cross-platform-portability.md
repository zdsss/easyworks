# Cross-Platform Portability Fix — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all hardcoded platform-specific paths from documentation and add `.gitattributes` so any developer on Windows / macOS / Linux can clone and follow the setup guide without modification.

**Architecture:** All issues are in documentation and git config — no source code changes required. Java source and frontend build configs are already cross-platform clean. The fix is three targeted doc edits + one new file + one file deletion.

**Tech Stack:** Markdown, Git (`.gitattributes`)

---

## Chunk 1: Fix root README.md startup section

**Files:**
- Modify: `README.md:429-444`

The "九、启动方式" section contains four hardcoded paths:
- `cd /Users/monet/Program/Repo/easyworks/easywork` — personal macOS path
- `JAVA_HOME=/Library/Java/...` — macOS-only Java path syntax
- `cd /Users/monet/Program/Repo/easyworks/easywork-admin`
- `cd /Users/monet/Program/Repo/easyworks/easywork-worker`

Replace with relative paths (the reader has already cloned the repo, so they are at repo root) and a cross-platform JAVA_HOME note.

- [ ] **Step 1: Edit README.md — replace startup section**

Replace lines 428–444:

```markdown
## 九、启动方式

```bash
# Step 1：启动数据库（PostgreSQL + Redis）
cd easywork
docker-compose up -d postgres redis

# Step 2：启动后端（需 Java 21）
# Windows: set JAVA_HOME=C:\path\to\jdk-21 && mvn spring-boot:run
# macOS/Linux: JAVA_HOME=/path/to/jdk-21 mvn spring-boot:run
#
# 若系统默认已是 Java 21，直接执行：
mvn spring-boot:run

# Step 3：启动管理端（新终端）
cd easywork-admin
npm run dev   # → http://localhost:5173

# Step 4：启动工人端（新终端）
cd easywork-worker
npm run dev   # → http://localhost:5174
```
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: replace hardcoded personal paths with relative paths in startup guide"
```

---

## Chunk 2: Fix easywork/README.md startup section

**Files:**
- Modify: `easywork/README.md:62-64`

Line 63 contains a macOS-specific JAVA_HOME command:
```bash
JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home mvn spring-boot:run
```

Replace with cross-platform instructions.

- [ ] **Step 1: Edit easywork/README.md — replace startup command**

Replace the `### 2. 启动应用` section (lines 58–64) with:

```markdown
### 2. 启动应用

> 注意：必须使用 Java 21。若系统默认版本不是 Java 21，需显式指定 JAVA_HOME。
>
> - **Windows：** `set JAVA_HOME=C:\path\to\jdk-21 && mvn spring-boot:run`
> - **macOS/Linux：** `JAVA_HOME=/path/to/jdk-21 mvn spring-boot:run`
>
> 若系统默认已是 Java 21，直接执行：

```bash
mvn spring-boot:run
```
```

- [ ] **Step 2: Commit**

```bash
git add easywork/README.md
git commit -m "docs: replace macOS-specific JAVA_HOME with cross-platform instructions"
```

---

## Chunk 3: Fix CLAUDE.md directory structure

**Files:**
- Modify: `CLAUDE.md:9-13`

The repo structure diagram uses Windows-style backslashes and a hardcoded `D:\` drive letter. Replace with forward slashes and a relative path representation. Additionally, the "(待创建)" labels are removed from the two frontend directory entries because both projects now exist.

- [ ] **Step 1: Edit CLAUDE.md — fix directory structure**

Replace:
```
D:\Program\tools\
├── easywork\          ← 后端 Spring Boot（主仓库）
├── easywork-admin\    ← 管理端前端 Vue3（待创建）
└── easywork-worker\   ← 工人端前端 Vue3（待创建）
```

With:
```
easyworks/
├── easywork/          ← 后端 Spring Boot（主仓库）
├── easywork-admin/    ← 管理端前端 Vue3
└── easywork-worker/   ← 工人端前端 Vue3
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: fix Windows-style backslash paths in CLAUDE.md"
```

---

## Chunk 4: Add .gitattributes

**Files:**
- Create: `.gitattributes`

Without `.gitattributes`, Git on Windows checks out files with CRLF line endings. Shell scripts with CRLF endings fail on macOS/Linux. This file ensures consistent LF endings for all text files.

- [ ] **Step 1: Create .gitattributes**

```
# Default: auto-detect text files, normalize to LF in repo
* text=auto eol=lf

# Windows batch files must use CRLF
*.bat text eol=crlf
*.cmd text eol=crlf

# Binary files — no EOL conversion
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.jar binary
*.class binary
```

- [ ] **Step 2: Commit**

```bash
git add .gitattributes
git commit -m "chore: add .gitattributes to enforce LF line endings cross-platform"
```

---

## Chunk 5: Delete 前端待办.md

**Files:**
- Delete: `前端待办.md`

This is a temporary planning document that is no longer needed. Do not skip this chunk — `前端待办.md` contains three additional Windows-style `D:\` paths (lines 43, 60, 123) and deletion is the fastest resolution. If this chunk is skipped, the repo still contains Windows-specific paths despite Chunks 1–4 being complete.

- [ ] **Step 1: Delete file**

```bash
git rm 前端待办.md
```

- [ ] **Step 2: Commit**

```bash
git commit -m "chore: remove obsolete 前端待办.md planning document"
```
