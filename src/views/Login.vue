<template>
  <NLayout>
    <NCard :title="`欢迎来到 ${SystemName}`" hoverable>
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
                <NSpace :size="20">
                  <NInput v-model:value="model.code" placeholder="请输入验证码" size="large" />
                  <NButton
                    size="large"
                    :disabled="verCodeButtonDisabled"
                    @click="onGetPhoneVerifyCode('Login', model.phoneNumber)"
                  >
                    {{ isGetingVerCode ? getCodeLoadingSecond + '秒' : '点击发送验证码' }}
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
  NTabPane,
  useLoadingBar
} from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'

import { router } from '@/router'
import { SystemName } from '@/config'
import { sleep, isPhone } from '@/utils/tools'
import type { LoginProps } from '@/types/user'
import { usePhoneVerifyCode } from '@/hooks/useUser'

const message = useMessage()

const loading = ref(false)
const formRef = ref<FormInst | null>(null)
const { isGetingVerCode, getCodeLoadingSecond, onGetPhoneVerifyCode } = usePhoneVerifyCode()

const model = ref<LoginProps>({
  phoneNumber: '18012858611',
  pwd: '123456',
  code: ''
})

const verCodeButtonDisabled = computed(() => {
  return !isPhone(model.value.phoneNumber) || isGetingVerCode.value === true
})

const rules: FormRules = {
  phoneNumber: [{ required: true, message: '请输入您的账号', trigger: ['input', 'blur'] }],
  pwd: [{ required: true, message: '请输入您的密码', trigger: ['input', 'blur'] }],
  code: [{ required: true, message: '请输入收到的验证码', trigger: ['input', 'blur'] }]
}
const loadingBar = useLoadingBar()

const onSubmit = () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      loadingBar.start()
      loading.value = true
      await sleep(2000)
      message.success('登录成功')
      loading.value = false
      router.push('/main')
      loadingBar.finish()
    }
  })
}
onMounted(async () => {
  // if (getToken()) {
  //   const userBase = await getProfile()
  //   if (userBase) {
  //     setUserInfo(userBase)
  //     router.push('/main')
  //   }
  // }
})
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
