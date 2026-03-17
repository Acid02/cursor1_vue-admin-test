<template>
  <div class="dash">
    <div class="hero">
      <div class="title">
        <div class="kicker">GIS · Data Ops</div>
        <div class="headline">运营态势总览</div>
        <div class="meta">实时监测 · 空间分析 · 趋势研判</div>
      </div>
      <div class="hero-actions">
        <el-button type="primary" @click="onPrint">
          <el-icon><Printer /></el-icon>
          打印报表
        </el-button>
        <el-button @click="openMapPreview">
          <el-icon><FullScreen /></el-icon>
          地图预览
        </el-button>
      </div>
    </div>

    <el-row :gutter="12">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="kpi-card">
          <div class="kpi">
            <div class="label">今日访问</div>
            <div class="value">12,345</div>
            <div class="delta up">+8.2%</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="kpi-card">
          <div class="kpi">
            <div class="label">活跃设备</div>
            <div class="value">1,024</div>
            <div class="delta up">+2.1%</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="kpi-card">
          <div class="kpi">
            <div class="label">告警事件</div>
            <div class="value">3</div>
            <div class="delta down">-1</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="kpi-card">
          <div class="kpi">
            <div class="label">SLA</div>
            <div class="value">99.97%</div>
            <div class="delta neutral">稳定</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="12" class="row2">
      <el-col :xs="24" :md="14">
        <el-card class="panel">
          <template #header>
            <div class="panel-hd">
              <div class="panel-title">趋势分析</div>
              <el-tag type="info" effect="plain">ECharts</el-tag>
            </div>
          </template>
          <div ref="trendRef" class="chart" />
        </el-card>
      </el-col>
      <el-col :xs="24" :md="10">
        <el-card class="panel map-panel">
          <template #header>
            <div class="panel-hd">
              <div class="panel-title">地图概览</div>
              <div class="hd-right">
                <el-tag type="success" effect="plain">Leaflet</el-tag>
                <el-button size="small" text @click="openMapPreview">放大预览</el-button>
              </div>
            </div>
          </template>
          <div ref="mapRef" class="map" />
          <div class="map-badges">
            <div class="badge">在线：1,024</div>
            <div class="badge">热点：7</div>
            <div class="badge">风险：中</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="12" class="row2">
      <el-col :xs="24" :md="10">
        <el-card class="panel">
          <template #header>
            <div class="panel-hd">
              <div class="panel-title">区域占比</div>
              <el-tag type="info" effect="plain">ECharts</el-tag>
            </div>
          </template>
          <div ref="pieRef" class="chart" />
        </el-card>
      </el-col>
      <el-col :xs="24" :md="14">
        <el-card class="panel">
          <template #header>
            <div class="panel-hd">
              <div class="panel-title">事件流（预览）</div>
              <el-tag type="warning" effect="plain">占位</el-tag>
            </div>
          </template>
          <div class="events">
            <div v-for="e in events" :key="e.id" class="event">
              <div class="dot" :class="e.level" />
              <div class="body">
                <div class="line1">
                  <span class="name">{{ e.name }}</span>
                  <span class="time">{{ e.time }}</span>
                </div>
                <div class="line2">{{ e.desc }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="mapPreviewVisible" title="地图预览" width="92%" top="4vh" destroy-on-close>
      <div ref="mapPreviewRef" class="map-preview" />
      <template #footer>
        <el-button @click="mapPreviewVisible = false">关闭</el-button>
        <el-button type="primary" @click="onPrint">打印当前报表</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { FullScreen, Printer } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const trendRef = ref<HTMLDivElement>()
const pieRef = ref<HTMLDivElement>()
const mapRef = ref<HTMLDivElement>()
const mapPreviewRef = ref<HTMLDivElement>()

let trendChart: echarts.ECharts | null = null
let pieChart: echarts.ECharts | null = null
let map: L.Map | null = null
let mapPreview: L.Map | null = null

const mapPreviewVisible = ref(false)

const events = reactive([
  { id: 'e1', level: 'ok', name: '边界服务', time: '刚刚', desc: '切片服务延迟恢复正常。' },
  { id: 'e2', level: 'warn', name: '区域热点', time: '2 分钟前', desc: '华东区域请求量上升，建议扩容。' },
  { id: 'e3', level: 'danger', name: '告警中心', time: '10 分钟前', desc: '某站点离线，已自动转移流量。' }
])

function mountTrend() {
  if (!trendRef.value) return
  trendChart = echarts.init(trendRef.value, undefined, { renderer: 'canvas' })
  trendChart.setOption({
    grid: { left: 40, right: 18, top: 22, bottom: 28 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.18)' } },
      axisLabel: { color: 'rgba(255,255,255,0.68)' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
      axisLabel: { color: 'rgba(255,255,255,0.6)' }
    },
    tooltip: { trigger: 'axis' },
    series: [
      {
        name: '请求量',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: [120, 240, 360, 520, 480, 610, 700],
        lineStyle: { width: 3, color: '#7c5cff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(124,92,255,0.35)' },
            { offset: 1, color: 'rgba(124,92,255,0.02)' }
          ])
        }
      }
    ]
  })
}

