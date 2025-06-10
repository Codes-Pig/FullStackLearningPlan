<template>
  <div>
    <FsButton title="设置引线" @click="panelVisible = true" />
    <FsPropertyPanel
      v-bind="args"
      v-model="panelVisible"
      @enlarge="changeEnlarge"
      @opened="openDlg"
      @closed="onClosed"
      @confirm="onConfirm"
      @closeDlg="closeDlg"
    >
      <template #content>
        <div class="fs-dlg-left">
          <div class="fs-cad-card">
            <div class="fs-cad-card-title">
              <fs-checkbox
                v-model="formParams.leadIn"
                title="引入线"
              />
              <fs-select
                v-model="formParams.inGraphic"
                v-bind="curArgs"
                width="6.5rem"
              />
            </div>
            <div class="fs-card-content" :class="{ 'disabled-content': !formParams.leadIn }">
              <div class="fs-split-H-js">
                <span style="color: var(--text-color-primary)">长度</span>
                <fs-input
                  v-model="formParams.leaderInSize"
                  unit="mm"
                  width="8rem"
                  :min="0.001"
                  :max="10"
                  size="H32"
                />
              </div>
              <div class="fs-split-H-js">
                <span style="color: var(--text-color-primary)">圆弧半径</span>
                <fs-input
                  v-model="formParams.arcRadius"
                  :disabled="testDisabled"
                  unit="mm"
                  width="8rem"
                  :min="0.001"
                  :max="10"
                  size="H32"
                />
              </div>
              <div class="fs-split-H-js">
                <span style="color: var(--text-color-primary)">角度</span>
                <fs-input
                  v-model="formParams.leaderInAngle"
                  unit="°"
                  width="8rem"
                  :min="0.001"
                  :max="10"
                  size="H32"
                />
              </div>
              <div class="horizontal-line" />
              <div class="fs-split-V-js">
                <div class="fs-checkbox-container">
                  <fs-checkbox
                    v-model="formParams.pointCooling"
                    title="引入点冷却"
                  />
                </div>
                <div class="fs-checkbox-container">
                  <fs-checkbox
                    v-model="formParams.continuousCutting"
                    title="连割"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="fs-cad-card">
            <div class="fs-cad-card-title">
              <fs-checkbox
                v-model="formParams.leadOut"
                title="引出线"
              />
              <fs-select
                v-model="formParams.outGraphic"
                v-bind="curArgs"
                width="6.5rem"
              />
            </div>
            <div class="fs-card-content" :class="{ 'disabled-content': !formParams.leadOut }">
              <div class="fs-split-H-js">
                <span style="color: var(--text-color-primary)">长度</span>
                <fs-input
                  v-model="formParams.leaderOutSize"
                  unit="mm"
                  width="8rem"
                  :min="0.001"
                  :max="10"
                  size="H32"
                />
              </div>
              <div class="fs-split-H-js">
                <span style="color: var(--text-color-primary)">角度</span>
                <fs-input
                  v-model="formParams.leaderOutAngle"
                  unit="°"
                  width="8rem"
                  :min="0.001"
                  :max="10"
                  size="H32"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="fs-dlg-right">
          <div
            class="fs-cad-card"
          >
            <div class="fs-cad-card-title">引线位置</div>
            <div class="fs-card-content">
              <fs-checkbox
                v-model="formParams.leaderStartPosition"
                title="切断面引线起点位置"
              />
              <div class="fs-split-H-js">
                <span style="color: var(--text-color-primary); margin-left: 1.5rem">与X轴所成角度</span>
                <fs-input
                  v-model="formParams.xAngle"
                  :disabled="!formParams.leaderStartPosition"
                  unit="°"
                  width="8rem"
                  :min="0.001"
                  :max="10"
                  size="H32"
                />
              </div>
              <fs-checkbox
                v-model="formParams.changeFaceLeaderPosition"
                style="margin-top: 0.5rem"
                title="更改管面孔引线位置"
              />
              <fs-radio-group v-bind="curAttrs" v-model="formParams.test" style="margin-left: 1.5rem">
                <fs-radio label="A" >起点置于孔最远端 </fs-radio>
                <fs-radio label="B" >起点置于孔最近端</fs-radio>
                <fs-radio label="C" >优先从长边引入</fs-radio>
                <fs-radio label="C" >优先从顶点引入</fs-radio>
              </fs-radio-group>
            </div>
          </div>
          <div
            class="fs-cad-card"
          >
            <div class="fs-cad-card-title fs-cad-card-title2">
              应用范围
              <fs-select
                v-model="formParams.graphic"
                v-bind="graphicArgs"
                width="9rem"
              />
            </div>
            <div class="fs-card-content">
              <fs-checkbox
                v-model="formParams.toEnclosed"
                title="仅作用于封闭图形"
              />
              <fs-checkbox
                v-model="formParams.toWire"
                style="margin-top: 0.5rem"
                title="对切断线生效"
              />
              <fs-checkbox
                v-model="formParams.toHole"
                style="margin-top: 0.5rem"
                title="对孔生效"
              />
            </div>
          </div>
        </div>
      </template>
    </FsPropertyPanel>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
