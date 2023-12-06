<template>
  <NLayout>
    <NCard :title="`Welcome to ${SystemName}`">
      <NTabs default-value="login" size="large" animated justify-content="space-evenly">
        <NTabPane name="login" tab="账号密码登录">
          <NForm ref="formRef" :model="model" :rules="rules" :show-label="false">
            <NSpace vertical size="large">
              <NFormItem path="phoneNumber">
                <NInput
                  v-model:value="model.phoneNumber"
                  placeholder="请输入您的账号"
                  size="large"
                />
              </NFormItem>
              <NFormItem path="pwd">
                <NInput
                  type="password"
                  v-model:value="model.pwd"
                  placeholder="请输入您的密码"
                  size="large"
                />
              </NFormItem>
              <NFormItem>
                <NButton type="primary" block :loading="loading" @click="onSubmit" size="large">
                  登录
                </NButton>
              </NFormItem>
            </NSpace>
          </NForm>
        </NTabPane>
        <NTabPane name="signup" tab="手机验证码登录">
          <NForm ref="formRef" :model="model" :rules="rules" :show-label="false">
            <NSpace vertical size="large">
              <NFormItem path="phoneNumber">
                <NInput
                  v-model:value="model.phoneNumber"
                  placeholder="请输入您的账号"
                  size="large"
                />
              </NFormItem>
              <NFormItem path="code">
                <NSpace class="flex justify-between" justify="space-evenly">
                  <NInput v-model:value="model.code" placeholder="请输入验证码" size="large" />
                  <NButton size="large" :disabled="verCodeButtonDisabled">
                    {{ getVerCodeButtonText }}
                  </NButton>
                </NSpace>
              </NFormItem>
              <NFormItem>
                <NButton type="primary" block :loading="loading" @click="onSubmit" size="large">
                  登录
                </NButton>
              </NFormItem>
            </NSpace>
          </NForm>
        </NTabPane>
      </NTabs>
    </NCard>
    <div class="copy">&copy; 2023 - 2025 {{ SystemName }}</div>
  </NLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  NButton,
  NLayout,
  NCard,
  NForm,
  NFormItem,
  NSpace,
  NInput,
  useMessage,
  NTabs,
  NTabPane
} from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'

import { router } from '@/router'
import { SystemName } from '@/config'
import { sleep } from '@/utils/tools'
import { useUserBaseStore } from '@/stores/user'
import type { LoginProps } from '@/types/user'

const message = useMessage()
const { setUserInfo } = useUserBaseStore()

const loading = ref(false)
const formRef = ref<FormInst | null>(null)
const getVerCodeButtonText = ref('获取验证码')

const model = ref<LoginProps>({
  phoneNumber: '13312345679',
  pwd: '123456',
  code: ''
})

const verCodeButtonDisabled = computed(() => {
  return (
    // !/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/.test(model.value.email) ||
    // getVerCodeButtonText.value !== '请输入收到的验证码'
    false
  )
})

const rules: FormRules = {
  phoneNumber: [{ required: true, message: '请输入您的账号', trigger: ['input', 'blur'] }],
  pwd: [{ required: true, message: '请输入您的密码', trigger: ['input', 'blur'] }],
  code: [{ required: true, message: '请输入收到的验证码', trigger: ['input', 'blur'] }]
}

const onSubmit = () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      // console.log(model.value)
      loading.value = true
      await sleep(2000)
      const userBase = await login(model.value)
      message.success('登录成功')
      setUserInfo(userBase)
      setToken(userBase.token)
      loading.value = false
      router.push('/main')
    }
  })
}
onMounted(async () => {
  if (getToken()) {
    const userBase = await getProfile()
    if (userBase) {
      setUserInfo(userBase)
      router.push('/main')
    }
  }
})

// import ThemeChangeButton from '@@/core/ThemeChangeButton.vue'
</script>

<style lang="scss" scoped>
.n-layout {
  min-height: 100vh;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.n-card {
  width: 500px;
}

.copy {
  text-align: center;
  color: #999;
  margin-top: 10px;
  font-size: 12px;
}
</style>
