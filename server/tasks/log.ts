export default defineTask({
  meta: {
    name: 'log',
    description: 'Logs a message to the console',
  },
  run({ name, payload, context }) {
    const logTime = new Date().toLocaleTimeString()
    console.log(`[${logTime}] Task "${name}" executed with payload:`, payload, 'and context:', context)
    return { result: true }
  }
})