function mountPie() {
  if (!pieRef.value) return
  pieChart = echarts.init(pieRef.value, undefined, { renderer: 'canvas' })
  pieChart.setOption({
    tooltip: { trigger: 'item' },
    legend: {
      bottom: 0,
      textStyle: { color: 'rgba(255,255,255,0.68)' }
    },
    series: [
      {
        name: '区域',
        type: 'pie',
        radius: ['42%', '68%'],
        avoidLabelOverlap: true,
        label: { color: 'rgba(255,255,255,0.75)' },
        data: [
          { value: 1048, name: '华东' },
          { value: 735, name: '华南' },
          { value: 580, name: '华北' },
          { value: 484, name: '西南' },
          { value: 300, name: '东北' }
        ]
      }
    ]
  })
}

function mountMap(container: HTMLElement): L.Map {
  const m = L.map(container, {
    zoomControl: false,
    attributionControl: false,
    center: [31.2304, 121.4737],
    zoom: 10
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(m)

  L.circleMarker([31.2304, 121.4737], {
    radius: 8,
    color: '#7c5cff',
    weight: 2,
    fillColor: '#7c5cff',
    fillOpacity: 0.35
  })
    .addTo(m)
    .bindPopup('中心节点：正常')

  return m
}

function openMapPreview() {
  mapPreviewVisible.value = true
  nextTick(() => {
    if (!mapPreviewRef.value) return
    if (mapPreview) {
      mapPreview.invalidateSize()
      return
    }
    mapPreview = mountMap(mapPreviewRef.value)
    setTimeout(() => mapPreview?.invalidateSize(), 60)
  })
}

function onPrint() {
  window.print()
}

function onResize() {
  trendChart?.resize()
  pieChart?.resize()
  map?.invalidateSize()
  mapPreview?.invalidateSize()
}

onMounted(async () => {
  await nextTick()
  mountTrend()
  mountPie()
  if (mapRef.value) {
    map = mountMap(mapRef.value)
    setTimeout(() => map?.invalidateSize(), 60)
  }
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  trendChart?.dispose()
  pieChart?.dispose()
  map?.remove()
  mapPreview?.remove()
  trendChart = null
  pieChart = null
  map = null
  mapPreview = null
})
</script>

<style scoped>
.dash {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 2px;
  color: rgba(255, 255, 255, 0.86);
}

.dash :deep(.el-card) {
  background: radial-gradient(1200px 400px at 0% 0%, rgba(124, 92, 255, 0.18), transparent 50%),
    radial-gradient(900px 360px at 100% 0%, rgba(0, 209, 178, 0.12), transparent 55%),
    linear-gradient(180deg, rgba(12, 14, 22, 0.96), rgba(10, 12, 18, 0.96));
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.35);
}

.hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 6px 2px;
}

.kicker {
  font-size: 12px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.58);
}

.headline {
  font-size: 26px;
  font-weight: 900;
  letter-spacing: 0.2px;
  margin-top: 6px;
}

.meta {
  margin-top: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.56);
}

.hero-actions {
  display: flex;
  gap: 10px;
}

.kpi-card :deep(.el-card__body) {
  padding: 16px 16px 14px;
}

.kpi .label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}
.kpi .value {
  font-size: 28px;
  font-weight: 900;
  margin-top: 10px;
}
.delta {
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
}
.delta.up {
  color: rgba(0, 209, 178, 0.95);
}
.delta.down {
  color: rgba(245, 108, 108, 0.95);
}
.delta.neutral {
  color: rgba(255, 255, 255, 0.68);
}

.panel :deep(.el-card__header) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.panel-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.panel-title {
  font-weight: 800;
  letter-spacing: 0.2px;
}

.hd-right {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.chart {
  height: 320px;
}

.map-panel :deep(.el-card__body) {
  position: relative;
  padding: 12px;
}

.map {
  height: 320px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.map-badges {
  position: absolute;
  left: 22px;
  bottom: 22px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  pointer-events: none;
}

.badge {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.78);
  background: rgba(0, 0, 0, 0.38);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
}

.events {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.event {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 6px;
  box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.02);
}
.dot.ok {
  background: rgba(0, 209, 178, 0.95);
}
.dot.warn {
  background: rgba(230, 162, 60, 0.95);
}
.dot.danger {
  background: rgba(245, 108, 108, 0.95);
}

.line1 {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.name {
  font-weight: 800;
}
.time {
  color: rgba(255, 255, 255, 0.55);
  font-size: 12px;
}
.line2 {
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.62);
  font-size: 12px;
  line-height: 1.6;
}

.map-preview {
  height: 78vh;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
}
</style>

