<template>
    <div class="full-class">
        <img class="top-img-class" src="./image/businessCooperation.png" alt="">

    </div>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        methods: {

        },
        created() {

        }
    }
</script>

<style scoped lang="stylus" type="text/stylus">
    $item-height = 35px
    $item-interval = 10px
    $base-color = #ff3d34
    $border-radius = 8px
    .full-class {
        width 100%
        height 100%
        overflow hidden
        overflow-y scroll
        position relative
        top 0
        left 0
        -webkit-overflow-scrolling touch
        .top-img-class {
            width 100%
            height 100%
        }
    }
</style>
