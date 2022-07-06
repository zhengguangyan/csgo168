<template>
    <div id="Test">
        <li
            class="test-li"
            :class="[quicknextIconClass, { disabled }, { show }]"
            @mouseenter="quicknextIconClass = 'el-icon-less'"
            @mouseleave="quicknextIconClass = 'el-icon-more'"
        ></li>
    </div>
</template>

<script>
export default {
    name: "Test",
    data() {
        return {
			quicknextIconClass: '',
			disabled: true,
			show: false
		};
    },
};
</script>

<style lang="scss">
.test-li {
	width: rem(50);
	height: rem(50);
}
.el-icon-less{
	background-color: blueviolet;
}
.el-icon-more{
	background-color: red;
}
</style>
