/* status: played = играл; known = знакомая игра; candidate = рекомендация */
window.GAMES = [
{id:"gta-v",title:"Grand Theft Auto V",letter:"G",genre:"Открытый мир",tags:["Криминал","Экшен"],status:"played",appid:271590,featured:true,description:"Криминальный открытый мир Лос-Сантоса, машины и сюжетные задания."},
{id:"gta-sa",title:"Grand Theft Auto: San Andreas",letter:"G",genre:"Открытый мир",tags:["Криминал","Экшен"],status:"played",appid:12120,featured:true},
{id:"gta-vice-city",title:"Grand Theft Auto: Vice City",letter:"G",genre:"Открытый мир",tags:["Криминал","Экшен"],status:"played",appid:12110},
{id:"gta-iii",title:"Grand Theft Auto III",letter:"G",genre:"Открытый мир",tags:["Криминал","Экшен"],status:"played",appid:12100},
{id:"gta-iv",title:"Grand Theft Auto IV",letter:"G",genre:"Открытый мир",tags:["Криминал","Экшен"],status:"played",appid:12210,featured:true},
{id:"gta-trilogy",title:"Grand Theft Auto: The Trilogy – Definitive Edition",letter:"G",genre:"Открытый мир",tags:["Криминал","Сборник"],status:"played",appid:1547000},
{id:"gta-online",title:"GTA Online",letter:"G",genre:"Открытый мир",tags:["Криминал","Мультиплеер"],status:"played",appid:271590},
{id:"forza-5",title:"Forza Horizon 5",letter:"F",genre:"Гонки",tags:["Открытый мир","Автомобили"],status:"played",appid:1551360,featured:true,description:"Открытый мир Мексики, фестиваль Horizon и сотни автомобилей."},
{id:"forza-4",title:"Forza Horizon 4",letter:"F",genre:"Гонки",tags:["Открытый мир","Автомобили"],status:"played",appid:1293830,featured:true},
{id:"forza-6",title:"Forza Horizon 6",letter:"F",genre:"Гонки",tags:["Открытый мир","Автомобили"],status:"played",appid:2483190,featured:true},
{id:"forza-motorsport",title:"Forza Motorsport",letter:"F",genre:"Гонки",tags:["Трассы","Автомобили"],status:"candidate",appid:2440510},
{id:"half-life-2",title:"Half-Life 2",letter:"H",genre:"Шутер",tags:["Научная фантастика","Сюжет"],status:"played",appid:220,featured:true,description:"Культовый сюжетный шутер Valve с физическими головоломками."},
{id:"half-life-ep1",title:"Half-Life 2: Episode One",letter:"H",genre:"Шутер",tags:["Научная фантастика","Сюжет"],status:"played",appid:380},
{id:"half-life-ep2",title:"Half-Life 2: Episode Two",letter:"H",genre:"Шутер",tags:["Научная фантастика","Сюжет"],status:"played",appid:420},
{id:"portal",title:"Portal",letter:"P",genre:"Головоломка",tags:["Научная фантастика"],status:"played",appid:400},
{id:"portal-2",title:"Portal 2",letter:"P",genre:"Головоломка",tags:["Научная фантастика","Кооператив"],status:"played",appid:620,featured:true},
{id:"postal-2",title:"POSTAL 2",letter:"P",genre:"Экшен",tags:["Чёрный юмор","Песочница"],status:"played",appid:223470,featured:true},
{id:"postal-4",title:"POSTAL 4: No Regerts",letter:"P",genre:"Экшен",tags:["Чёрный юмор","Песочница"],status:"candidate",appid:707030},
{id:"cyberpunk",title:"Cyberpunk 2077",letter:"C",genre:"RPG / открытый мир",tags:["Киберпанк","Сюжет"],status:"played",appid:1091500,featured:true,description:"Футуристический Найт-Сити, сюжетная RPG и свобода исследования."},
{id:"sleeping-dogs",title:"Sleeping Dogs: Definitive Edition",letter:"S",genre:"Криминал",tags:["Открытый мир","Боевые искусства"],status:"played",appid:307690,featured:true,description:"Криминальный боевик в Гонконге с рукопашными боями и погонями."},
{id:"mafia-definitive",title:"Mafia: Definitive Edition",letter:"M",genre:"Криминал",tags:["Сюжет","Открытый мир"],status:"played",appid:1030840,featured:true},
{id:"mafia-2",title:"Mafia II: Definitive Edition",letter:"M",genre:"Криминал",tags:["Сюжет","Открытый мир"],status:"played",appid:1030830,featured:true},
{id:"mafia-3",title:"Mafia III: Definitive Edition",letter:"M",genre:"Криминал",tags:["Сюжет","Открытый мир"],status:"candidate",appid:360430},
{id:"just-cause",title:"Just Cause",letter:"J",genre:"Экшен",tags:["Открытый мир"],status:"candidate",appid:6880},
{id:"just-cause-2",title:"Just Cause 2",letter:"J",genre:"Экшен",tags:["Открытый мир","Разрушения"],status:"played",appid:8190},
{id:"just-cause-3",title:"Just Cause 3",letter:"J",genre:"Экшен",tags:["Открытый мир","Разрушения"],status:"played",appid:225540,featured:true},
{id:"just-cause-4",title:"Just Cause 4",letter:"J",genre:"Экшен",tags:["Открытый мир","Разрушения"],status:"played",appid:517630,featured:true},
{id:"max-payne",title:"Max Payne",letter:"M",genre:"Шутер",tags:["Криминал","Сюжет"],status:"candidate",appid:12140},
{id:"max-payne-2",title:"Max Payne 2: The Fall of Max Payne",letter:"M",genre:"Шутер",tags:["Криминал","Сюжет"],status:"candidate",appid:12150},
{id:"max-payne-3",title:"Max Payne 3",letter:"M",genre:"Шутер",tags:["Криминал","Сюжет"],status:"played",appid:204100,featured:true},
{id:"nfs-mw05",title:"Need for Speed: Most Wanted (2005)",letter:"N",genre:"Гонки",tags:["Уличные гонки","Классика"],status:"played",appid:13240,featured:true},
{id:"nfs-mw12",title:"Need for Speed: Most Wanted (2012)",letter:"N",genre:"Гонки",tags:["Открытый мир","Автомобили"],status:"played",appid:1262560},
{id:"nfs-payback",title:"Need for Speed Payback",letter:"N",genre:"Гонки",tags:["Открытый мир","Автомобили"],status:"played",appid:1262580},
{id:"burnout-paradise",title:"Burnout Paradise Remastered",letter:"B",genre:"Гонки",tags:["Открытый мир","Аркада"],status:"played",appid:1238080},
{id:"tomb-raider-2013",title:"Tomb Raider",letter:"T",genre:"Приключение",tags:["Экшен","Исследование"],status:"played",appid:203160,featured:true},
{id:"rise-tomb-raider",title:"Rise of the Tomb Raider",letter:"R",genre:"Приключение",tags:["Экшен","Исследование"],status:"played",appid:391220},
{id:"shadow-tomb-raider",title:"Shadow of the Tomb Raider",letter:"S",genre:"Приключение",tags:["Экшен","Исследование"],status:"played",appid:750920},
{id:"sims-4",title:"The Sims 4",letter:"S",genre:"Симулятор",tags:["Жизнь","Строительство"],status:"played",appid:1222670},
{id:"simpsons-game",title:"The Simpsons Game",letter:"T",genre:"Приключение",tags:["Комедия","Экшен"],status:"played",appid:0},
{id:"simpsons-hit-run",title:"The Simpsons: Hit & Run",letter:"T",genre:"Открытый мир",tags:["Гонки","Комедия"],status:"candidate",appid:0,featured:true},
{id:"miside",title:"MiSide",letter:"M",genre:"Хоррор",tags:["Психологический","Приключение"],status:"candidate",appid:2527500,featured:true},
{id:"far-cry-3",title:"Far Cry 3",letter:"F",genre:"Шутер",tags:["Открытый мир","Приключение"],status:"played",appid:220240,featured:true},
{id:"far-cry-4",title:"Far Cry 4",letter:"F",genre:"Шутер",tags:["Открытый мир","Приключение"],status:"candidate",appid:298110},
{id:"far-cry-5",title:"Far Cry 5",letter:"F",genre:"Шутер",tags:["Открытый мир","Приключение"],status:"played",appid:552520},
{id:"far-cry-6",title:"Far Cry 6",letter:"F",genre:"Шутер",tags:["Открытый мир","Приключение"],status:"played",appid:2369390},
{id:"far-cry-primal",title:"Far Cry Primal",letter:"F",genre:"Экшен",tags:["Открытый мир","Выживание"],status:"candidate",appid:371660},
{id:"metro-2033",title:"Metro 2033 Redux",letter:"M",genre:"Шутер",tags:["Постапокалипсис","Сюжет"],status:"played",appid:286690},
{id:"metro-last-light",title:"Metro: Last Light Redux",letter:"M",genre:"Шутер",tags:["Постапокалипсис","Сюжет"],status:"played",appid:287390},
{id:"metro-exodus",title:"Metro Exodus",letter:"M",genre:"Шутер",tags:["Постапокалипсис","Исследование"],status:"candidate",appid:412020,featured:true},
{id:"last-of-us",title:"The Last of Us Part I",letter:"T",genre:"Приключение",tags:["Сюжет","Постапокалипсис"],status:"played",appid:1888930,featured:true},
{id:"uncharted",title:"Uncharted: Legacy of Thieves Collection",letter:"U",genre:"Приключение",tags:["Сюжет","Исследование"],status:"candidate",appid:1659420,featured:true},
{id:"resident-evil-requiem",title:"Resident Evil Requiem",letter:"R",genre:"Хоррор",tags:["Выживание","Экшен"],status:"candidate",appid:0},
{id:"red-dead-2",title:"Red Dead Redemption 2",letter:"R",genre:"Открытый мир",tags:["Вестерн","Сюжет"],status:"played",appid:1174180,featured:true},
{id:"watch-dogs",title:"Watch Dogs",letter:"W",genre:"Открытый мир",tags:["Хакерство","Криминал"],status:"played",appid:243470},
{id:"watch-dogs-2",title:"Watch Dogs 2",letter:"W",genre:"Открытый мир",tags:["Хакерство","Криминал"],status:"played",appid:447040,featured:true},
{id:"watch-dogs-legion",title:"Watch Dogs: Legion",letter:"W",genre:"Открытый мир",tags:["Хакерство","Криминал"],status:"candidate",appid:2239550},
{id:"beamng",title:"BeamNG.drive",letter:"B",genre:"Симулятор",tags:["Автомобили","Физика"],status:"candidate",appid:284160,featured:true},
{id:"euro-truck",title:"Euro Truck Simulator 2",letter:"E",genre:"Симулятор",tags:["Вождение","Дороги"],status:"candidate",appid:227300},
{id:"american-truck",title:"American Truck Simulator",letter:"A",genre:"Симулятор",tags:["Вождение","Дороги"],status:"candidate",appid:270880},
{id:"my-summer-car",title:"My Summer Car",letter:"M",genre:"Симулятор",tags:["Автомобили","Выживание"],status:"played",appid:516750,featured:true},
{id:"minecraft",title:"Minecraft",letter:"M",genre:"Песочница",tags:["Выживание","Строительство"],status:"played",appid:0},
{id:"the-forest",title:"The Forest",letter:"T",genre:"Выживание",tags:["Хоррор","Открытый мир"],status:"candidate",appid:242760},
{id:"days-gone",title:"Days Gone",letter:"D",genre:"Открытый мир",tags:["Зомби","Приключение"],status:"candidate",appid:1259420},
{id:"dying-light",title:"Dying Light",letter:"D",genre:"Экшен",tags:["Зомби","Паркур"],status:"candidate",appid:239140},
{id:"dying-light-2",title:"Dying Light 2 Stay Human",letter:"D",genre:"Экшен",tags:["Зомби","Паркур"],status:"candidate",appid:534380},
{id:"mad-max",title:"Mad Max",letter:"M",genre:"Экшен",tags:["Открытый мир","Машины"],status:"candidate",appid:234140},
{id:"saints-row-3",title:"Saints Row: The Third",letter:"S",genre:"Криминал",tags:["Открытый мир","Комедия"],status:"candidate",appid:55230},
{id:"saints-row-4",title:"Saints Row IV",letter:"S",genre:"Криминал",tags:["Открытый мир","Комедия"],status:"candidate",appid:206420},
{id:"hitman-woa",title:"Hitman: World of Assassination",letter:"H",genre:"Стелс",tags:["Песочница","Экшен"],status:"candidate",appid:1659040},
{id:"dishonored",title:"Dishonored",letter:"D",genre:"Экшен",tags:["Стелс","Иммерсив-сим"],status:"candidate",appid:205100},
{id:"dishonored-2",title:"Dishonored 2",letter:"D",genre:"Экшен",tags:["Стелс","Иммерсив-сим"],status:"candidate",appid:403640},
{id:"control",title:"Control",letter:"C",genre:"Экшен",tags:["Научная фантастика","Сюжет"],status:"candidate",appid:870780},
{id:"alan-wake",title:"Alan Wake",letter:"A",genre:"Хоррор",tags:["Сюжет","Мистика"],status:"candidate",appid:108710},
{id:"alan-wake-2",title:"Alan Wake 2",letter:"A",genre:"Хоррор",tags:["Сюжет","Мистика"],status:"candidate",appid:0},
{id:"doom-eternal",title:"DOOM Eternal",letter:"D",genre:"Шутер",tags:["Экшен","Демоны"],status:"played",appid:782330},
{id:"battlefield-4",title:"Battlefield 4",letter:"B",genre:"Шутер",tags:["Военный","Мультиплеер"],status:"played",appid:1238860},
{id:"battlefield-1",title:"Battlefield 1",letter:"B",genre:"Шутер",tags:["Военный","Сюжет"],status:"candidate",appid:1238840},
{id:"call-of-duty-mw",title:"Call of Duty: Modern Warfare",letter:"C",genre:"Шутер",tags:["Военный","Экшен"],status:"played",appid:2000950},
{id:"crysis-2",title:"Crysis 2",letter:"C",genre:"Шутер",tags:["Научная фантастика","Экшен"],status:"candidate",appid:108800},
{id:"dead-space",title:"Dead Space",letter:"D",genre:"Хоррор",tags:["Научная фантастика","Выживание"],status:"candidate",appid:1693980},
{id:"outlast",title:"Outlast",letter:"O",genre:"Хоррор",tags:["Выживание","Психологический"],status:"candidate",appid:238320},
{id:"phasmophobia",title:"Phasmophobia",letter:"P",genre:"Хоррор",tags:["Кооператив","Паранормальное"],status:"candidate",appid:739630},
{id:"bully",title:"Bully: Scholarship Edition",letter:"B",genre:"Приключение",tags:["Открытый мир","Школа"],status:"candidate",appid:12200},
{id:"red-dead",title:"Red Dead Redemption",letter:"R",genre:"Открытый мир",tags:["Вестерн","Сюжет"],status:"played",appid:2668510},
{id:"witcher-3",title:"The Witcher 3: Wild Hunt",letter:"T",genre:"RPG / открытый мир",tags:["Фэнтези","Сюжет"],status:"played",appid:292030},
{id:"elden-ring",title:"Elden Ring",letter:"E",genre:"RPG",tags:["Фэнтези","Сложная"],status:"candidate",appid:1245620},
{id:"kingdom-come-2",title:"Kingdom Come: Deliverance II",letter:"K",genre:"RPG / открытый мир",tags:["История","Реализм"],status:"candidate",appid:1771300},
{id:"gmod",title:"Garry's Mod",letter:"G",genre:"Песочница",tags:["Физика","Мультиплеер"],status:"candidate",appid:4000},
{id:"nfs-heat",title:"Need for Speed Heat",letter:"N",genre:"Гонки",tags:["Уличные гонки","Открытый мир"],status:"played",appid:1222680},
{id:"nfs-unbound",title:"Need for Speed Unbound",letter:"N",genre:"Гонки",tags:["Уличные гонки","Открытый мир"],status:"candidate",appid:1846380},
{id:"crew-2",title:"The Crew 2",letter:"T",genre:"Гонки",tags:["Открытый мир","Автомобили"],status:"played",appid:646910},
{id:"crew-motorfest",title:"The Crew Motorfest",letter:"T",genre:"Гонки",tags:["Открытый мир","Автомобили"],status:"candidate",appid:2698940},
{id:"flatout-2",title:"FlatOut 2",letter:"F",genre:"Гонки",tags:["Разрушения","Аркада"],status:"candidate",appid:2990},
{id:"wreckfest",title:"Wreckfest",letter:"W",genre:"Гонки",tags:["Разрушения","Дерби"],status:"candidate",appid:228380},
{id:"rocket-league",title:"Rocket League",letter:"R",genre:"Спорт",tags:["Машины","Мультиплеер"],status:"candidate",appid:252950},
{id:"resident-evil-4",title:"Resident Evil 4",letter:"R",genre:"Хоррор",tags:["Экшен","Выживание"],status:"played",appid:2050650},
{id:"postal",title:"POSTAL",letter:"P",genre:"Экшен",tags:["Чёрный юмор","Классика"],status:"played",appid:232770},
{id:"portal-stories",title:"Portal Stories: Mel",letter:"P",genre:"Головоломка",tags:["Фанатская игра","Научная фантастика"],status:"candidate",appid:317400},
{id:"far-cry-2",title:"Far Cry 2",letter:"F",genre:"Шутер",tags:["Открытый мир","Выживание"],status:"candidate",appid:19900},
{id:"subnautica",title:"Subnautica",letter:"S",genre:"Выживание",tags:["Исследование","Подводный мир"],status:"candidate",appid:264710},
{id:"teardown",title:"Teardown",letter:"T",genre:"Песочница",tags:["Разрушения","Физика"],status:"candidate",appid:1167630},
{id:"ac-ii",title:"Assassin's Creed II",letter:"A",genre:"Приключение",tags:["Открытый мир","Стелс"],status:"played",appid:33230,featured:true},
{id:"ac-brotherhood",title:"Assassin's Creed Brotherhood",letter:"A",genre:"Приключение",tags:["Открытый мир","Стелс"],status:"candidate",appid:48190},
{id:"ac-black-flag",title:"Assassin's Creed IV: Black Flag",letter:"A",genre:"Приключение",tags:["Открытый мир","Пираты"],status:"candidate",appid:242050,featured:true},
{id:"ac-origins",title:"Assassin's Creed Origins",letter:"A",genre:"RPG / открытый мир",tags:["История","Исследование"],status:"played",appid:582160},
{id:"ac-odyssey",title:"Assassin's Creed Odyssey",letter:"A",genre:"RPG / открытый мир",tags:["История","Исследование"],status:"candidate",appid:812140},
{id:"ac-valhalla",title:"Assassin's Creed Valhalla",letter:"A",genre:"RPG / открытый мир",tags:["Викинги","Исследование"],status:"candidate",appid:2208920},
{id:"gta-london",title:"Grand Theft Auto: London 1969",letter:"G",genre:"Открытый мир",tags:["Криминал","Классика"],status:"candidate",appid:0},
{id:"half-life-source",title:"Half-Life: Source",letter:"H",genre:"Шутер",tags:["Научная фантастика","Классика"],status:"candidate",appid:280},
{id:"black-mesa",title:"Black Mesa",letter:"B",genre:"Шутер",tags:["Научная фантастика","Фанатский ремейк"],status:"candidate",appid:362890,featured:true},
{id:"left-4-dead-2",title:"Left 4 Dead 2",letter:"L",genre:"Шутер",tags:["Зомби","Кооператив"],status:"candidate",appid:550},
{id:"team-fortress-2",title:"Team Fortress 2",letter:"T",genre:"Шутер",tags:["Командный","Мультиплеер"],status:"candidate",appid:440},
{id:"counter-strike-2",title:"Counter-Strike 2",letter:"C",genre:"Шутер",tags:["Тактический","Мультиплеер"],status:"candidate",appid:730},
{id:"the-long-drive",title:"The Long Drive",letter:"T",genre:"Симулятор",tags:["Вождение","Выживание"],status:"candidate",appid:1017180},
{id:"car-mechanic-sim",title:"Car Mechanic Simulator 2021",letter:"C",genre:"Симулятор",tags:["Автомобили","Ремонт"],status:"candidate",appid:1190000},
{id:"street-legal-racing",title:"Street Legal Racing: Redline",letter:"S",genre:"Гонки",tags:["Тюнинг","Автомобили"],status:"candidate",appid:497180},
{id:"grid-legends",title:"GRID Legends",letter:"G",genre:"Гонки",tags:["Трассы","Автомобили"],status:"candidate",appid:1307710},
{id:"dirt-rally-2",title:"DiRT Rally 2.0",letter:"D",genre:"Гонки",tags:["Ралли","Симулятор"],status:"candidate",appid:690790},
{id:"need-for-speed-rivals",title:"Need for Speed Rivals",letter:"N",genre:"Гонки",tags:["Полиция","Открытый мир"],status:"candidate",appid:1262600},
{id:"need-for-speed-2015",title:"Need for Speed (2015)",letter:"N",genre:"Гонки",tags:["Уличные гонки","Тюнинг"],status:"candidate",appid:0},
{id:"driver-san-francisco",title:"Driver: San Francisco",letter:"D",genre:"Гонки",tags:["Открытый мир","Погони"],status:"candidate",appid:0,featured:true},
{id:"midnight-club-3",title:"Midnight Club 3: DUB Edition",letter:"M",genre:"Гонки",tags:["Уличные гонки","Классика"],status:"candidate",appid:0},
{id:"burnout-3",title:"Burnout 3: Takedown",letter:"B",genre:"Гонки",tags:["Аркада","Разрушения"],status:"candidate",appid:0},
{id:"the-walking-dead",title:"The Walking Dead: The Telltale Definitive Series",letter:"T",genre:"Приключение",tags:["Выборы","Зомби"],status:"candidate",appid:1449690},
{id:"life-is-strange",title:"Life is Strange",letter:"L",genre:"Приключение",tags:["Сюжет","Выборы"],status:"candidate",appid:319630},
{id:"detroit",title:"Detroit: Become Human",letter:"D",genre:"Приключение",tags:["Сюжет","Выборы"],status:"candidate",appid:1222140,featured:true},
{id:"heavy-rain",title:"Heavy Rain",letter:"H",genre:"Приключение",tags:["Детектив","Сюжет"],status:"candidate",appid:960910},
{id:"beyond-two-souls",title:"Beyond: Two Souls",letter:"B",genre:"Приключение",tags:["Сюжет","Выборы"],status:"candidate",appid:960990},
{id:"gta-definitive-san-andreas",title:"GTA: San Andreas – The Definitive Edition",letter:"G",genre:"Открытый мир",tags:["Криминал","Ремастер"],status:"played",appid:1547000},
{id:"the-elder-scrolls-skyrim",title:"The Elder Scrolls V: Skyrim",letter:"T",genre:"RPG / открытый мир",tags:["Фэнтези","Исследование"],status:"candidate",appid:489830},
{id:"fallout-4",title:"Fallout 4",letter:"F",genre:"RPG / открытый мир",tags:["Постапокалипсис","Исследование"],status:"candidate",appid:377160},
{id:"fallout-new-vegas",title:"Fallout: New Vegas",letter:"F",genre:"RPG / открытый мир",tags:["Постапокалипсис","Сюжет"],status:"candidate",appid:22380},
{id:"stalker-shadow-chernobyl",title:"S.T.A.L.K.E.R.: Shadow of Chernobyl",letter:"S",genre:"Шутер",tags:["Выживание","Открытый мир"],status:"candidate",appid:4500},
{id:"stalker-call-pripyat",title:"S.T.A.L.K.E.R.: Call of Pripyat",letter:"S",genre:"Шутер",tags:["Выживание","Открытый мир"],status:"candidate",appid:41700},
{id:"stalker-2",title:"S.T.A.L.K.E.R. 2: Heart of Chornobyl",letter:"S",genre:"Шутер",tags:["Выживание","Открытый мир"],status:"candidate",appid:1643320,featured:true},
{id:"gta-vc-stories",title:"Grand Theft Auto: Vice City Stories",letter:"G",genre:"Открытый мир",tags:["Криминал","Классика"],status:"played",appid:0},
{id:"prototype",title:"Prototype",letter:"P",genre:"Экшен",tags:["Открытый мир","Суперспособности"],status:"candidate",appid:10150},
{id:"prototype-2",title:"Prototype 2",letter:"P",genre:"Экшен",tags:["Открытый мир","Суперспособности"],status:"candidate",appid:115320},
{id:"crackdown-3",title:"Crackdown 3",letter:"C",genre:"Экшен",tags:["Открытый мир","Песочница"],status:"candidate",appid:0},
{id:"lego-city",title:"LEGO City Undercover",letter:"L",genre:"Открытый мир",tags:["Комедия","Приключение"],status:"candidate",appid:578330},
{id:"far-cry-new-dawn",title:"Far Cry New Dawn",letter:"F",genre:"Шутер",tags:["Открытый мир","Постапокалипсис"],status:"candidate",appid:939960},
{id:"far-cry-blood-dragon",title:"Far Cry 3: Blood Dragon",letter:"F",genre:"Шутер",tags:["Научная фантастика","Чёрный юмор"],status:"candidate",appid:233270},
{id:"far-cry-1",title:"Far Cry",letter:"F",genre:"Шутер",tags:["Классика","Приключение"],status:"candidate",appid:13520},
{id:"portal-reloaded",title:"Portal Reloaded",letter:"P",genre:"Головоломка",tags:["Порталы","Фанатская игра"],status:"candidate",appid:1255980},
{id:"aperture-desk-job",title:"Aperture Desk Job",letter:"A",genre:"Приключение",tags:["Комедия","Valve"],status:"candidate",appid:1902490},
{id:"postal-brain-damaged",title:"POSTAL: Brain Damaged",letter:"P",genre:"Шутер",tags:["Чёрный юмор","Экшен"],status:"candidate",appid:1359980},
{id:"postal-redux",title:"POSTAL Redux",letter:"P",genre:"Экшен",tags:["Чёрный юмор","Классика"],status:"candidate",appid:401680},
{id:"the-saboteur",title:"The Saboteur",letter:"T",genre:"Открытый мир",tags:["Криминал","Стелс"],status:"candidate",appid:0},
{id:"sherlock-crimes",title:"Sherlock Holmes: Crimes & Punishments",letter:"S",genre:"Приключение",tags:["Детектив","Расследование"],status:"candidate",appid:241260},
{id:"l-a-noire",title:"L.A. Noire",letter:"L",genre:"Криминал",tags:["Детектив","Открытый мир"],status:"candidate",appid:110800},
{id:"ghost-recon-wildlands",title:"Tom Clancy's Ghost Recon Wildlands",letter:"T",genre:"Шутер",tags:["Открытый мир","Тактика"],status:"candidate",appid:460930},
{id:"the-division-2",title:"Tom Clancy's The Division 2",letter:"T",genre:"Шутер",tags:["Открытый мир","Кооператив"],status:"candidate",appid:2221490},
{id:"watch-dogs-bad-blood",title:"Watch Dogs: Bad Blood",letter:"W",genre:"Открытый мир",tags:["Хакерство","Криминал"],status:"candidate",appid:0}
,
{id:"nfs-mw-2015",title:"Need for Speed (2015)",letter:"N",genre:"Гонки",tags:["Уличные гонки","Тюнинг"],status:"candidate",appid:0,featured:true},
{id:"tomb-raider-trilogy",title:"Tomb Raider Trilogy",letter:"T",genre:"Приключение",tags:["Экшен","Исследование"],status:"candidate",appid:0},
{id:"nfs-underground-2",title:"Need for Speed: Underground 2",letter:"N",genre:"Гонки",tags:["Уличные гонки","Тюнинг"],status:"candidate",appid:0,featured:true},
{id:"nfs-underground",title:"Need for Speed: Underground",letter:"N",genre:"Гонки",tags:["Уличные гонки","Классика"],status:"candidate",appid:0},
{id:"nfs-carbon",title:"Need for Speed: Carbon",letter:"N",genre:"Гонки",tags:["Уличные гонки","Тюнинг"],status:"candidate",appid:0},
{id:"gta-advance",title:"Grand Theft Auto Advance",letter:"G",genre:"Открытый мир",tags:["Криминал","Классика"],status:"candidate",appid:0},
{id:"postal-3",title:"POSTAL III",letter:"P",genre:"Экшен",tags:["Чёрный юмор","Песочница"],status:"candidate",appid:0}
,
{id:"mafia-old-country",title:"Mafia: The Old Country",letter:"M",genre:"Криминал",tags:["Сюжет","Экшен"],status:"played",appid:1941540,featured:false},
{id:"mafia-2-original",title:"Mafia II (Original)",letter:"M",genre:"Криминал",tags:["Сюжет","Открытый мир"],status:"played",appid:50130,featured:false},
{id:"tomb-raider-iii",title:"Tomb Raider III",letter:"T",genre:"Приключения",tags:["Исследование","Экшен"],status:"played",appid:225320,featured:false},
{id:"tomb-raider-underworld",title:"Tomb Raider: Underworld",letter:"T",genre:"Приключения",tags:["Исследование","Экшен"],status:"played",appid:8140,featured:false},
{id:"resident-evil-2-remake",title:"Resident Evil 2 (Remake)",letter:"R",genre:"Хоррор",tags:["Выживание","Экшен"],status:"played",appid:883710,featured:false},
{id:"resident-evil-3-remake",title:"Resident Evil 3 (Remake)",letter:"R",genre:"Хоррор",tags:["Выживание","Экшен"],status:"played",appid:952060,featured:false},
{id:"resident-evil-6",title:"Resident Evil 6",letter:"R",genre:"Хоррор",tags:["Экшен","Кооператив"],status:"played",appid:221040,featured:false},
{id:"resident-evil-revelations",title:"Resident Evil Revelations",letter:"R",genre:"Хоррор",tags:["Выживание","Экшен"],status:"played",appid:222480,featured:false},
{id:"last-of-us-2",title:"The Last of Us Part II",letter:"T",genre:"Приключения",tags:["Сюжет","Выживание"],status:"played",appid:2531310,featured:false},
{id:"uncharted-4",title:"Uncharted 4: A Thief’s End",letter:"U",genre:"Приключения",tags:["Сюжет","Экшен"],status:"played",appid:1659420,featured:false},
{id:"farming-simulator",title:"Farming Simulator",letter:"F",genre:"Симулятор",tags:["Ферма","Техника"],status:"played",appid:0,featured:false},
{id:"ac-iii",title:"Assassin’s Creed III",letter:"A",genre:"Экшен",tags:["История","Открытый мир"],status:"played",appid:911400,featured:false},
{id:"ac-unity",title:"Assassin’s Creed Unity",letter:"A",genre:"Экшен",tags:["Паркур","Открытый мир"],status:"played",appid:289650,featured:false},
{id:"cod-mw4",title:"Call of Duty 4: Modern Warfare",letter:"C",genre:"Шутер",tags:["Военный","Кампания"],status:"played",appid:7940,featured:false},
{id:"cod-mw2",title:"Call of Duty: Modern Warfare 2",letter:"C",genre:"Шутер",tags:["Военный","Кампания"],status:"played",appid:10180,featured:false},
{id:"cod-mw3",title:"Call of Duty: Modern Warfare 3",letter:"C",genre:"Шутер",tags:["Военный","Кампания"],status:"played",appid:115300,featured:false},
{id:"battlefield-v",title:"Battlefield V",letter:"B",genre:"Шутер",tags:["Военный","Мультиплеер"],status:"played",appid:1238810,featured:false},
{id:"nfs-hot-pursuit",title:"Need for Speed: Hot Pursuit",letter:"N",genre:"Гонки",tags:["Погони","Аркада"],status:"played",appid:1328660,featured:false},
{id:"carx-drift",title:"CarX Drift Racing Online",letter:"C",genre:"Гонки",tags:["Дрифт","Авто"],status:"played",appid:635260,featured:false},
{id:"gran-turismo-7",title:"Gran Turismo 7",letter:"G",genre:"Гонки",tags:["Симулятор","Авто"],status:"played",appid:0,featured:false},
{id:"hearts-of-iron-iv",title:"Hearts of Iron IV",letter:"H",genre:"Стратегия",tags:["История","Глобальная стратегия"],status:"played",appid:394360,featured:false},
{id:"plants-vs-zombies",title:"Plants vs. Zombies",letter:"P",genre:"Стратегия",tags:["Tower defense","Казуальная"],status:"played",appid:3590,featured:false},
{id:"bloons-td-6",title:"Bloons TD 6",letter:"B",genre:"Стратегия",tags:["Tower defense","Кооператив"],status:"played",appid:960090,featured:false},
{id:"diablo-3",title:"Diablo III",letter:"D",genre:"RPG",tags:["Фэнтези","Экшен"],status:"played",appid:0,featured:false},
{id:"among-us",title:"Among Us",letter:"A",genre:"Социальная игра",tags:["Мультиплеер","Дедукция"],status:"played",appid:945360,featured:false},
{id:"lego-batman",title:"LEGO Batman",letter:"L",genre:"Приключения",tags:["LEGO","Супергерои"],status:"played",appid:0,featured:false},
{id:"god-of-war-2018",title:"God of War (2018)",letter:"G",genre:"Экшен",tags:["Сюжет","Мифология"],status:"played",appid:1593500,featured:false},
{id:"god-of-war-ragnarok",title:"God of War Ragnarök",letter:"G",genre:"Экшен",tags:["Сюжет","Мифология"],status:"played",appid:2322010,featured:false},
{id:"spiderman-remastered",title:"Marvel’s Spider-Man Remastered",letter:"M",genre:"Экшен",tags:["Супергерои","Открытый мир"],status:"played",appid:1817070,featured:false},
{id:"half-life",title:"Half-Life",letter:"H",genre:"Шутер",tags:["Научная фантастика","Кампания"],status:"played",appid:70,featured:false}
];


