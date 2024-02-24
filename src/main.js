export const zones = ['初始城鎮', '大草原'];
export const getZone = (n) => {
    const zone = zones[n];
    return zone ? zone : '未知地區';
};

export const weapons = [
    '單手劍',
    '細劍',
    '短刀',
    '單手錘',
    '盾牌',
    '雙手劍',
    '太刀',
    '雙手斧',
    '長槍'
];