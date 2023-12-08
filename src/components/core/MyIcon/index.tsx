import { ref, onMounted, defineComponent, computed } from 'vue'
import { NIcon } from 'naive-ui'
import Archer from 'archer-svgs'
import Icons from './icons'

const Icon = defineComponent({
  props: {
    name: String,
    size: [Number, String]
  },
  setup(props, { slots }) {
    const svgStr = ref('')
    const defaultSvg = (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <circle cx="256" cy="256" r="48" fill="currentColor"></circle>
        <circle cx="416" cy="256" r="48" fill="currentColor"></circle>
        <circle cx="96" cy="256" r="48" fill="currentColor"></circle>
      </svg>
    )

    const getData = async () => {
      if (props.name) {
        const iconUrl = `https://static.ai-chan.co/svg/${props.name}.svg`

        if (Icons.includes(props.name ?? '')) {
          const archer = new Archer()
          const svg = await archer.fetchSvg(iconUrl)
          svgStr.value = svg
        }
      }
    }
    onMounted(() => getData())

    const iconComponent = computed(() =>
      svgStr.value ? <i v-html={svgStr.value}></i> : slots.default ? slots.default()[0] : defaultSvg
    )
    return () => <NIcon size={props.size} component={iconComponent.value} />
  }
})

export default Icon
