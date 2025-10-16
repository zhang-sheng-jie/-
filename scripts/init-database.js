const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://oqaekwgnvenqetgtbeio.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xYWVrd2dudmVucWV0Z3RiZWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0Njg1MTMsImV4cCI6MjA3NjA0NDUxM30.ZsuCQSJzlgbbFKMBOASUpSNBNYQPHe6HMbqMyj5cUAY'

const supabase = createClient(supabaseUrl, supabaseKey)

// 初始化数据
const poemsData = [
  {
    title: '静夜思',
    author: '李白',
    dynasty: '唐代',
    content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。'
  },
  {
    title: '春晓',
    author: '孟浩然',
    dynasty: '唐代',
    content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。'
  },
  {
    title: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐代',
    content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。'
  },
  {
    title: '望庐山瀑布',
    author: '李白',
    dynasty: '唐代',
    content: '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。'
  },
  {
    title: '相思',
    author: '王维',
    dynasty: '唐代',
    content: '红豆生南国，春来发几枝。愿君多采撷，此物最相思。'
  },
  {
    title: '江雪',
    author: '柳宗元',
    dynasty: '唐代',
    content: '千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。'
  },
  {
    title: '悯农',
    author: '李绅',
    dynasty: '唐代',
    content: '锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。'
  },
  {
    title: '游子吟',
    author: '孟郊',
    dynasty: '唐代',
    content: '慈母手中线，游子身上衣。临行密密缝，意恐迟迟归。谁言寸草心，报得三春晖。'
  },
  {
    title: '水调歌头',
    author: '苏轼',
    dynasty: '宋代',
    content: '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。'
  },
  {
    title: '声声慢',
    author: '李清照',
    dynasty: '宋代',
    content: '寻寻觅觅，冷冷清清，凄凄惨惨戚戚。乍暖还寒时候，最难将息。三杯两盏淡酒，怎敌他、晚来风急？雁过也，正伤心，却是旧时相识。'
  },
  {
    title: '青玉案·元夕',
    author: '辛弃疾',
    dynasty: '宋代',
    content: '东风夜放花千树，更吹落、星如雨。宝马雕车香满路。凤箫声动，玉壶光转，一夜鱼龙舞。'
  },
  {
    title: '天净沙·秋思',
    author: '马致远',
    dynasty: '元代',
    content: '枯藤老树昏鸦，小桥流水人家，古道西风瘦马。夕阳西下，断肠人在天涯。'
  }
]

async function initDatabase() {
  console.log('开始初始化数据库...')
  
  try {
    // 检查是否已存在数据
    const { data: existingPoems, error: checkError } = await supabase
      .from('poems')
      .select('*')
      .limit(1)
    
    if (checkError) {
      console.error('检查数据失败:', checkError)
      return
    }
    
    if (existingPoems && existingPoems.length > 0) {
      console.log('数据库已有数据，跳过初始化')
      return
    }
    
    // 插入诗歌数据
    const { data: insertedPoems, error: insertError } = await supabase
      .from('poems')
      .insert(poemsData)
      .select()
    
    if (insertError) {
      console.error('插入数据失败:', insertError)
      return
    }
    
    console.log(`成功插入 ${insertedPoems.length} 首诗歌`)
    console.log('数据库初始化完成！')
    
  } catch (error) {
    console.error('初始化失败:', error)
  }
}

// 运行初始化
initDatabase()