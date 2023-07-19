const classnames = `w-[1180px] hello yourClasses px-[15px] hover:text-[red] text-[18px] text-[0.3rem] 
text-[#808082] mx-auto py-[10px] mx-[10px] my-[20px] 
border-[1px] border-[black]  flex items-center justify-between h-[64px] md:mx-auto`



const vue = `<script lang="ts" setup>
import { ref } from 'vue'
import { NButton, NInput, NSlider, useMessage } from 'naive-ui'
import { useSettingStore } from '@/store'
import type { SettingsState } from '@/store/modules/settings/helper'
import { t } from '@/locales'

const settingStore = useSettingStore()

const ms = useMessage()

const systemMessage = ref(settingStore.systemMessage ?? '')

const temperature = ref(settingStore.temperature ?? 0.5)

const top_p = ref(settingStore.top_p ?? 1)

function updateSettings(options: Partial<SettingsState>) {
  settingStore.updateSetting(options)
  ms.success(t('common.success'))
}

function handleReset() {
  settingStore.resetSetting()
  ms.success(t('common.success'))
  window.location.reload()
}
</script>

<template>
    //--------------------- take a good look at this line --------------------
  <div class="p-4 space-y-5 min-h-[200px] myClassName">
     //--------------------- take a good look at this line --------------------
    <div class="space-y-6" style="background:red;">
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[120px]">{{ $t('setting.role') }}</span>
        <div class="flex-1">
          <NInput v-model:value="systemMessage" type="textarea" :autosize="{ minRows: 1, maxRows: 4 }" />
        </div>
        <NButton size="tiny" text type="primary" @click="updateSettings({ systemMessage })">
          {{ $t('common.save') }}
        </NButton>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[120px]">{{ $t('setting.temperature') }} </span>
        <div class="flex-1">
          <NSlider v-model:value="temperature" :max="1" :min="0" :step="0.1" />
        </div>
        <span>{{ temperature }}</span>
        <NButton size="tiny" text type="primary" @click="updateSettings({ temperature })">
          {{ $t('common.save') }}
        </NButton>
      </div>
          //--------------------- take a good look at this line --------------------
      <div :class="\`flex items-center hhhhh space-x-4\`">
        <span class="flex-shrink-0 w-[120px]">{{ $t('setting.top_p') }} </span>
        <div class="flex-1">
          <NSlider v-model:value="top_p" :max="1" :min="0" :step="0.1" />
        </div>
        <span>{{ top_p }}</span>
        <NButton size="tiny" text type="primary" @click="updateSettings({ top_p })">
          {{ $t('common.save') }}
        </NButton>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[120px]">&nbsp;</span>
        <NButton size="small" @click="handleReset">
          {{ $t('common.reset') }}
        </NButton>
      </div>
    </div>
  </div>
</template>
`



const jsx = `import Background from "./commonComponents/Background";
import logo from "./assets/images/zkt/zkt.png"




const Header = () => {
      //--------------------- take a good look at this line --------------------
    return <div className="min-w-[1180px] bg-[#F1F5FA] myClassName">
        //--------------------- take a good look at this line --------------------
        <div className="w-[1180px] mx-auto flex items-center justify-between h-[64px]" style={{background:"red"}}>
            <div className="flex items-center">
                  //--------------------- take a good look at this line --------------------
                <div className={\`w-full h - [680px] myclass\`}></div>
                <div className="w-[97px] h-[24px] relative">
                    <Background src={logo} />
                </div>
                <div className="w-[1px] h-[16px] mx-[12px] bg-[#C0C3CA]"></div>
                <div className="text-[#9EA2AB] text-[14px] font-normal">这是一段文字</div>
            </div>
        </div>
    </div>;
};

export default Header
`


export {
    jsx, vue, classnames
}