export const qqfaceArr = {
   '[微笑]': '0',
   '[撇嘴]': '1',
   '[色]': '2',
   '[发呆]': '3',
   '[得意]': '4',
   '[流泪]': '5',
   '[害羞]': '6',
   '[闭嘴]': '7',
   '[睡]': '8',
   '[大哭]': '9',
   '[尴尬]': '10',
   '[发怒]': '11',
   '[调皮]': '12',
   '[呲牙]': '13',
   '[惊讶]': '14',
   '[难过]': '15',
   '[破涕为笑]': '16',
   '[囧]': '17',
   '[抓狂]': '18',
   '[吐]': '19',
   '[偷笑]': '20',
   '[愉快]': '21',
   '[白眼]': '22',
   '[傲慢]': '23',
   '[失望]': '24',
   '[困]': '25',
   '[惊恐]': '26',
   '[无语]': '27',
   '[憨笑]': '28',
   '[悠闲]': '29',
   '[嘿哈]': '30',
   '[咒骂]': '31',
   '[疑问]': '32',
   '[嘘]': '33',
   '[晕]': '34',
   '[脸红]': '35',
   '[衰]': '36',
   '[骷髅]': '37',
   '[敲打]': '38',
   '[再见]': '39',
   '[擦汗]': '40',
   '[抠鼻]': '41',
   '[鼓掌]': '42',
   '[捂脸]': '43',
   '[坏笑]': '44',
   '[恐惧]': '45',
   '[右哼哼]': '46',
   '[口罩]': '47',
   '[鄙视]': '48',
   '[委屈]': '49',
   '[快哭了]': '50',
   '[阴险]': '51',
   '[亲亲]': '52',
   '[笑脸]': '53',
   '[可怜]': '54',
   '[奸笑]': '55',
   '[机智]': '56',
   '[皱眉]': '57',
   '[耶]': '58',
   '[吃瓜]': '59',
   '[加油]': '60',
   '[汗]': '61',
   '[天啦]': '62',
   '[社会]': '63',
   '[旺柴]': '64',
   '[好的]': '65',
   '[打脸]': '66',
   '[哇]': '67',
   '[翻白眼]': '68',
   '[666]': '69',
   '[让我看看]': '70',
   '[叹气]': '71',
   '[苦涩]': '72',
   '[裂开]': '73',
   '[Emm]': '74',
   '[嘴唇]': '75',
   '[爱心]': '76',
   '[心碎]': '77',
   '[拥抱]': '78',
   '[强]': '79',
   '[弱]': '80',
   '[握手]': '81',
   '[胜利]': '82',
   '[抱拳]': '83',
   '[勾引]': '84',
   '[拳头]': '85',
   '[OK]': '86',
   '[合十]': '87',
   '[啤酒]': '88',
   '[咖啡]': '89',
   '[蛋糕]': '90',
   '[玫瑰]': '91',
   '[凋谢]': '92',
   '[菜刀]': '93',
   '[炸弹]': '94',
   '[便便]': '95',
   '[月亮]': '96',
   '[太阳]': '97',
   '[庆祝]': '98',
   '[礼物]': '99',
   '[红包]': '100',
   '[發]': '101',
   '[福]': '102',
   '[烟花]': '103',
   '[爆竹]': '104',
   '[猪头]': '105',
   '[跳跳]': '106',
   '[发抖]': '107',
   '[转圈]': '108'
 }
export const reverseEmoijMap = {}
const keys = Object.keys(qqfaceArr)
	for (const key of keys) {
	reverseEmoijMap[qqfaceArr[key]] = key
}
 
export function genString2emoji (url) {
   return words => {
      const keys = words.match(/\[(.+?)\]/g) || []
      let result = words
      for (const key of keys) {
         if (qqfaceArr[key]) {
         	result = result.replace(new RegExp(`\\[${key.slice(1, -1)}\\]`, 'g'), `<span style="display: inline-block;" class="qqface-wrapper"><img src="${url}" class="qqface qqface${qqfaceArr[key]}"></span>`)
         }
      }
      console.log(result, keys)
      return result
   }
 }
 
export function emoji2string (words) {
	let result = words.replace(new RegExp(`<span[^>]+><img [^>]*? class="qqface qqface(\\d+?)"[^>]*></span>`, 'g'), (match, offset) => {
		return reverseEmoijMap[offset]
	})
	return result
}

export function deleteEmoji(text) {
	const reg = /\[[^\]]+?\]$/
	if(reg.test(text)){
		return text.replace(reg, '')
	}else if(text){
		return text.slice(0, -1)
	}
}