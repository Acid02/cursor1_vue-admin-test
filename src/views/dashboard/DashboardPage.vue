<template>
  <div class="wrap">
    <el-row :gutter="12">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card>
          <div class="kpi">
            <div class="label">今日访问</div>
            <div class="value">12,345</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card>
          <div class="kpi">
            <div class="label">活跃用户</div>
            <div class="value">1,024</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card>
          <div class="kpi">
            <div class="label">转化率</div>
            <div class="value">3.6%</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card>
          <div class="kpi">
            <div class="label">告警</div>
            <div class="value">0</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="mt12">
      <template #header>
        <div class="card-hd">
          <span>趋势图（占位）</span>
          <el-tag type="info" effect="plain">可接入 ECharts / AntV</el-tag>
        </div>
      </template>
      <div class="chart-placeholder">
        <div class="grid" />
        <div class="text">Chart Placeholder</div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.kpi .label {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.55);
}
.kpi .value {
  font-size: 26px;
  font-weight: 800;
  margin-top: 8px;
}

.mt12 {
  margin-top: 12px;
}

.card-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chart-placeholder {
  height: 320px;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(64, 158, 255, 0.06), rgba(103, 194, 58, 0.05));
  border: 1px dashed rgba(0, 0, 0, 0.18);
  position: relative;
  overflow: hidden;
}

.chart-placeholder .grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(0, 0, 0, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.06) 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.4;
}

.chart-placeholder .text {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: rgba(0, 0, 0, 0.45);
  font-weight: 700;
  letter-spacing: 0.3px;
}
</style>

