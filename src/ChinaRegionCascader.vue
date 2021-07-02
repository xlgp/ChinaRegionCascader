<template>
  <a-cascader
    v-model:value="value"
    :options="options"
    change-on-select
    :load-data="loadData"
    @change="handleChange"
  ></a-cascader>
</template>

<script>
/**
 * 本组件
 */
import { defineComponent, toRefs, computed, ref } from 'vue';
import useChinaRegion from './composable/useChinaRegion';
import { getCodeList } from './region-util';
import { Cascader } from 'ant-design-vue';
import { props } from './props';
/**
 * 绑定两个值:code, label,但是与cascader绑定的是code
 */
export default defineComponent({
  name: 'ChinaRegionCascader',
  emits: ['update:code', 'update:label'],
  components: { [Cascader.name]: Cascader },
  props: props,
  setup(props, { emit }) {
    const { level, code } = toRefs(props);
    const { loadData, initData, getLabel } = useChinaRegion(level.value);
    const options = ref(initData(code.value));

    const value = computed({
      get: () => getCodeList(props.code, level.value),
      set: (val) => {
        emit('update:code', (val && val[val.length - 1]) || '');
        emit('update:label', getLabel(val));
      },
    });

    const handleChange = (codeList) => {
      // change事件处理
    };

    return {
      value,
      options,
      loadData,
      handleChange,
    };
  },
});
</script>