<template>
<div class="flex flex-col min-h-screen">
    <div class="navbar bg-base-300 border border-base-200 m-2 rounded-box w-auto">
        <button class="btn btn-ghost normal-case text-xl">
            <NuxtLink to="/">Home Page</NuxtLink>
        </button>
        <button class="btn btn-ghost normal-case text-xl">
            <NuxtLink to="/inwentury">Inwentura</NuxtLink>
        </button>
    </div>
    <div class="card bg-base-200 m-2">
        <div class="card-body">
            <slot />
        </div>
    </div>
  </div>
</template>