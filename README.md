# 超级玛丽游戏

一个使用HTML5, CSS和JavaScript创建的简单超级玛丽游戏。

## 游戏介绍

这是一个基于浏览器的超级玛丽风格游戏，玩家可以控制马里奥角色跳跃、移动、收集金币并与敌人战斗。

## 游戏特点

- 基于HTML5 Canvas的游戏引擎
- 响应式设计，支持桌面和移动设备
- 物理引擎系统，包括重力、跳跃和碰撞检测
- 收集金币增加分数
- 敌人AI系统
- 生命值系统
- 视口滚动系统，支持大型游戏世界探索
- 精确碰撞检测系统
- 问号砖块和道具系统
- 蘑菇变身机制
- 管道和食人花系统
- 广阔的游戏世界（5000像素宽）

## 游戏控制

### 桌面控制
- **左右移动**: 箭头键 或 A/D 键
- **跳跃**: 上箭头键、W键 或 空格键

### 移动设备控制
- 屏幕上的虚拟按钮

## 游戏目标

- 收集尽可能多的金币增加得分
- 撞击问号砖块获取蘑菇或金币
- 通过跳到敌人头上消灭它们
- 避免与敌人正面碰撞或掉落平台
- 躲避从管道中冒出的食人花
- 探索整个游戏世界

## 如何开始

1. 克隆或下载此仓库
2. 在浏览器中打开 `index.html` 文件
3. 点击"开始游戏"按钮

## 技术栈

- HTML5
- CSS3
- JavaScript (ES6+)

## 游戏功能

- **视口滚动**: 游戏支持向右滚动视图，让玩家探索更大的游戏世界
- **物理系统**: 精确的重力和跳跃物理效果
- **碰撞检测**: 多方向碰撞系统，准确检测碰撞方向并作出相应反应
- **敌人AI**: 敌人自动移动并在碰到障碍时改变方向
- **分数系统**: 击败敌人和收集金币可以获得不同的分数
- **生命系统**: 玩家有多条生命，碰到敌人或掉落会减少生命值
- **问号砖块**: 撞击问号砖块可以获得金币或蘑菇道具
- **蘑菇道具**: 收集蘑菇后马里奥会变大，获得额外防御能力
- **管道系统**: 游戏中分布着多个绿色管道
- **食人花**: 从管道中周期性冒出的敌人，会根据玩家位置智能移动
- **开阔视野**: 优化的摄像机系统，让玩家能够提前看到前方障碍物

## 游戏特色

### 问号砖块系统
- 游戏世界中分布着多个带有"?"标记的黄色砖块
- 从下方撞击砖块可以获得奖励
- 撞击后砖块会变灰，表示已被使用
- 根据砖块类型，可能获得金币或蘑菇

### 蘑菇道具系统
- 从问号砖块中可以获得蘑菇道具
- 蘑菇会自动沿平台移动，遇到障碍物会改变方向
- 收集蘑菇后马里奥会变大，身高增加50%
- 变大后的马里奥在受到伤害时会变回小马里奥而不是直接失去生命
- 收集蘑菇可获得1000分

### 管道和食人花系统
- 游戏世界中分布着多个绿色管道
- 食人花会从管道中周期性地出现和隐藏
- 食人花具有智能行为：当玩家站在管道上或接近时会躲回管道
- 碰触食人花会失去一条生命或变回小马里奥

## 未来计划

- 添加多个关卡
- 实现更多类型的敌人
- 添加火花道具，让马里奥能够发射火球
- 添加背景音乐和音效
- 存储最高分数
- 添加更多游戏机制（如隐藏区域和秘密通道）

## 更新日志

- **2025年3月20日**: 初始版本发布
- **2025年3月20日更新一**: 
  - 添加视口滚动系统，允许玩家探索更大游戏世界
  - 修复砖块碰撞问题，改进碰撞检测系统
  - 扩展游戏世界，添加更多平台、砖块、金币和敌人
  - 优化游戏性能，只渲染视口内的游戏元素
- **2025年3月20日更新二**:
  - 添加问号砖块系统，可以撞击获得金币或蘑菇
  - 实现蘑菇道具和马里奥变大功能
  - 添加管道和食人花系统
  - 实现食人花的智能行为模式
  - 优化角色碰撞逻辑，提升游戏体验
- **2025年3月20日更新三**:
  - 将游戏世界扩展至5000像素宽，提供更开阔的探索空间
  - 改进视口跟随系统，马里奥位于屏幕1/4处，提供更好的前方视野
  - 修复食人花行为，使其只在玩家直接站在管道上方时才不出现
  - 增强敌人与环境的交互，解决敌人穿墙问题
  - 优化游戏整体流畅度和可玩性

## 游戏优化

### 广阔游戏世界
- 游戏世界扩展到5000像素宽，为玩家提供更大的探索空间
- 经过优化的视口系统，让玩家能提前看到更远处的障碍物和奖励
- 马里奥位于屏幕的1/4位置，为玩家提供更好的前方视野

### 改进的AI行为
- 食人花拥有更智能的行为，只在玩家直接站在管道上方时才躲避
- 敌人不再穿墙，会正确检测并响应与环境的碰撞
- 更自然的游戏体验，减少"卡住"或"穿模"的情况

## 已知问题

如果您发现任何问题，请在GitHub Issues中报告。

## 贡献

欢迎提交问题和拉取请求，帮助改进这个游戏！

## 许可

本项目采用MIT许可证。