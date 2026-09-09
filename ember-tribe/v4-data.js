const ERAS=[
{name:'荒野营地',years:'约公元前10000年',goal:{pop:5,knowledge:8,territory:1}},
{name:'定居部落',years:'新石器时代',goal:{pop:10,knowledge:35,territory:2}},
{name:'农耕村落',years:'早期农业社会',goal:{pop:22,knowledge:100,territory:3}},
{name:'青铜城邦',years:'青铜时代',goal:{pop:45,knowledge:260,territory:5}},
{name:'古典王国',years:'古典时代',goal:{pop:90,knowledge:650,territory:8}},
{name:'封建社会',years:'中世纪',goal:{pop:180,knowledge:1500,territory:12}},
{name:'工业时代',years:'18—19世纪',goal:{pop:400,knowledge:3800,territory:18}},
{name:'电气时代',years:'20世纪前期',goal:{pop:900,knowledge:9000,territory:26}},
{name:'信息时代',years:'20—21世纪',goal:{pop:2200,knowledge:22000,territory:38}},
{name:'自动化文明',years:'近未来',goal:{pop:5000,knowledge:60000,territory:55}},
{name:'星际文明',years:'深空时代',goal:{pop:12000,knowledge:180000,territory:80}}
];
const RESOURCE_UNLOCK={food:0,wood:0,stone:0,knowledge:0,tools:1,metal:3,coin:3,coal:6,steel:6,electricity:7,oil:7,data:8,automation:9,energy:9,alloy:10,antimatter:10};
const RES_NAMES={food:'食物',wood:'木材',stone:'石料',knowledge:'知识',tools:'工具',metal:'金属',coin:'货币',coal:'煤炭',steel:'钢材',electricity:'电力',oil:'石油',data:'数据',automation:'自动化单元',energy:'高密度能源',alloy:'星际合金',antimatter:'反物质'};
const JOBS={
food:{names:['采集者','定居农夫','牛耕农夫','轮耕农户','庄园农民','重犁农夫','机械农场主','电气化农场主','精准农业师','自动化农业工程师','生态合成师'],base:1.25,res:'food',unlock:0},
wood:{names:['拾柴者','伐木者','林地工','青铜伐木工','王室林工','行会木匠','蒸汽林业工','电锯林业工','生态林业员','无人林业调度员','生物质工程师'],base:.72,res:'wood',unlock:0},
miner:{names:['寻石者','采石者','矿坑工','铜矿工','铁矿工','深井矿工','煤矿工','工业矿工','资源勘探师','自动采矿工程师','小行星采矿师'],base:.54,res:'stone',unlock:1},
artisan:{names:['手作者','石器匠','陶器匠','青铜匠','铁匠','行会工匠','工厂技工','机电技师','制造工程师','柔性制造工程师','物质编译师'],base:.21,res:'tools',unlock:1},
scholar:{names:['讲述者','祭司记录者','书记员','城邦学者','哲人','修道学者','自然研究员','大学研究员','数据科学家','人工智能研究员','星际理论家'],base:.34,res:'knowledge',unlock:0},
merchant:{names:['交换者','集市商贩','驮队商人','城邦商旅','远洋商人','行会商人','铁路资本家','跨国商社','平台运营者','自治市场设计师','星际贸易协调员'],base:.18,res:'coin',unlock:3},
soldier:{names:['守夜者','氏族战士','村落卫兵','青铜长矛兵','常备军士','封建骑士','线列步兵','机械化军人','网络防务员','无人系统指挥员','轨道防御官'],base:.15,res:'prestige',unlock:2},
builder:{names:['搭棚者','泥砖工','筑墙工','石匠','道路营造师','城堡营造师','土木技师','现代工程师','城市规划师','自动建造师','轨道建筑师'],base:.14,res:'build',unlock:1},
engineer:{names:['工具改良者','水利匠','机械师','攻城器械师','钟表匠','水轮技师','蒸汽工程师','电气工程师','软件工程师','机器人工程师','曲率工程师'],base:.12,res:'industry',unlock:4},
administrator:{names:['长者助手','氏族协调员','粮仓管事','城邦书记官','税务官','封建管家','工厂经理','公共行政官','数字治理员','算法治理师','星际总督'],base:.1,res:'govern',unlock:2}
};
const BRANCHES={
agriculture:{title:'农业路线',choices:[
{id:'pastoral',era:1,name:'畜牧传统',desc:'人口增长 +15%，食物产量 +10%。',effect:{food:1.1,pop:1.15}},
{id:'irrigation',era:2,name:'灌溉农业',desc:'食物产量 +28%，但木材产量 -5%。',effect:{food:1.28,wood:.95}},
{id:'mechanizedFarm',era:6,name:'机械化农业',desc:'农业职业效率 +55%。',effect:{food:1.55}},
{id:'syntheticFood',era:9,name:'合成农业',desc:'食物生产翻倍，人口增长 +30%。',effect:{food:2,pop:1.3}}
]},
governance:{title:'治理路线',choices:[
{id:'council',era:1,name:'长老议事',desc:'幸福度上限提高，知识 +8%。',effect:{happy:8,knowledge:1.08}},
{id:'bureaucracy',era:4,name:'官僚体系',desc:'所有生产 +12%，人口消耗 +5%。',effect:{global:1.12,consume:1.05}},
{id:'constitutional',era:7,name:'代议制度',desc:'幸福度 +12，威望增长 +25%。',effect:{happy:12,prestige:1.25}},
{id:'algoGov',era:9,name:'算法治理',desc:'自动化产量 +60%，所有生产 +20%。',effect:{automation:1.6,global:1.2}}
]},
knowledge:{title:'知识路线',choices:[
{id:'oral',era:0,name:'口述传统',desc:'人口增长 +8%，知识 +5%。',effect:{pop:1.08,knowledge:1.05}},
{id:'academy',era:4,name:'学院传统',desc:'知识产量 +45%。',effect:{knowledge:1.45}},
{id:'openScience',era:8,name:'开放科研网络',desc:'知识 +65%，数据 +20%。',effect:{knowledge:1.65,data:1.2}},
{id:'aiScience',era:9,name:'AI 科研',desc:'知识翻倍，自动化 +30%。',effect:{knowledge:2,automation:1.3}}
]},
industry:{title:'工业路线',choices:[
{id:'craftGuild',era:4,name:'行会制造',desc:'工具 +30%，幸福度 +5。',effect:{tools:1.3,happy:5}},
{id:'massProd',era:6,name:'大规模生产',desc:'工具与钢材 +70%，幸福度 -5。',effect:{tools:1.7,steel:1.7,happy:-5}},
{id:'lean',era:8,name:'精益制造',desc:'工业资源 +35%，资源消耗 -10%。',effect:{industry:1.35,consume:.9}},
{id:'lightsOut',era:9,name:'无人工厂',desc:'工具/钢材/自动化 +100%。',effect:{tools:2,steel:2,automation:2}}
]},
economy:{title:'经济路线',choices:[
{id:'gift',era:0,name:'礼物交换',desc:'幸福度 +5，贸易收益 +5%。',effect:{coin:1.05,happy:5}},
{id:'market',era:3,name:'自由集市',desc:'货币 +45%。',effect:{coin:1.45}},
{id:'banking',era:5,name:'银行信用',desc:'货币 +70%，建设效率 +10%。',effect:{coin:1.7,build:1.1}},
{id:'digitalMarket',era:8,name:'数字市场',desc:'货币 +100%，数据 +25%。',effect:{coin:2,data:1.25}}
]},
expansion:{title:'扩张路线',choices:[
{id:'peaceful',era:2,name:'迁徙拓殖',desc:'探索领土成本 -20%，幸福度 +5。',effect:{explore:.8,happy:5}},
{id:'military',era:3,name:'军事扩张',desc:'探索成本 -35%，威望 +50%，幸福度 -6。',effect:{explore:.65,prestige:1.5,happy:-6}},
{id:'maritime',era:5,name:'海洋扩张',desc:'领土收益 +35%，货币 +20%。',effect:{territory:1.35,coin:1.2}},
{id:'orbital',era:10,name:'轨道殖民',desc:'领土增长翻倍，星际资源 +60%。',effect:{territory:2,alloy:1.6,antimatter:1.6}}
]}
};
const BUILDINGS=[
{id:'campfire',era:0,name:'营火',desc:'人口消耗 -5%。',cost:{wood:12},max:1},
{id:'hut',era:0,name:'草屋',desc:'人口上限 +4。',cost:{wood:18,food:8},max:999},
{id:'granary',era:1,name:'粮仓',desc:'食物生产 +6%，人口上限 +2。',cost:{wood:35,stone:10},max:20},
{id:'quarry',era:1,name:'采石场',desc:'采矿效率 +12%。',cost:{wood:42,stone:20},max:20},
{id:'workshop',era:2,name:'手工作坊',desc:'工具产量 +18%。',cost:{wood:70,stone:35,knowledge:30},max:20},
{id:'market',era:3,name:'集市',desc:'货币产量 +15%。',cost:{wood:100,stone:60,tools:10},max:20},
{id:'library',era:4,name:'图书馆',desc:'知识产量 +16%。',cost:{wood:160,stone:120,coin:50},max:20},
{id:'road',era:4,name:'道路网',desc:'全局生产 +3%。',cost:{stone:180,coin:80,tools:20},max:30},
{id:'mill',era:5,name:'水力磨坊',desc:'食物、工具 +12%。',cost:{wood:240,stone:180,metal:40},max:20},
{id:'factory',era:6,name:'蒸汽工厂',desc:'工具/钢材 +22%。',cost:{stone:350,metal:120,coal:80,coin:200},max:30},
{id:'power',era:7,name:'发电站',desc:'产生电力基础产能。',cost:{steel:160,coal:220,coin:500},max:20},
{id:'lab',era:7,name:'现代实验室',desc:'知识 +22%。',cost:{steel:120,electricity:80,coin:420},max:20},
{id:'datacenter',era:8,name:'数据中心',desc:'数据 +25%，知识 +10%。',cost:{steel:300,electricity:220,coin:900},max:30},
{id:'robotics',era:9,name:'机器人园区',desc:'自动化 +30%，全局生产 +5%。',cost:{steel:500,electricity:500,data:250},max:30},
{id:'fusion',era:9,name:'聚变设施',desc:'高密度能源 +30%。',cost:{steel:800,electricity:900,data:400},max:20},
{id:'orbitalYard',era:10,name:'轨道船坞',desc:'星际合金与反物质 +35%。',cost:{alloy:400,energy:1000,data:1200},max:30}
];
const TECHS=[
{id:'fire',era:0,name:'保存火种',desc:'减少人口食物消耗。',cost:{knowledge:6}},
{id:'language',era:0,name:'复杂语言',desc:'知识职业 +15%。',cost:{knowledge:14}},
{id:'domestication',era:1,name:'驯化动物',desc:'食物 +15%，人口增长 +10%。',cost:{knowledge:40,food:60}},
{id:'irrigationTech',era:2,name:'灌溉技术',desc:'食物 +20%。',cost:{knowledge:100,stone:50}},
{id:'writing',era:3,name:'文字',desc:'知识 +30%。',cost:{knowledge:260,tools:15}},
{id:'currency',era:3,name:'铸币',desc:'解锁稳定货币经济。',cost:{knowledge:220,metal:30}},
{id:'iron',era:4,name:'铁器',desc:'工具与采矿 +25%。',cost:{knowledge:650,metal:120}},
{id:'roads',era:4,name:'道路工程',desc:'全局生产 +8%。',cost:{knowledge:700,stone:280,coin:150}},
{id:'printing',era:5,name:'印刷术',desc:'知识 +40%。',cost:{knowledge:1500,coin:500}},
{id:'steam',era:6,name:'蒸汽机',desc:'工业资源 +45%。',cost:{knowledge:3800,coal:500,steel:200}},
{id:'electricityTech',era:7,name:'电气化',desc:'解锁电力体系，全球生产 +15%。',cost:{knowledge:9000,steel:500}},
{id:'combustion',era:7,name:'内燃机',desc:'探索成本 -15%，工业 +20%。',cost:{knowledge:8500,oil:300}},
{id:'computing',era:8,name:'计算机',desc:'知识 +60%，数据 +40%。',cost:{knowledge:22000,electricity:1800}},
{id:'internet',era:8,name:'全球网络',desc:'货币、知识、数据 +25%。',cost:{knowledge:26000,data:500}},
{id:'roboticsTech',era:9,name:'通用机器人',desc:'自动化 +70%，工业 +35%。',cost:{knowledge:60000,data:3000,electricity:3500}},
{id:'fusionTech',era:9,name:'可控核聚变',desc:'能源 +80%。',cost:{knowledge:70000,automation:1800}},
{id:'spaceflight',era:10,name:'深空航行',desc:'星际资源 +70%，领土增长 +50%。',cost:{knowledge:180000,energy:8000,alloy:1200}},
{id:'antimatterTech',era:10,name:'反物质约束',desc:'反物质 +120%。',cost:{knowledge:260000,energy:12000,alloy:3000}}
];
const TIMELINE=[
{id:'p5',text:'五人同火：人口达到 5',test:s=>s.population>=5},{id:'settled',text:'第一次定居：进入定居部落',test:s=>s.era>=1},{id:'p20',text:'二十人的名字：人口达到 20',test:s=>s.population>=20},{id:'city',text:'城邦诞生：进入青铜城邦',test:s=>s.era>=3},{id:'kingdom',text:'王国建立：进入古典王国',test:s=>s.era>=4},{id:'industry',text:'蒸汽轰鸣：进入工业时代',test:s=>s.era>=6},{id:'electric',text:'夜晚第一次被电照亮',test:s=>s.era>=7},{id:'digital',text:'文明进入信息时代',test:s=>s.era>=8},{id:'auto',text:'机器开始自行生产机器',test:s=>s.era>=9},{id:'stars',text:'文明跨出母星',test:s=>s.era>=10}
];