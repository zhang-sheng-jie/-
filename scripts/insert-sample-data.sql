-- 插入示例诗歌数据（如果不存在则插入）
INSERT INTO poems (title, author, dynasty, content)
SELECT * FROM (VALUES
  ('静夜思', '李白', '唐', '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。'),
  ('春晓', '孟浩然', '唐', '春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。'),
  ('登鹳雀楼', '王之涣', '唐', '白日依山尽，黄河入海流。\n欲穷千里目，更上一层楼。'),
  ('相思', '王维', '唐', '红豆生南国，春来发几枝。\n愿君多采撷，此物最相思。'),
  ('江雪', '柳宗元', '唐', '千山鸟飞绝，万径人踪灭。\n孤舟蓑笠翁，独钓寒江雪。'),
  ('望庐山瀑布', '李白', '唐', '日照香炉生紫烟，遥看瀑布挂前川。\n飞流直下三千尺，疑是银河落九天。'),
  ('黄鹤楼送孟浩然之广陵', '李白', '唐', '故人西辞黄鹤楼，烟花三月下扬州。\n孤帆远影碧空尽，唯见长江天际流。'),
  ('枫桥夜泊', '张继', '唐', '月落乌啼霜满天，江枫渔火对愁眠。\n姑苏城外寒山寺，夜半钟声到客船。'),
  ('悯农', '李绅', '唐', '锄禾日当午，汗滴禾下土。\n谁知盘中餐，粒粒皆辛苦。'),
  ('清明', '杜牧', '唐', '清明时节雨纷纷，路上行人欲断魂。\n借问酒家何处有，牧童遥指杏花村。')
) AS new_poems(title, author, dynasty, content)
WHERE NOT EXISTS (SELECT 1 FROM poems WHERE poems.title = new_poems.title AND poems.author = new_poems.author);

-- 插入示例诗人数据（如果不存在则插入）
INSERT INTO poets (name, biography, era, representative_works)
SELECT * FROM (VALUES
  ('李白', '唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。', '唐代', ARRAY['静夜思', '望庐山瀑布', '黄鹤楼送孟浩然之广陵']),
  ('杜甫', '唐代伟大的现实主义诗人，被后人誉为"诗圣"。', '唐代', ARRAY['春望', '登高', '茅屋为秋风所破歌']),
  ('王维', '唐代著名诗人、画家，被誉为"诗佛"。', '唐代', ARRAY['相思', '山居秋暝', '使至塞上']),
  ('孟浩然', '唐代山水田园诗派代表诗人。', '唐代', ARRAY['春晓', '过故人庄', '宿建德江']),
  ('苏轼', '宋代文学家、书画家，唐宋八大家之一。', '宋代', ARRAY['水调歌头', '念奴娇·赤壁怀古', '江城子·密州出猎'])
) AS new_poets(name, biography, era, representative_works)
WHERE NOT EXISTS (SELECT 1 FROM poets WHERE poets.name = new_poets.name);

-- 插入示例标签（如果不存在则插入）
INSERT INTO tags (name, description)
SELECT * FROM (VALUES
  ('唐诗', '唐代诗歌作品'),
  ('宋词', '宋代词作品'),
  ('山水田园', '描写自然风光和田园生活的诗歌'),
  ('边塞诗', '描写边塞风光和军旅生活的诗歌'),
  ('爱情诗', '表达爱情情感的诗歌'),
  ('思乡诗', '表达思乡之情的诗歌'),
  ('咏物诗', '以物为题材的诗歌'),
  ('送别诗', '表达离别之情的诗歌')
) AS new_tags(name, description)
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE tags.name = new_tags.name);

-- 为诗歌添加标签（如果不存在则插入）
INSERT INTO poem_tags (poem_id, tag_id)
SELECT p.id, t.id 
FROM poems p, tags t 
WHERE p.title = '静夜思' AND t.name = '思乡诗'
AND NOT EXISTS (SELECT 1 FROM poem_tags pt WHERE pt.poem_id = p.id AND pt.tag_id = t.id);

INSERT INTO poem_tags (poem_id, tag_id)
SELECT p.id, t.id 
FROM poems p, tags t 
WHERE p.title = '春晓' AND t.name = '山水田园'
AND NOT EXISTS (SELECT 1 FROM poem_tags pt WHERE pt.poem_id = p.id AND pt.tag_id = t.id);

INSERT INTO poem_tags (poem_id, tag_id)
SELECT p.id, t.id 
FROM poems p, tags t 
WHERE p.title = '登鹳雀楼' AND t.name = '唐诗'
AND NOT EXISTS (SELECT 1 FROM poem_tags pt WHERE pt.poem_id = p.id AND pt.tag_id = t.id);

INSERT INTO poem_tags (poem_id, tag_id)
SELECT p.id, t.id 
FROM poems p, tags t 
WHERE p.title = '相思' AND t.name = '爱情诗'
AND NOT EXISTS (SELECT 1 FROM poem_tags pt WHERE pt.poem_id = p.id AND pt.tag_id = t.id);

INSERT INTO poem_tags (poem_id, tag_id)
SELECT p.id, t.id 
FROM poems p, tags t 
WHERE p.title = '江雪' AND t.name = '山水田园'
AND NOT EXISTS (SELECT 1 FROM poem_tags pt WHERE pt.poem_id = p.id AND pt.tag_id = t.id);

-- 检查数据插入结果
SELECT '诗歌数量:' as info, COUNT(*) as count FROM poems
UNION ALL
SELECT '诗人数量:', COUNT(*) FROM poets
UNION ALL
SELECT '标签数量:', COUNT(*) FROM tags
UNION ALL
SELECT '诗歌标签关联数量:', COUNT(*) FROM poem_tags;