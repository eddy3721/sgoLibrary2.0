export const zones = [
    '初始城鎮',
    '大草原',
    '草原秘境',
    '猛牛原',
    '被詛咒的寺院',
    '兒童樂園',
    '蘑菇園',
    '菇菇仙境',
    '圓明園',
    '非洲大草原',
    '神秘部落',
    '空中花園',
    '神廟',
    '青藏高原',
    '火鳳燎原',
    '魏營',
    '蜀營',
    '吳營',
    '骷髏墓園',
    '破舊佛寺',
    '鷹洞',
    '蝙蝠洞',
    '黑暗密道',
    '老鼠洞',
    '岩洞',
    '盤絲洞',
    '水簾洞',
    '龍洞',
    '藍洞',
    '深海通路',
    '黑洞',
    '無底洞',
    '地下迷宮',
    '岔路',
    '鹿港天后宮',
    '凌霄寶殿',
    '克里姆林宮',
    '大樹',
    '靈王宮'
];
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