defineOptions({
  name: 'Leader'
})
const panelVisible = ref(false)
const isEnlarge = ref(true)
const changeEnlarge = () => {
  isEnlarge.value = !isEnlarge.value
}
const formParams = ref({
  leaderInSize: 3,
  leaderInAngle: 90,
  leaderOutSize: 3,
  leaderOutAngle: 90,
  arcRadius: 3,
  xAngle: 0,
  leadIn: false,
  leadOut: false,
  inGraphic: 1,
  outGraphic: '直线',
  graphic: '对选中图形生效',
  pointCooling: false,
  continuousCutting: false,
  leaderStartPosition: false,
  changeFaceLeaderPosition: false,
  toWire: false,
  toHole: false,
  toEnclosed: false,
  test: 'A',
  stepper: 1
})
const testDisabled = computed(()=> Number(formParams.value.inGraphic) === 1)
const props = defineProps({
  args: {
    type: Object,
    default: () => ({})
  },
  size: String
})
const args = computed(() => ({
  title: '引线',
  panelDesc: '使激光从外部平滑切入轮廓起点，可提升起割点的精度和光洁度',
  headerIcon: 'leadline',
  panelName: 'leadline',
  size: props.size,
  ...props.args
}))
const compIconFillColor = (active) => {
  return active ? 'var(--brand-color-normal)' : 'var(--text-color-secondary)'
}

const openDlg = (panelName: string) => {
  console.log(`打开了${panelName}面板`)
}

const onClosed = (panelName: string) => {
  console.log(`关闭了${panelName}面板`)
}

const closeDlg = (panelName: string) => {
  console.log(`关闭${panelName}面板`)
}

const onConfirm = (panelName: string) => {
  console.log(`点击确认了${panelName}面板`)
}

const curArgs = computed(() => ({
  disabled: false,
  'allow-create': false,
  filterable: false,
  clearable: false,
  addOptionAttr: {
    disabled: false
  },
  options: [
    { name: '直线', id: 1, labelI18nKey: '直线' },
    { name: '直线圆弧', id: 2, labelI18nKey: '直线圆弧' }
  ],
  size: props.size,
  ...props.args
}))

const graphicArgs = computed(() => ({
  disabled: false,
  'allow-create': false,
  filterable: false,
  clearable: false,
  addOptionAttr: {
    disabled: false
  },
  options: [
    { name: '对选中图形生效', id: 1, labelI18nKey: '对选中图形生效' },
    { name: '对所有图形生效', id: 2, labelI18nKey: '对所有图形生效' }
  ],
  size: props.size,
  ...props.args
}))

const curAttrs = computed(() => ({
  ...props.args,
  size: props.size
}))
</script>

<style lang="less">
.fs-comp-icon {
  cursor: pointer;
  border: 1px solid var(--border-level-3-color);
  box-sizing: border-box;
  background: var(--fill-level-0-color);
  border-radius: var(--radius-medium);
  padding: 0.25rem 0.75rem;
  width: 3.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  &:not(:first-child) {
    margin-left: 0.5rem;
  }
  &.active {
    border: 0.125rem solid var(--brand-color-normal);
    background: var(--brand-color-light);
  }
}
.fs-compensate-card {
  box-sizing: border-box;
  width: 100%;
  height: 6rem;
  border: 1px dashed var(--brand-color-normal);
  background: var(--brand-color-light);
}
.fs-cad-card-title{
  gap: 7rem;
}
.fs-cad-card-title2{
  gap: 5rem;
  align-items: center
 }
.fs-split-V-js {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}
.fs-checkbox-container {
  display: flex;
  align-items: flex-start;
  width: 100%;
}
:deep(.radio-group){
  align-items: center !important;
}
.fs-stepper{
  margin-left: .625rem;
}
.disabled-content {
  opacity: 0.5;
  pointer-events: none;
}
.horizontal-line {
  border-top: 1px solid var(--border-level-3-color);
  margin-top: 0.5rem;
  width: 100%;
}
</style>
