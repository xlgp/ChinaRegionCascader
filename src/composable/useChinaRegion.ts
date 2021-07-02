import { RegionType, Option } from "../typing";
import { getAllProvince, getCities, getCodeList, getCounties, info } from "../region-util";
import { Ref } from "vue";

function transformOption(list: RegionType[], isLeaf: boolean = false) {
  return list.map(({ code, name }) => ({ value: code, label: name, isLeaf: isLeaf}));
}

export default (level: number) => {
  const loadData = (selectedOptions: Option[]) => {
    const nodeLevel = selectedOptions.length;
    const targetOption = selectedOptions[nodeLevel - 1];
    targetOption.loading = true;

    setTimeout(() => {

      let nodes: RegionType[] = [];
      //当前需要获取市级数据
      if (nodeLevel == 1) nodes = getCities(targetOption.value);
      //当前需要获取区县级数据
      if (nodeLevel == 2) nodes = getCounties(targetOption.value);

      targetOption.children = transformOption(nodes, nodeLevel == level - 1);
      targetOption.loading = false;

    }, 100);
  };
  const initData = (value: string) => {
    if (!value) {
      return transformOption(getAllProvince(), 1 == level);
    }
    const regionInfo = info(value);
    const len = Object.keys(regionInfo).length;
    if (len == 1) {
      return transformOption(getAllProvince(), len == level);
    } else if (len == 2) {
      const p = transformOption(getAllProvince()) as Option[];
      const index = p.findIndex(({ value }) => {
        return !!regionInfo[value] == true;
      });
      p[index].children = transformOption(getCities(p[index].value), len == level);
      return p;
    }
    //县区级暂未实现
    return [];
  };

  const getLabel = (codeList:string[]) => {
      const regionInfo = info(codeList[codeList.length-1]);
      return Object.values(regionInfo);
  };
  
  return {
    loadData,
    initData,
    getLabel,
  }
}