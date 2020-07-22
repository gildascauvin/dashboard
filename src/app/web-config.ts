import { environment } from '../environments/environment';

export const webConfig = {
 	base: environment.base,
 	baseApi: environment.baseApi,
 	prefixApp: 'tpc_customer_',
 	timezone: [
        { name: "(GMT -12:00) Eniwetok, Kwajalein", value: "-12:00"},
        { name: "(GMT -11:00) Midway Island, Samoa", value: "-11:00"},
        { name: "(GMT -10:00) Hawaii", value: "-10:00"},
        { name: "(GMT -9:30) Taiohae", value: "-09:50"},
        { name: "(GMT -9:00) Alaska", value: "-09:00"},
        { name: "(GMT -8:00) Pacific Time (US &amp; Canada)", value: "-08:00"},
        { name: "(GMT -7:00) Mountain Time (US &amp; Canada)", value: "-07:00"},
        { name: "(GMT -6:00) Central Time (US &amp; Canada), Mexico City", value: "-06:00"},
        { name: "(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima", value: "-05:00"},
        { name: "(GMT -4:30) Caracas", value: "-04:50"},
        { name: "(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz", value: "-04:00"},
        { name: "(GMT -3:30) Newfoundland", value: "-03:50"},
        { name: "(GMT -3:00) Brazil, Buenos Aires, Georgetown", value: "-03:00"},
        { name: "(GMT -2:00) Mid-Atlantic", value: "-02:00"},
        { name: "(GMT -1:00) Azores, Cape Verde Islands", value: "-01:00"},
        { name: "(GMT) Western Europe Time, London, Lisbon, Casablanca", value: "+00:00"},
        { name: "(GMT +1:00) Brussels, Copenhagen, Madrid, Paris", value: "+01:00"},
        { name: "(GMT +2:00) Kaliningrad, South Africa", value: "+02:00"},
        { name: "(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg", value: "+03:00"},
        { name: "(GMT +3:30) Tehran", value: "+03:50"},
        { name: "(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi", value: "+04:00"},
        { name: "(GMT +4:30) Kabul", value: "+04:50"},
        { name: "(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent", value: "+05:00"},
        { name: "(GMT +5:30) Bombay, Calcutta, Madras, New Delhi", value: "+05:50"},
        { name: "(GMT +5:45) Kathmandu, Pokhara", value: "+05:75"},
        { name: "(GMT +6:00) Almaty, Dhaka, Colombo", value: "+06:00"},
        { name: "(GMT +6:30) Yangon, Mandalay", value: "+06:50"},
        { name: "(GMT +7:00) Bangkok, Hanoi, Jakarta", value: "+07:00"},
        { name: "(GMT +8:00) Beijing, Perth, Singapore, Hong Kong", value: "+08:00"},
        { name: "(GMT +8:45) Eucla", value: "+08:75"},
        { name: "(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk", value: "+09:00"},
        { name: "(GMT +9:30) Adelaide, Darwin", value: "+09:50"},
        { name: "(GMT +10:00) Eastern Australia, Guam, Vladivostok", value: "+10:00"},
        { name: "(GMT +10:30) Lord Howe Island", value: "+10:50"},
        { name: "(GMT +11:00) Magadan, Solomon Islands, New Caledonia", value: "+11:00"},
        { name: "(GMT +11:30) Norfolk Island", value: "+11:50"},
        { name: "(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka", value: "+12:00"},
        { name: "(GMT +12:45) Chatham Islands", value: "+12:75"},
        { name: "(GMT +13:00) Apia, Nukualofa", value: "+13:00"},
        { name: "(GMT +14:00) Line Islands, Tokelau", value: "+14:00"}
 	],
 	mrv: {
 		gender: [
 			{ id: 1, name: 'Men'},
 			{ id: 2, name: 'Women'},
 		],
 		weight: [
 			{ id: 1, name: 'Very heavy (+90kg / +120kg)'},
 			{ id: 2, name: 'Heavy (75-90kg / 90-120kg)'},
 			{ id: 3, name: 'Medium (57-75kg / 75-90kg)'},
 			{ id: 4, name: 'Light (-57kg / -75 kg)'},
 		],
 		height: [
 			{ id: 1, name: 'Very tall (+175cm / +195cm)'},
 			{ id: 2, name: 'Tall (167-175cm / 182-195cm)'},
 			{ id: 3, name: 'Medium (160-167cm / 170-182cm)'},
 			{ id: 4, name: 'Small (-160cm / -170cm)'},
 		],
 		strenght: [
 			{ id: 1, name: 'Very strong'},
 			{ id: 2, name: 'Strong'},
 			{ id: 3, name: 'Medium'},
 			{ id: 4, name: 'Weak'},
 		],
 		experience: [
 			{ id: 1, name: 'Very advanced (+12 years)'},
 			{ id: 2, name: 'Advanced (8-12 years)'},
 			{ id: 3, name: 'Intermediate (4-8 years)'},
 			{ id: 4, name: 'Weak'},
 		],
 		age: [
 			{ id: 1, name: '50+'},
 			{ id: 2, name: '40-50'},
 			{ id: 3, name: '30-40'},
 			{ id: 4, name: '20-30'},
 			{ id: 5, name: '<19'},
 		],
 		diet: [
 			{ id: 1, name: 'Bad (not enough calories)'},
 			{ id: 2, name: 'Average (cals ok but bad macros / timing)'},
 			{ id: 3, name: 'Good (Cals ok with good macros and nutrient timing)'},
 		],
 		sleep: [
 			{ id: 1, name: 'Bad (< 5hrs / night)'},
 			{ id: 2, name: 'Average (5 - 7 hrs / night)'},
 			{ id: 3, name: 'Good (+7 hrs / night)'},
 		],
 		stress: [
 			{ id: 1, name: 'High'},
 			{ id: 2, name: 'Average'},
 			{ id: 3, name: 'Low'},
 		],
 		recovery: [
 			{ id: 1, name: 'Low'},
 			{ id: 2, name: 'Average'},
 			{ id: 3, name: 'Good'},
 			{ id: 4, name: 'Very good'},
 		]
 	},
 	exercices: {
 		size: [
 			{ id: 1, name: 'kg'},
	 		{ id: 2, name: 'lbs'},
	 		{ id: 3, name: '%'},
	 		{ id: 4, name: 'watts'},
	 		{ id: 5, name: 'km/h'},
 		],
 		section: [
 			{ id: 1, name: 'Simple exercices', label: 'An exercice for reps, meters...' },
 			{ id: 2, name: 'Complex exercices', label: 'Set of multiple movments (complex, supersets, plyo + Sprints...)' },
 			{ id: 3, name: 'Timed exercices', label: 'Circuit and cross training: Hiit, Amrap, For time, Emoms...' },
 			{ id: 4, name: 'Cardio & intervals', label: 'Long distance/time and intervals' },
 			{ id: 8, name: 'Custom', label: 'Do you own thing !' },
 		],
 		types: [
	 		{ id: 1, name: 'Single Movement'},
	 		{ id: 2, name: 'Complex Movements'},
	 		// { id: 3, name: 'Amrap'},
	 		{ id: 4, name: 'For Time'},
	 		// { id: 5, name: 'EMOM'},
	 		// { id: 6, name: 'Open Workouts'},
	 		{ id: 7, name: 'Cardio'},
	 		{ id: 8, name: 'Custom'},
	 	],
	 	time: [
	 		{ id: 1, name: 'Fixed'},
	 		{ id: 2, name: 'Varying'},
	 	],
	 	custom: [
	 		{ id: 1, name: 'Rounds'},
	 		{ id: 2, name: 'Reps'},
	 		{ id: 3, name: 'Time'},
	 		{ id: 4, name: 'Load'},
	 		{ id: 5, name: 'None'},
	 	],
	 	flatCustom: {
	 		1: 'Rounds',
	 		2: 'Reps',
	 		3: 'Time',
	 		4: 'Load',
	 		5: 'None',
	 	},
	 	emom: [
	 		{ id: 1, name: 'Rounds'},
	 		{ id: 2, name: 'Reps'},
	 		{ id: 3, name: 'Load'},
	 	],
	 	cardio: {
	 		type: [
	 			{ id: 1, name: 'Run'},
	 			{ id: 2, name: 'Bike'},
	 			{ id: 3, name: 'Row'},
	 			{ id: 4, name: 'Swim'},
	 			{ id: 5, name: 'Ski'},
	 		],
	 		flatType: {
		 		1: 'Run',
		 		2: 'Bike',
		 		3: 'Row',
		 		4: 'Swim',
		 		5: 'Ski',
		 	},
	 		scoring: [
	 			{ id: 1, name: 'Time'},
	 			{ id: 2, name: 'Distance'},
	 		],
	 		cardio: [
	 			{ id: 1, name: 'Cardio'},
	 			{ id: 2, name: 'Intervals'},
	 		],
	 		unit: [
	 			{ id: 1, name: 'Meters'},
	 			{ id: 2, name: 'Miles'},
	 			{ id: 3, name: 'Yards'},
	 		],
	 		flatUnit: {
	 			1: 'Meters',
	 			2: 'Miles',
	 			3: 'Yards',
	 		}
	 	}
 	},
 	categories: (environment.production
 		? { 8: 1, 9: 5, 12: 1, 13: 2, 14: 2, 15: 2, 16: 2, 17: 2, 18: 2, 19: 2, 20: 2, 21: 2, 22: 4, 23: 4, 24: 4, 25: 4, 26: 3, 27: 3, 28: 3, 29: 3, 30: 3, 31: 3, 32: 3, 33: 3, 34: 6, 35: 6, 36: 6, 37: 6, 38: 6, 39: 7, 40: 7, 41: 7, 42: 7, 43: 7, 44: 7, 45: 7, 46: 7, 47: 7, 48: 7, 49: 7, 50: 7, 51: 7, 52: 7, 53: 7, 54: 7, 55: 7, 56: 7, 57: 7, 58: 7, 59: 7, 60: 7, 61: 7, 62: 7, 63: 7, 64: 7, 65: 7, 66: 7 }
 		: { 8: 1, 9: 5, 10: 1, 11: 2, 12: 2, 13: 2, 14: 2, 15: 2, 16: 2, 17: 2, 18: 2, 19: 2, 20: 4, 21: 4, 22: 4, 23: 4, 24: 3, 25: 3, 26: 3, 27: 3, 28: 3, 29: 3, 30: 3, 31: 3, 32: 6, 33: 6, 34: 6, 35: 6, 36: 6, 37: 7, 38: 7, 39: 7, 40: 7, 41: 7, 42: 7, 43: 7, 44: 7, 45: 7, 46: 7, 47: 7, 48: 7, 49: 7, 50: 7, 51: 7, 52: 7, 53: 7, 54: 7, 55: 7, 56: 7, 57: 7, 58: 7, 59: 7, 60: 7, 61: 7, 62: 7, 63: 7, 64: 7 }),

};
