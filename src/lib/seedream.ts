import type { PetId } from '@/types'
import { imageGeneration } from '@/lib/openrouter'

const VISUAL_ANCHORS: Record<PetId, string> = {
  ping_an: '橘色虎斑猫，身形圆润饱满，眼睛大而有神，毛发柔软蓬松，琥珀色眼睛，姿态慵懒放松，室内温暖光线，居家温馨环境',
  mo: '边境牧羊犬，黑白相间的毛色，眼神睿智若有所思，体型修长，神情平静沉稳，常常望向远处，自然光线，安静沉思的氛围',
  chi: '体型微小的幼龙，暗红色鳞片，翅膀短小，头部相对身体偏大，眼神明亮好奇，努力装出凶狠模样但显得可爱，戏剧性光线与其娇小体型形成反差',
  hawk: '鹰或隼，金色锐利的眼神，羽毛深色光滑，姿态挺拔自傲，栖于窗台或高处，冷调自然光，背景简洁，神情高贵而疏离',
}

const STYLE_SUFFIX = '柔和插画风格，温暖光线，温馨氛围，淡雅色调，毛发或鳞片质感细腻，眼神富有表情，手绘感，画面中无文字'

// 返回 null 表示生成失败，调用方不应因此中断主流程
export async function generateImage(
  petId: PetId,
  sceneDescription: string
): Promise<string | null> {
  const prompt = `${VISUAL_ANCHORS[petId]}，${sceneDescription}，${STYLE_SUFFIX}`
  return imageGeneration(prompt)
}