// Plausible placeholder estimates until a verified Steam sync is configured. Never represent these as imported account data.
window.GAME_STATS = {
  "gta-v": {
    "hours": 68,
    "achievements": 34,
    "total": 56,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "gta-sa": {
    "hours": 42,
    "achievements": 36,
    "total": 46,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "gta-vice-city": {
    "hours": 23,
    "achievements": 25,
    "total": 27,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "gta-iii": {
    "hours": 15,
    "achievements": 22,
    "total": 57,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "gta-iv": {
    "hours": 31,
    "achievements": 31,
    "total": 67,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "gta-trilogy": {
    "hours": 49,
    "achievements": 16,
    "total": 34,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "gta-online": {
    "hours": 37,
    "achievements": 15,
    "total": 51,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "forza-5": {
    "hours": 83,
    "achievements": 40,
    "total": 47,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "forza-4": {
    "hours": 54,
    "achievements": 46,
    "total": 50,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "forza-6": {
    "hours": 12,
    "achievements": 48,
    "total": 88,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "half-life-2": {
    "hours": 13,
    "achievements": 31,
    "total": 48,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "half-life-ep1": {
    "hours": 4,
    "achievements": 34,
    "total": 78,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "half-life-ep2": {
    "hours": 5,
    "achievements": 34,
    "total": 37,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "portal": {
    "hours": 4,
    "achievements": 44,
    "total": 63,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "portal-2": {
    "hours": 9,
    "achievements": 71,
    "total": 82,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "postal-2": {
    "hours": 17,
    "achievements": 29,
    "total": 45,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "cyberpunk": {
    "hours": 74,
    "achievements": 36,
    "total": 68,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "sleeping-dogs": {
    "hours": 19,
    "achievements": 82,
    "total": 90,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "mafia-definitive": {
    "hours": 13,
    "achievements": 51,
    "total": 85,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "mafia-2": {
    "hours": 16,
    "achievements": 39,
    "total": 68,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "just-cause-2": {
    "hours": 31,
    "achievements": 52,
    "total": 80,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "just-cause-3": {
    "hours": 28,
    "achievements": 27,
    "total": 45,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "just-cause-4": {
    "hours": 12,
    "achievements": 18,
    "total": 30,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "max-payne-3": {
    "hours": 12,
    "achievements": 27,
    "total": 35,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "nfs-mw05": {
    "hours": 26,
    "achievements": 24,
    "total": 28,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "nfs-mw12": {
    "hours": 21,
    "achievements": 32,
    "total": 52,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "nfs-payback": {
    "hours": 25,
    "achievements": 25,
    "total": 48,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "burnout-paradise": {
    "hours": 19,
    "achievements": 58,
    "total": 84,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "tomb-raider-2013": {
    "hours": 14,
    "achievements": 36,
    "total": 60,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "rise-tomb-raider": {
    "hours": 17,
    "achievements": 20,
    "total": 55,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "shadow-tomb-raider": {
    "hours": 18,
    "achievements": 41,
    "total": 60,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "sims-4": {
    "hours": 46,
    "achievements": null,
    "total": null,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "simpsons-game": {
    "hours": 5,
    "achievements": null,
    "total": null,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "far-cry-3": {
    "hours": 24,
    "achievements": 28,
    "total": 31,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "far-cry-5": {
    "hours": 31,
    "achievements": 17,
    "total": 25,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "far-cry-6": {
    "hours": 9,
    "achievements": 15,
    "total": 54,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "metro-2033": {
    "hours": 9,
    "achievements": 71,
    "total": 81,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "metro-last-light": {
    "hours": 12,
    "achievements": 26,
    "total": 38,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "last-of-us": {
    "hours": 18,
    "achievements": 65,
    "total": 78,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "red-dead-2": {
    "hours": 91,
    "achievements": 39,
    "total": 48,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "watch-dogs": {
    "hours": 51,
    "achievements": 14,
    "total": 26,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "watch-dogs-2": {
    "hours": 49,
    "achievements": 15,
    "total": 27,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "my-summer-car": {
    "hours": 22,
    "achievements": null,
    "total": null,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "minecraft": {
    "hours": 47,
    "achievements": null,
    "total": null,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "doom-eternal": {
    "hours": 14,
    "achievements": 30,
    "total": 34,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "battlefield-4": {
    "hours": 12,
    "achievements": 44,
    "total": 62,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "call-of-duty-mw": {
    "hours": 9,
    "achievements": 75,
    "total": 83,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "red-dead": {
    "hours": 44,
    "achievements": 68,
    "total": 85,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "witcher-3": {
    "hours": 88,
    "achievements": 27,
    "total": 59,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "nfs-heat": {
    "hours": 14,
    "achievements": 17,
    "total": 31,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "crew-2": {
    "hours": 13,
    "achievements": 10,
    "total": 27,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "resident-evil-4": {
    "hours": 14,
    "achievements": 17,
    "total": 27,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "postal": {
    "hours": 4,
    "achievements": 11,
    "total": 24,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "ac-ii": {
    "hours": 22,
    "achievements": 39,
    "total": 64,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "ac-origins": {
    "hours": 32,
    "achievements": 42,
    "total": 51,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "gta-definitive-san-andreas": {
    "hours": 44,
    "achievements": 27,
    "total": 47,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "gta-vc-stories": {
    "hours": 43,
    "achievements": null,
    "total": null,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "mafia-old-country": {
    "hours": 11,
    "achievements": 8,
    "total": 32,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "mafia-2-original": {
    "hours": 14,
    "achievements": 32,
    "total": 56,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "tomb-raider-iii": {
    "hours": 7,
    "achievements": 13,
    "total": 29,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "tomb-raider-underworld": {
    "hours": 10,
    "achievements": 6,
    "total": 28,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "resident-evil-2-remake": {
    "hours": 8,
    "achievements": 19,
    "total": 35,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "resident-evil-3-remake": {
    "hours": 7,
    "achievements": 16,
    "total": 32,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "resident-evil-6": {
    "hours": 18,
    "achievements": 39,
    "total": 69,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "resident-evil-revelations": {
    "hours": 9,
    "achievements": 18,
    "total": 33,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "last-of-us-2": {
    "hours": 27,
    "achievements": 54,
    "total": 63,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "uncharted-4": {
    "hours": 16,
    "achievements": 63,
    "total": 68,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "farming-simulator": {
    "hours": 13,
    "achievements": null,
    "total": null,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "ac-iii": {
    "hours": 17,
    "achievements": 6,
    "total": 25,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "ac-unity": {
    "hours": 21,
    "achievements": 47,
    "total": 69,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "cod-mw4": {
    "hours": 7,
    "achievements": 5,
    "total": 30,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "cod-mw2": {
    "hours": 8,
    "achievements": 43,
    "total": 88,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "cod-mw3": {
    "hours": 7,
    "achievements": 78,
    "total": 85,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "battlefield-v": {
    "hours": 10,
    "achievements": 7,
    "total": 24,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "nfs-hot-pursuit": {
    "hours": 12,
    "achievements": 44,
    "total": 71,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "carx-drift": {
    "hours": 10,
    "achievements": 38,
    "total": 85,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "gran-turismo-7": {
    "hours": 42,
    "achievements": null,
    "total": null,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "hearts-of-iron-iv": {
    "hours": 26,
    "achievements": 12,
    "total": 89,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "plants-vs-zombies": {
    "hours": 14,
    "achievements": 43,
    "total": 63,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "bloons-td-6": {
    "hours": 20,
    "achievements": 39,
    "total": 48,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "diablo-3": {
    "hours": 33,
    "achievements": null,
    "total": null,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "among-us": {
    "hours": 11,
    "achievements": 26,
    "total": 72,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "lego-batman": {
    "hours": 21,
    "achievements": null,
    "total": null,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "god-of-war-2018": {
    "hours": 19,
    "achievements": 35,
    "total": 64,
    "completion": "playing",
    "estimated": true,
    "source": "estimate"
  },
  "god-of-war-ragnarok": {
    "hours": 29,
    "achievements": 24,
    "total": 26,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "spiderman-remastered": {
    "hours": 34,
    "achievements": 43,
    "total": 49,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  },
  "half-life": {
    "hours": 10,
    "achievements": 68,
    "total": 85,
    "completion": "completed",
    "estimated": true,
    "source": "estimate"
  }
};
