import { Car } from '../types';

/**
 * 圖庫：全部來自 Unsplash，每個 ID 皆已實際載入驗證（HTTP 200 + 瀏覽器 onload）。
 * 命名以「照片內容」為準，方便依車型／品牌挑選對應圖片。
 */
const IMG = {
  camryGrey:      'photo-1621007947382-bb3c3994e3fb', // 灰色 Toyota Camry
  sedanWhiteFront:'photo-1517524008697-84bbe3c3fd98', // 白色房車車頭特寫
  sedanBlack:     'photo-1619767886558-efdc259cde1a', // 黑色 Hyundai 房車
  sedanTeal:      'photo-1541899481282-d53bffe3c35d', // 藍綠色 VW 房車
  interior:       'photo-1449965408869-eaa3f722e40d', // 內裝／方向盤
  suvWhiteHonda:  'photo-1519641471654-76ce0107ad1b', // 白色 Honda CR-V
  suvWhiteLarge:  'photo-1533473359331-0135ef1b58bf', // 白色大型休旅
  suvBlackRange:  'photo-1563720223185-11003d516935', // 黑色 Range Rover
  bmwGrey:        'photo-1580273916550-e323be2ae537', // 灰色 BMW M4
  bmwBlue:        'photo-1541443131876-44b03de101c5', // 藍色 BMW 車頭
  bmwBlueCoupe:   'photo-1502877338535-766e1452684a', // 藍色 BMW M4 雙門
  benzWhiteEv:    'photo-1590362891991-f776e747a588', // 白色賓士於充電站
  benzRedAmg:     'photo-1553440569-bcc63803a83d',   // 紅色 Mercedes AMG GT
  benzYellowAmg:  'photo-1605559424843-9e4c228bf1c2', // 黃色 Mercedes AMG GT
  audiBlackRs:    'photo-1606664515524-ed2f786a0bd6', // 黑色 Audi RS 車頭
  audiRedR8:      'photo-1502161254066-6c74afbf07aa', // 紅色 Audi R8
  porscheSilver:  'photo-1614162692292-7ac56d7f7f1e', // 銀色 Porsche 911（雪地）
  porscheBlack:   'photo-1580274455191-1c62238fa333', // 黑色 Porsche 911 Turbo
  porschePanamera:'photo-1503376780353-7e6692767b70', // 黑色 Porsche Panamera 車尾
  fordMustangBlk: 'photo-1547744152-14d985cb937f',   // 黑色 Ford Mustang
  fordMustangGt:  'photo-1494976388531-d1058494cdd8', // 黑色 Ford Mustang GT350
  fordMustangSun: 'photo-1494905998402-395d579af36f', // 黑色 Ford Mustang（夕陽）
  hyundaiRedHatch:'photo-1550355291-bbee04a92027',   // 紅色 Hyundai i30 N 掀背
  nissanSilver:   'photo-1568605117036-5fe5e7bab0b7', // 銀色 Nissan GT-R 車尾
  nissanDark:     'photo-1609521263047-f8f205293f24', // 深色 Nissan 跑車
  jaguarRed:      'photo-1507136566006-cfc505b114fc', // 紅色 Jaguar F-Type
  coupeBlueBridge:'photo-1552519507-88aa2dfa9fdb',   // 藍色 Camaro（橋上）
  coupeBlueDesert:'photo-1552519507-da3b142c6e3d',   // 藍色 Camaro（荒漠）
  evCharging:     'photo-1593941707882-a5bba14938c7', // 電動車充電線特寫
} as const;

type ImgKey = keyof typeof IMG;

const url = (k: ImgKey) => `https://images.unsplash.com/${IMG[k]}?w=800&q=80`;
const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();

type Seed = Omit<Car, 'id' | 'images' | 'createdAt'> & { pics: ImgKey[]; days: number };

