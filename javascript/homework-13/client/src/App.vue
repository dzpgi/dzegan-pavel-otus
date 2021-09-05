<template>
  <TopPanel />
  <router-view :key="$route.fullPath" />
  <BottomPanel />
  <div class="widget" />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<script>
import BottomPanel from '@/views/BottomPanel'
import TopPanel from '@/views/TopPanel'

export default ({
  components: { TopPanel, BottomPanel },
  setup () {
    console.log('BOTTOM PANEL')
  }
})
</script>
