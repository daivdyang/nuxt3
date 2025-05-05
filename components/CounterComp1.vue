<template>
  <div>
    <h4>Run on Server side(Counter Lazy)</h4>
    <div>
      Counter: {{ counter }}
      <button @click="counter++">
        +
      </button>
      <button @click="counter--">
        -
      </button>
    </div>
    <button @click="onClick">
        Go to Hello
      </button>
  </div>
</template>
<script setup lang="ts">

const props = withDefaults(defineProps<{ delay?: boolean }>(), { delay: false })
const router = useRouter()
if (props.delay) {
  console.log('start run Counter Comp1.vue....')
  await new Promise((res) => setTimeout(res, 3000))
  console.log('after 3s')
}
const counter = useState('counter', () => {
  const rndNumber = Math.round(Math.random() * 1000)
  console.log('rndNumber', rndNumber)
  return rndNumber
})
function onClick() {
  router.push('/hello')
}

onPrehydrate((el) => {
  console.log('before hydration', el.outerHTML)
})
</script>