const SEEDS: Seed[] = [
  {
    make: 'Toyota', model: 'Camry 旗艦版', year: 2022, price: 850000, mileage: 15000,
    color: '鐵灰', transmission: 'automatic', fuelType: 'hybrid', condition: 'excellent',
    description: '原廠保固中，一手女用車，車況極佳，全額貸款可洽。定期回廠保養，紀錄完整。內裝無受損，適合家庭使用。',
    features: ['ACC主動定速', '盲點偵測', 'Toyota Safety Sense', '電動天窗', '導航系統', 'Apple CarPlay'],
    isAvailable: true, views: 128, days: 2,
    pics: ['camryGrey', 'interior', 'sedanWhiteFront'],
  },
  {
    make: 'BMW', model: '330i Sport Line', year: 2021, price: 1280000, mileage: 28000,
    color: '礦石灰', transmission: 'automatic', fuelType: 'gasoline', condition: 'excellent',
    description: '總代理汎德認證車，Sport Line 版本，M Sport 套件加持，操控與外觀兼具，無事故無泡水。',
    features: ['M Sport套件', '抬頭顯示器', 'Harman Kardon音響', '環景攝影', '無線充電', '真皮座椅'],
    isAvailable: true, views: 256, days: 5,
    pics: ['bmwGrey', 'bmwBlue', 'interior'],
  },
  {
    make: 'Tesla', model: 'Model 3 Long Range', year: 2023, price: 1650000, mileage: 8000,
    color: '午夜灰', transmission: 'automatic', fuelType: 'electric', condition: 'excellent',
    description: '幾近全新，Long Range 雙馬達版本，實測續航超過 500 公里。原廠電池保固內，可協助辦理充電樁。',
    features: ['Autopilot', '全玻璃車頂', 'Premium音響', 'OTA更新', '超音波感應器', '15吋觸控螢幕'],
    isAvailable: true, views: 312, days: 1,
    pics: ['nissanDark', 'evCharging', 'interior'],
  },
  {
    make: 'Honda', model: 'Civic e:HEV', year: 2022, price: 760000, mileage: 22000,
    color: '夜幕黑', transmission: 'automatic', fuelType: 'hybrid', condition: 'good',
    description: '油電混合省油環保，市區油耗優異，適合通勤族，原廠保固尚有一年可續。',
    features: ['Honda SENSING', 'LaneWatch盲點系統', '電動尾門', '換檔撥片', 'HDMI輸入', 'LED大燈'],
    isAvailable: true, views: 89, days: 10,
    pics: ['sedanBlack', 'sedanWhiteFront', 'interior'],
  },
  {
    make: 'Mercedes-Benz', model: 'C300 AMG Line', year: 2020, price: 1580000, mileage: 45000,
    color: '鑽石白', transmission: 'automatic', fuelType: 'gasoline', condition: 'good',
    description: '賓士原廠認證中古車，延長保固中，MBUX 智慧娛樂系統，AMG 外觀套件，豪華舒適。',
    features: ['MBUX系統', '全景天窗', 'Burmester音響', '電動座椅', '記憶功能', 'AMG套件'],
    isAvailable: false, views: 445, days: 15,
    pics: ['benzWhiteEv', 'benzRedAmg', 'interior'],
  },
  {
    make: 'Lexus', model: 'RX 350h 旗艦版', year: 2023, price: 2180000, mileage: 5000,
    color: '星鑽白', transmission: 'automatic', fuelType: 'hybrid', condition: 'excellent',
    description: '準新車，旗艦油電版本，頂規配置，靜謐舒適的豪華 SUV。自售自用，從未出險。',
    features: ['Mark Levinson音響', '360環景', '抬頭顯示器', '全景天窗', '電動尾門', '預碰撞系統'],
    isAvailable: true, views: 203, days: 3,
    pics: ['suvWhiteLarge', 'suvWhiteHonda', 'interior'],
  },
  {
    make: 'Mazda', model: 'Mazda3 4D 頂級型', year: 2021, price: 720000, mileage: 31000,
    color: '魂動紅', transmission: 'automatic', fuelType: 'gasoline', condition: 'excellent',
    description: '魂動紅原漆，車美無待修，Skyactiv 引擎順暢省油。內外皆有細心保養，可安排第三方認證。',
    features: ['i-ACTIVSENSE', 'BOSE音響', '抬頭顯示器', 'ACC主動定速', '無鑰匙進入', '後視鏡自動防眩'],
    isAvailable: true, views: 176, days: 7,
    pics: ['hyundaiRedHatch', 'jaguarRed', 'interior'],
  },
  {
    make: 'Audi', model: 'A4 40 TFSI Advanced', year: 2020, price: 1180000, mileage: 52000,
    color: '幻影黑', transmission: 'automatic', fuelType: 'gasoline', condition: 'good',
    description: '德系中型房車代表作，虛擬駕駛座艙，動力充沛。全車原鈑件，可貸可換。',
    features: ['虛擬駕駛座艙', 'LED矩陣頭燈', '電動尾門', '三區恆溫', 'Audi pre sense', '倒車顯影'],
    isAvailable: true, views: 198, days: 12,
    pics: ['audiBlackRs', 'audiRedR8', 'interior'],
  },
  {
    make: 'Volkswagen', model: 'Golf 8 280 eTSI', year: 2022, price: 890000, mileage: 19000,
    color: '湛海藍', transmission: 'automatic', fuelType: 'gasoline', condition: 'excellent',
    description: '第八代 Golf，48V 輕油電系統，操控靈活好停車。一手車主，原廠保養紀錄齊全。',
    features: ['IQ.Drive', 'Travel Assist', '數位儀錶', '無線CarPlay', '雙區恆溫', 'LED Plus頭燈'],
    isAvailable: true, views: 142, days: 6,
    pics: ['sedanTeal', 'sedanWhiteFront', 'interior'],
  },
  {
    make: 'Toyota', model: 'RAV4 2.0 旗艦', year: 2021, price: 980000, mileage: 36000,
    color: '極光白', transmission: 'automatic', fuelType: 'gasoline', condition: 'good',
    description: '國產最熱門休旅，空間大好上手，家庭首選。車況正常，四輪胎紋充足。',
    features: ['TSS 2.0', '電動尾門', '全速域ACC', '無線充電', '定速巡航', 'JBL音響'],
    isAvailable: true, views: 267, days: 9,
    pics: ['suvWhiteLarge', 'suvBlackRange', 'interior'],
  },
  {
    make: 'Nissan', model: 'Kicks 旗艦版', year: 2022, price: 620000, mileage: 24000,
    color: '星空銀', transmission: 'automatic', fuelType: 'gasoline', condition: 'good',
    description: '小改款 Kicks，都會小休旅，視野好停車容易，新手駕駛最愛。',
    features: ['ProPILOT', '環景影像', 'Nissan Connect', 'LED頭燈', '定速巡航', '後座出風口'],
    isAvailable: true, views: 95, days: 14,
    pics: ['nissanSilver', 'nissanDark', 'interior'],
  },
  {
    make: 'Ford', model: 'Focus ST-Line Lommel', year: 2021, price: 780000, mileage: 33000,
    color: '曜黑', transmission: 'automatic', fuelType: 'gasoline', condition: 'excellent',
    description: 'Lommel 調校版本，底盤紮實操控出色，ST-Line 外觀套件，年輕買家指名款。',
    features: ['Co-Pilot360', 'B&O音響', '運動化懸吊', '半自動停車', '數位儀錶', '電動天窗'],
    isAvailable: true, views: 158, days: 8,
    pics: ['fordMustangBlk', 'fordMustangSun', 'interior'],
  },
  {
    make: 'Hyundai', model: 'Tucson L 旗艦', year: 2022, price: 1050000, mileage: 21000,
    color: '夜幕黑', transmission: 'automatic', fuelType: 'gasoline', condition: 'excellent',
    description: '新世代 Tucson L，造型前衛配備豐富，空間表現同級最優，全景天窗加持。',
    features: ['SmartSense', '全景天窗', '環景影像', '電動尾門', '通風座椅', 'Bose音響'],
    isAvailable: true, views: 121, days: 11,
    pics: ['sedanBlack', 'hyundaiRedHatch', 'interior'],
  },
  {
    make: 'Porsche', model: 'Macan S', year: 2020, price: 2680000, mileage: 41000,
    color: '曜石黑', transmission: 'automatic', fuelType: 'gasoline', condition: 'good',
    description: '保時捷入門休旅，S 車型 2.9T V6 動力，PASM 可調懸吊，跑車化駕馭感受。',
    features: ['PASM可調懸吊', 'Sport Chrono', 'BOSE音響', '氣壓懸吊', '跑車排氣', '14向電動座椅'],
    isAvailable: true, views: 521, days: 4,
    pics: ['porscheBlack', 'porschePanamera', 'interior'],
  },
  {
    make: 'Volvo', model: 'XC60 B5 Momentum', year: 2021, price: 1720000, mileage: 29000,
    color: '曜石黑', transmission: 'automatic', fuelType: 'hybrid', condition: 'excellent',
    description: '安全至上的北歐豪華休旅，B5 輕油電動力，Pilot Assist 半自動駕駛輔助。',
    features: ['Pilot Assist', 'City Safety', '空氣清淨系統', '全景天窗', 'harman/kardon', '電動尾門'],
    isAvailable: true, views: 234, days: 13,
    pics: ['suvBlackRange', 'suvWhiteLarge', 'interior'],
  },
  {
    make: 'Toyota', model: 'Altis 1.8 豪華版', year: 2019, price: 540000, mileage: 68000,
    color: '銀灰', transmission: 'automatic', fuelType: 'gasoline', condition: 'good',
    description: '國民神車，維修保養便宜，妥善率高。里程稍多但機件正常，適合首購或營業用。',
    features: ['TSS 2.0', 'Toyota Drive+', '定速巡航', '恆溫空調', '倒車顯影', 'LED頭燈'],
    isAvailable: true, views: 312, days: 20,
    pics: ['sedanWhiteFront', 'camryGrey', 'interior'],
  },
  {
    make: 'BMW', model: 'X3 xDrive20i', year: 2020, price: 1690000, mileage: 47000,
    color: '晶亮藍', transmission: 'automatic', fuelType: 'gasoline', condition: 'good',
    description: 'xDrive 四驅系統，中型豪華休旅，空間與操控兼顧。已更換全新四輪胎。',
    features: ['xDrive四驅', '全景天窗', '手勢控制', '無線CarPlay', '電動尾門', '氛圍燈'],
    isAvailable: true, views: 287, days: 16,
    pics: ['bmwBlue', 'bmwBlueCoupe', 'interior'],
  },
  {
    make: 'Mercedes-Benz', model: 'GLC 300 4MATIC', year: 2021, price: 2280000, mileage: 26000,
    color: '鑽石白', transmission: 'automatic', fuelType: 'gasoline', condition: 'excellent',
    description: '四驅豪華休旅，AMG 內裝套件，柏林之聲音響，一手車主保養皆在原廠。',
    features: ['4MATIC四驅', 'Burmester音響', '柏林之聲', '全景天窗', '電動尾門', '智慧頭燈'],
    isAvailable: true, views: 389, days: 5,
    pics: ['benzWhiteEv', 'benzYellowAmg', 'interior'],
  },
  {
    make: 'Lexus', model: 'NX 200 豪華版', year: 2020, price: 1320000, mileage: 43000,
    color: '珍珠白', transmission: 'automatic', fuelType: 'gasoline', condition: 'good',
    description: '和泰原廠認證中古車，享原廠延長保固，內裝質感佳，妥善率有口碑。',
    features: ['LSS+', '電動尾門', '無線充電', '10.3吋螢幕', '雙區恆溫', '18吋鋁圈'],
    isAvailable: true, views: 176, days: 18,
    pics: ['suvWhiteHonda', 'suvWhiteLarge', 'interior'],
  },
  {
    make: 'Tesla', model: 'Model Y 後輪驅動', year: 2023, price: 1580000, mileage: 12000,
    color: '珍珠白', transmission: 'automatic', fuelType: 'electric', condition: 'excellent',
    description: '熱門電動休旅，後廂空間驚人，支援 V3 超充。車主換車出售，可代辦過戶。',
    features: ['Autopilot', '全景玻璃車頂', '哨兵模式', '熱泵空調', '電動尾門', 'OTA更新'],
    isAvailable: true, views: 402, days: 2,
    pics: ['suvWhiteLarge', 'evCharging', 'interior'],
  },
  {
    make: 'Subaru', model: 'Forester i-S EyeSight', year: 2021, price: 1090000, mileage: 34000,
    color: '晶燦白', transmission: 'automatic', fuelType: 'gasoline', condition: 'good',
    description: '對稱式全時四驅，水平對臥引擎低重心，山路與雨天穩定性極佳。',
    features: ['EyeSight 4.0', 'X-MODE', '對稱式四驅', '電動尾門', '全景天窗', 'harman/kardon'],
    isAvailable: true, views: 148, days: 17,
    pics: ['suvWhiteHonda', 'nissanSilver', 'interior'],
  },
  {
    make: 'Mitsubishi', model: 'Outlander 4WD 旗艦', year: 2019, price: 680000, mileage: 72000,
    color: '深鐵灰', transmission: 'automatic', fuelType: 'gasoline', condition: 'fair',
    description: '七人座四驅休旅，全家出遊好幫手。里程較高故價格實在，機件已整理完畢。',
    features: ['四輪驅動', '七人座', '電動天窗', '定速巡航', '倒車顯影', '恆溫空調'],
    isAvailable: true, views: 132, days: 25,
    pics: ['suvBlackRange', 'suvWhiteLarge', 'interior'],
  },
  {
    make: 'Audi', model: 'Q5 45 TFSI quattro', year: 2021, price: 1880000, mileage: 30000,
    color: '幻影黑', transmission: 'automatic', fuelType: 'gasoline', condition: 'excellent',
    description: 'quattro 四驅系統，S line 外觀，Bang & Olufsen 3D 環繞音響，配備滿載。',
    features: ['quattro四驅', 'B&O 3D音響', '矩陣式頭燈', '虛擬座艙', '全景天窗', '電動尾門'],
    isAvailable: true, views: 296, days: 6,
    pics: ['audiRedR8', 'audiBlackRs', 'interior'],
  },
  {
    make: 'Toyota', model: 'Sienta 七人座', year: 2020, price: 620000, mileage: 55000,
    color: '香草白', transmission: 'automatic', fuelType: 'gasoline', condition: 'good',
    description: '雙側電動滑門，低地板設計，長輩小孩上下車輕鬆，家庭與嬰兒車族首選。',
    features: ['雙側電動滑門', '七人座', 'TSS 2.0', '低地板設計', '倒車顯影', '定速巡航'],
    isAvailable: true, views: 187, days: 22,
    pics: ['sedanWhiteFront', 'sedanTeal', 'interior'],
  },
  {
    make: 'Honda', model: 'CR-V 1.5 VTi-S', year: 2022, price: 940000, mileage: 25000,
    color: '晶鑽白', transmission: 'automatic', fuelType: 'gasoline', condition: 'excellent',
    description: '國產休旅銷售常勝軍，1.5T 動力充足，後座空間寬敞，保養成本親民。',
    features: ['Honda SENSING', '電動尾門', 'LaneWatch', '恆溫空調', '免鑰匙進入', 'LED頭燈'],
    isAvailable: true, views: 213, days: 8,
    pics: ['suvWhiteHonda', 'sedanBlack', 'interior'],
  },
  {
    make: 'Kia', model: 'Sportage 1.6T GT-Line', year: 2023, price: 1180000, mileage: 11000,
    color: '晨曦白', transmission: 'automatic', fuelType: 'gasoline', condition: 'excellent',
    description: '新世代 Sportage，未來感虛擬雙聯螢幕，原廠七年保固可轉移，接近全新。',
    features: ['Drive Wise', '雙12.3吋聯螢幕', '全景天窗', '通風座椅', '360環景', 'harman/kardon'],
    isAvailable: true, views: 164, days: 3,
    pics: ['suvWhiteLarge', 'suvWhiteHonda', 'interior'],
  },
  {
    make: 'Porsche', model: '911 Carrera 992', year: 2020, price: 7980000, mileage: 18000,
    color: 'GT 銀', transmission: 'automatic', fuelType: 'gasoline', condition: 'excellent',
    description: '992 世代 Carrera，車庫車里程少，PDK 變速箱，跑車排氣系統，收藏級車況。',
    features: ['PDK變速箱', 'Sport Chrono', '跑車排氣', 'PASM懸吊', 'BOSE音響', '碳纖飾板'],
    isAvailable: false, views: 1287, days: 30,
    pics: ['porscheSilver', 'porscheBlack', 'porschePanamera'],
  },
  {
    make: 'Ford', model: 'Kuga ST-Line X', year: 2021, price: 1020000, mileage: 38000,
    color: '流星銀', transmission: 'automatic', fuelType: 'gasoline', condition: 'good',
    description: '歐系休旅底盤紮實，ST-Line X 頂規配備，B&O 音響與全景天窗一應俱全。',
    features: ['Co-Pilot360', 'B&O音響', '全景天窗', '電動尾門', '感應式尾門', '18吋鋁圈'],
    isAvailable: true, views: 109, days: 19,
    pics: ['fordMustangGt', 'fordMustangBlk', 'interior'],
  },
  {
    make: 'BMW', model: 'i4 eDrive40 M Sport', year: 2023, price: 2480000, mileage: 9000,
    color: '晶亮藍', transmission: 'automatic', fuelType: 'electric', condition: 'excellent',
    description: '純電四門跑房車，續航約 590 公里，曲面螢幕與 M Sport 套件，準新車況。',
    features: ['曲面數位螢幕', 'M Sport套件', 'harman/kardon', '駕駛輔助套件', '電動尾門', '熱泵系統'],
    isAvailable: true, views: 358, days: 1,
    pics: ['bmwBlueCoupe', 'bmwGrey', 'evCharging'],
  },
  {
    make: 'Suzuki', model: 'Swift Sport', year: 2019, price: 480000, mileage: 62000,
    color: '賽道藍', transmission: 'manual', fuelType: 'gasoline', condition: 'fair',
    description: '難得手排鋼砲，1.4T 動力輕快，車重僅 970 公斤。原漆有些許使用痕跡，機械狀況良好。',
    features: ['六速手排', '1.4T渦輪', '運動化懸吊', 'Recaro座椅', 'LED頭燈', '換檔提示'],
    isAvailable: true, views: 241, days: 28,
    pics: ['coupeBlueDesert', 'coupeBlueBridge', 'interior'],
  },
];

export const DEMO_CARS: Car[] = SEEDS.map((s, i) => {
  const { pics, days, ...rest } = s;
  return { ...rest, id: String(i + 1), images: pics.map(url), createdAt: daysAgo(days) };
});

export default DEMO_CARS;
