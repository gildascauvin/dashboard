 export const webConfig = {
 	// baseApi: 'http://192.168.0.19:8000/',
	// baseApi: 'http://192.168.2.239:8000/',
 	base: 'http://localhost:8010/',
 	baseApi: 'http://localhost:8010/api/',
 	prefixApp: 'tpc_',
 	exercices: {
 		types: [
	 		{ id: 1, name: 'Single Movement'},
	 		{ id: 2, name: 'Complex Movements'},
	 		{ id: 3, name: 'Amrap'},
	 		{ id: 4, name: 'For Time'},
	 		{ id: 5, name: 'EMOM'},
	 		{ id: 6, name: 'Open Workouts'},
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
	 		scoring: [
	 			{ id: 1, name: 'Time'},
	 			{ id: 2, name: 'Distance'},
	 		],
	 		unit: [
	 			{ id: 1, name: 'Meters'},
	 			{ id: 2, name: 'Miles'},
	 			{ id: 3, name: 'Yards'},
	 		]
	 	}
 	}
};
