<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <div>
    <NuxtRouteAnnouncer />
  </div>
  <Audio :start="$route.query.start" />
</template>
