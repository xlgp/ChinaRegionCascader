import { RegionType } from './typing';
import region from './region.2011'

function isProvinceCode(code: string) {
    return code.endsWith("0000");
}

function isCityCode(code: string) {
    return code.endsWith("00") && code.slice(2, 4) != "00";
}

export const getAllProvince = ():RegionType[] => {
    return region.filter(([code]) => isProvinceCode(code)).map(([code, name]) => ({ code, name }));
}

//直辖市
function isZhiXiaShi(regionCode: string) {
    return ['11', '12', '31', '50'].includes(regionCode.slice(0, 2));
}

//省直辖县级行政单位
function isShengXiaXian(regionCode: string) {
    return regionCode.slice(2, 4) == "90";
}

function isOrZhiXia(regionCode: string) {
    return isZhiXiaShi(regionCode) || isShengXiaXian(regionCode);
}

/**
 * 直辖
 * @param regionCode 
 */
function getMunicipality(provinceCode: string) {
    return region.filter(([code]) => provinceCode.slice(0, 2) == code.slice(0, 2) && code.slice(2, 4) != "00").map(([code, name]) => ({ code, name }));
}

export const getCities = (provinceCode: string):RegionType[] => {
    if (isZhiXiaShi(provinceCode)) { //直辖市
        return getMunicipality(provinceCode);
    }

    //isCityCode(code) :一般市级行政单位
    //isShengXiaXian(code) 省辖县级行政单位
    return region
        .filter(([code]) => provinceCode.slice(0, 2) == code.slice(0, 2))
        .filter(([code]) => isCityCode(code) || isShengXiaXian(code))
        .map(([code, name]) => ({ code, name }));
}

/**
 * 县级行政单位
 * @param regionCode 
 * @returns 
 */
export const getCounties = (regionCode: string):RegionType[] => {
    return region.filter(([code]) => code.slice(0, 4) == regionCode.slice(0, 4)).filter(([code]) => code.slice(4, 6) != "00").map(([code, name]) => ({ code, name }));
}

export const getCodeList = (code: string, level: number = 3): string[] => {
    if (!code) return[];
    const list = [code.slice(0, 2) + "0000"];
    if (level > 1) list.push(isOrZhiXia(code) && code || code.slice(0, 4) + "00");
    if (level > 2) list.push(code);
    return list;
}

/**
 * 获取行政单位名
 * @param regionCode 
 * @param level 
 * @returns 
 */
export const regionText = (regionCode: string) => {
    const regionResult = Object.values(info(regionCode));
    if (regionResult.length == 0) {
        return '';
    } else if (regionResult.length == 1) {
        return regionResult[0];
    }
    return regionResult[0] + '-' + regionResult[1];
}

/**
 * 获取regionCode 省市县的信息
 * @param regionCode 行政区划代码
 * @returns 
 */
export const info = (regionCode: string) => {
    const list = getCodeList(regionCode);

    let province = region.find(([code]) => list[0] == code); //省
    if (!province) return {};

    const city = province && region.find(([code]) => list[1] == code);
    if (!city) return {
        [province[0]]: province[1],
    }

    const county = city && region.find(([code]) => list[2] == code);
    if (!county) return {
        [province[0]]: province[1],
        [city[0]]: city[1],
    }
    return {
        [province[0]]: province[1],
        [city[0]]: city[1],
        [county[0]]: county[1],
    };
}

export default getAllProvince;