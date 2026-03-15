# Todo

## 待办

### P1 — 键盘输入 Bug 修复（进行中）
- [ ] `useHardwareInput.js` capture phase 在输入框聚焦时仍拦截事件，导致 Web 端无法正常键盘录入（已有修复提交，待验证）

---

## 已完成（2026-03-15）

- [x] **P1** `useHardwareInput.js` — 硬件输入语义化层（扫码枪识别 50ms 阈值、方向键导航、数字快捷键 1-5、ESC 返回）
- [x] **P1** `KeyHints.vue` — 固定在 tabbar 上方的快捷键提示条
- [x] **P1** `WorkOrderListView` — 替换 usePhysicalKeys → useHardwareInput；onScan 扫码开工后刷新并跳转详情
- [x] **P1** `WorkOrderDetailView` — 数字快捷键 1=开工/2=报工/3=质检/4=撤销/5=返工；报工对话框开启时数字键追加数量；ESC 先关对话框再返回；onScan 尝试开工/报工
- [x] **P1** `ScanView` — 开工/报工模式切换（Tab 键）；onScan 自动触发；KeyHints

## 已完成（2026-03-14）

- [x] **P0** WorkOrderStatus 新增 SCRAPPED 终态（V1.5 migration）
- [x] **P0** ReportService 按 orderType 分支处理状态流转
- [x] **P0** ReportService 串行前置工序依赖检查
- [x] **P0** OperationDependencyService.getPredecessors() 查询方向 Bug 修复
- [x] **P0** DeviceController 扫码枪班组+用户优先级匹配逻辑补全
- [x] **P0** 新增 POST /api/device/inspect（检验员工人端提交质检）
- [x] **P0** InspectionService 扩展 REWORK/SCRAP 处理
- [x] **P0** 工人端报工数量预填（剩余量）+ 上限校验
- [x] **P1** 工人端检验工单显示「提交质检」按钮（替代「报工」）
- [x] **P1** 工人端 / 管理端状态标签按 orderType 映射（statusLabel.js）
- [x] **P1** T9 九键键盘集成到工人端登录页密码输入
- [x] **P1** 管理端 InspectionView 改为只读（质检操作移至工人端）
- [x] **P1** 管理端工单创建 orderType 选项修正（PRODUCTION/INSPECTION/TRANSPORT/ANDON）
- [x] **P2** force-start-before-report 配置（默认 false）
- [x] **P1** `easywork-worker/src/views/ScanView.vue` — 调用摄像头或接收扫码枪键盘输入
- [x] **P1** 路由注册 `/scan`，入口放在工单列表页顶部
- [x] **P1** 扫码后调用 `POST /device/scan/start` 或 `POST /device/scan/report`，自动跳转结果
- [x] **P1** `BatchView.vue` — 多选工序 + 批量开工/报工
- [x] **P1** 调用 `POST /device/batch/start` / `POST /device/batch/report`
- [x] **P2** `WorkOrderEditView.vue` — 编辑工单基本信息（产品名/数量/时间/备注）
- [x] **P2** 需后端新增 `PUT /api/admin/work-orders/:id` 接口
- [x] **P2** 按 orderType 分组展示完成率
- [x] **P2** 质检通过率趋势图（折线图，ECharts）
- [x] **P3** 管理端工单详情页：工序依赖关系用有向图展示（Vue Flow）
