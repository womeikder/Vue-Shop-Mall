<template>
  <div class="overlay"></div>
  <div class="loader"></div>
</template>

<style lang="scss" scoped>
.loader {
  width: 100px;
  aspect-ratio: 1;
  display: grid;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loader::before,
.loader::after {
  content: "";
  grid-area: 1 / 1;
  --c: no-repeat radial-gradient(farthest-side, #25b09b 92%, #0000);
  background:
      var(--c) 50% 0,
      var(--c) 50% 100%,
      var(--c) 100% 50%,
      var(--c) 0 50%;
  background-size: 30px 30px;
  animation: l12 1s infinite;
}

.loader::before {
  margin: 4px;
  filter: hue-rotate(45deg);
  background-size: 20px 20px;
  animation-timing-function: linear;
}

@keyframes l12 {
  100% {
    transform: rotate(.5turn);
  }
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.1);
  /* 半透明黑色背景 */
}
</style>
