<!--CAD引线UI界面-->
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
      class="lead-line-form"
    >
      <template #content>
        <div class="fs-dlg-left">
          <div class="fs-cad-card">
            <div class="fs-cad-card-title">
              <fs-checkbox
                v-model="formParams.leadIn"
                v-bind="titleArgs"
                title="引入线"
              />
              <fs-select
                v-model="formParams.inGraphic"
                v-bind="curArgs"
                width="9.5rem"
              />
            </div>
            <div class="fs-card-content" :class="{ 'disabled-content': !formParams.leadIn }">
              <div class="fs-split-H-js">
                <span style="color: var(--text-color-primary)">长度</span>
                <fs-input
                  v-model="formParams.leaderInSize"
                  v-bind="curAttrs"
                  unit="mm"
                  width="8rem"
                  :min="0.001"
                  :max="10"
                />
              </div>
              <div class="fs-split-H-js">
                <span style="color: var(--text-color-primary)">圆弧半径</span>
                <fs-input
                  v-model="formParams.arcRadius"
                  v-bind="curAttrs"
                  :disabled="testDisabled"
                  unit="mm"
                  width="8rem"
                  :min="0.001"
                  :max="10"
                />
              </div>
              <div class="fs-split-H-js">
                <span style="color: var(--text-color-primary)">角度</span>
                <fs-input
                  v-model="formParams.leaderInAngle"
                  v-bind="curAttrs"
                  unit="°"
                  width="8rem"
                  :min="0.001"
                  :max="10"
                />
              </div>
              <div class="horizontal-line" />
              <div class="fs-split-V3-js">
                <fs-checkbox
                  v-model="formParams.pointCooling"
                  v-bind="curArgs"
                  title="引入点冷却"
                />
                <fs-checkbox
                  v-model="formParams.continuousCutting"
                  v-bind="curArgs"
                  title="连割"
                />
              </div>
            </div>
          </div>
          <div class="fs-cad-card">
            <div class="fs-cad-card-title">
              <fs-checkbox
                v-model="formParams.leadOut"
                v-bind="titleArgs"
                title="引出线"
              />
              <fs-select
                v-model="formParams.outGraphic"
                v-bind="curArgs"
                width="9.5rem"
              />
            </div>
            <div class="fs-card-content" :class="{ 'disabled-content': !formParams.leadOut }">
              <div class="fs-split-H-js">
                <!-- style最好放到样式层级统一编写，可以用标签选择器或类继承实现 -->
                <span style="color: var(--text-color-primary)">长度</span>
                <fs-input
                  v-model="formParams.leaderOutSize"
                  v-bind="curAttrs"
                  unit="mm"
                  width="8rem"
                  :min="0.001"
                  :max="10"
                />
              </div>
              <div class="fs-split-H-js">
                <span style="color: var(--text-color-primary)">角度</span>
                <fs-input
                  v-model="formParams.leaderOutAngle"
                  v-bind="curAttrs"
                  unit="°"
                  width="8rem"
                  :min="0.001"
                  :max="10"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="fs-dlg-right">
          <div
            class="fs-cad-card"
          >
            <div class="fs-cad-card-title fs-cad-card-title2">引线位置</div>
            <div class="fs-card-content">
              <fs-checkbox
                v-model="formParams.leaderStartPosition"
                v-bind="curArgs"
                title="切断面引线起点位置"
              />
              <div class="fs-split-H-js">
                <span style="color: var(--text-color-primary); margin-left: 2.2rem">与X轴所成角度</span>
                <fs-input
                  v-model="formParams.xAngle"
                  style="width: 12.6875rem; Height: 3rem"
                  size="xl"
                  :disabled="!formParams.leaderStartPosition"
                  unit="°"
                  width="8rem"
                  :min="0.001"
                  :max="10"
                />
              </div>
              <fs-checkbox
                v-model="formParams.changeFaceLeaderPosition"
                v-bind="curArgs"
                style="margin-top: 0.5rem"
                title="更改管面孔引线位置"
              />
              <fs-radio-group
                v-bind="curAttrs" v-model="formParams.test" :list="RADIO_OPTIONS"
                style="margin-left: 2.1rem"
              />
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
                width="13rem"
              />
            </div>
            <div class="fs-card-content">
              <FsCheckboxGroup v-bind="args2" v-model="checkList" />
            </div>
          </div>
        </div>
      </template>
    </FsPropertyPanel>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

/* 根据引线业务逻辑提前定义常量，方便公共部分抽离 */
const GRAPHIC_OPTIONS = [
  { name: '对选中图形生效', id: 1 },
  { name: '对所有图形生效', id: 2 }
]
const LINE_TYPE_OPTIONS = [
  { name: '直线', id: 1 },
  { name: '直线圆弧', id: 2 }
]
const RADIO_OPTIONS = [
  { label: 'A', title: '起点置于孔最远端' },
  { label: 'B', title: '起点置于孔最近端' },
  { label: 'C', title: '优先从长边引入' },
  { label: 'D', title: '优先从顶点引入' }
]
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
/* 用计算属性处理圆弧半径的显示逻辑 */
const testDisabled = computed(() => Number(formParams.value.inGraphic) === 1)
const props = defineProps({
  args: {
    type: Object,
    default: () => ({})
  },
  size: {
    type: String,
    default: 'xl'
  }
})
const args = computed(() => ({
  title: '引线',
  panelDesc: '使激光从外部平滑切入轮廓起点，可提升起割点的精度和光洁度',
  headerIcon: 'leadline',
  panelName: 'leadline',
  size: 'xxl',
  ...props.args
}))
const titleArgs = computed(() => ({
  size: props.size,
  ...props.args
}))
/* 模板中自带的该panel的点击事件，斌斌看看修改一下 */
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

/* 提取下拉框的公共逻辑 */
const getSelectArgs = (options, size) => ({
  disabled: false,
  'allow-create': false,
  filterable: false,
  clearable: false,
  addOptionAttr: {
    disabled: false
  },
  options,
  size,
  ...props.args
})

const curArgs = computed(() => getSelectArgs(LINE_TYPE_OPTIONS, props.size))
const graphicArgs = computed(() => getSelectArgs(GRAPHIC_OPTIONS, props.size))
const args2 = reactive({
  list: [
    { label: 'close', title: '仅作用于封闭图形' },
    { label: 'cut', title: '对切断线生效' },
    { label: 'hole', title: '对孔生效' }
  ],
  direction: 'vertical',
  size: props.size
})
const checkList = ref(['close', '仅作用于封闭图形'])
const curAttrs = computed(() => ({
  direction: 'vertical',
  ...props.args,
  size: props.size
}))
</script>

<style lang="less">
.lead-line-form{
  .el-dialog {
    height: 54.25rem !important;
  }
}
</style>
<style lang="less" scoped>
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
.fs-cad-card-title{
  gap: 8px;
  margin-top: 10px;
  justify-content: space-between;
  .fs-checkbox-label{
    color: var(--text-color-primary) !important;
    font-weight: 400 !important;
  }
}
.fs-cad-card-title2{
  gap: 8px;
  margin-top: 20px;
  align-items: center;
 }
.fs-split-V3-js {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 0.5rem;
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
