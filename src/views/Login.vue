<template>
  <NLayout>
    <div class="login-card">
      <img class="photo" src="/image/photographer.svg" />
      <div class="form">
        <div class="content">
          <span class="welcome">欢迎使用和拍传图系统</span>
          <span>请登录</span>
          <NForm ref="formRef" :model="model" :rules="rules" :show-label="false">
            <NFormItem path="phoneNumber">
              <NInput v-model:value="model.phoneNumber" placeholder="请输入手机号" size="large" />
            </NFormItem>
            <NFormItem path="code">
              <NInput
                v-model:value="model.code"
                maxlength="6"
                placeholder="请输入验证码"
                size="large"
              >
                <template #suffix>
                  <div
                    :class="{
                      disabled: verCodeButtonDisabled,
                      vertifycode: !verCodeButtonDisabled
                    }"
                    size="large"
                    :disabled="verCodeButtonDisabled"
                    @click="verCodeButtonDisabled || onGetPhoneVerifyCode(model.phoneNumber)"
                  >
                    {{ isGetingVerCode ? getCodeLoadingSecond + '秒' : '获取验证码' }}
                  </div>
                </template>
              </NInput>
            </NFormItem>
            <NFormItem>
              <NCheckbox class="check" v-model:checked="model.agreeTerms">
                <span>
                  阅读并同意我们的<span class="blue">“服务协议与隐私条款”</span>以及
                  <span class="blue">个人信息保护指引</span>
                </span>
              </NCheckbox>
            </NFormItem>
            <NFormItem class="login">
              <NButton type="primary" block :loading="loading" @click="onSubmit" size="large">
                登录
              </NButton>
            </NFormItem>
          </NForm>
        </div>
      </div>
    </div>
    <div class="copy">&copy; 2023 - 2025 {{ SystemName }}</div>
  </NLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useMessage, useLoadingBar } from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'

import { router } from '@/router'
import { SystemName } from '@/config'
import { sleep, isPhone } from '@/utils/tools'
import type { LoginProps } from '@/types/user'
import { usePhoneVerifyCode } from '@/hooks/useUser'
import * as LoginApi from '@/api/login'
import * as authUtil from '@/utils/auth'
import { CACHE_KEY, useCache } from '@/hooks/useCache'
import { getAccessToken } from '@/utils/auth'

const message = useMessage()
const loading = ref(false)
const formRef = ref<FormInst | null>(null)
const { isGetingVerCode, getCodeLoadingSecond, onGetPhoneVerifyCode } = usePhoneVerifyCode()

const model = ref<LoginProps>({
  phoneNumber: '',
  code: '',
  agreeTerms: false
})
const { wsCache } = useCache()
const verCodeButtonDisabled = computed(() => {
  return !isPhone(model.value.phoneNumber) || isGetingVerCode.value === true
})

const rules: FormRules = {
  phoneNumber: [{ required: true, message: '请输入您的账号', trigger: ['input', 'blur'] }],
  code: [{ required: true, message: '请输入收到的验证码', trigger: ['input', 'blur'] }]
}
const loadingBar = useLoadingBar()

const onSubmit = () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      if (!model.value.agreeTerms) {
        message.warning('请先阅读并同意服务协议与隐私条款以及个人信息保护指引')
        return
      }
      // 1 会员  3 摄影师 diff
      const data = {
        mobile: model.value.phoneNumber,
        scene: 1,
        userType: 3,
        code: model.value.code
      }
      const res = await LoginApi.smsLogin(data)
      loadingBar.start()
      loading.value = true
      await sleep(2000)
      message.success('登录成功')
      authUtil.setToken(res)
      const userInfo = await LoginApi.getUserInfo()
      wsCache.set(CACHE_KEY.USER, userInfo)
      loading.value = false
      router.push('/order')
      loadingBar.finish()
    } else {
      const content = errors[0][0].message
      message.error(content || '')
    }
  })
}
onMounted(async () => {
  if (getAccessToken()) {
    router.push('/order')
  }
})
</script>

<style lang="scss" scoped>
.n-layout {
  min-height: 100vh;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  background-color: #eeecef;
}

.login-card {
  display: flex;
  width: 983px;
  height: 540px;
  border-radius: 16px;
}

.photo {
  width: 495px;
  height: 540px;
}

.form {
  flex-grow: 1;
  background-color: #fff;
  border-radius: 0 16px 16px 0;
  .content {
    display: flex;
    flex-direction: column;
    margin-top: 49px;
    margin-left: 64px;
    width: 360px;
    > span:first-child {
      font-size: 28px;
      margin-bottom: 34px;
    }
    > span:nth-child(2) {
      font-size: 20px;
      font-weight: 50;
      margin-bottom: 20px;
    }
    .disabled {
      color: rgba(194, 194, 194, 1);
    }
    .vertifycode {
      &:hover {
        cursor: pointer;
        color: #ba2636;
      }
      position: relative;
    }
    .check span {
      color: rgba(194, 194, 194, 1);
      .blue {
        color: #264fba;
      }
    }
    .login {
      margin-top: 70px;
    }
  }
}

.copy {
  text-align: center;
  color: #999;
  margin-top: 10px;
  font-size: 12px;
}
</style>
