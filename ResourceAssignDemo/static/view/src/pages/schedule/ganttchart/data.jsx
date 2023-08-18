//Define data
// Set to 00:00:00:000 today
var today = new Date(),
	day = 1000 * 60 * 60 * 24;
// Set to 00:00:00:000 today
today.setUTCHours(0);
today.setUTCMinutes(0);
today.setUTCSeconds(0);
today.setUTCMilliseconds(0);
today = today.getTime();
export var sampleData = [
	{
		id: "1",
		name: "Task 1",
		current: 0,
		from: today - 1 * day,
		to: today + 2 * day,
		dependency: "",
		assignees: [
			{
				name: "Lisa Star",
			},
		],
	},
	{
		id: "2",
		name: "Task 2",
		current: 0,
		dependency: "1",
		from: today - 2 * day,
		to: today + 1 * day,
		assignees: [
			{
				name: "Martin Hammond",
			},
		],
	},
	{
		id: "3",
		name: "Task 3 này có cái name dài lắm đấy thử xem nên display thế nào",
		current: 0,
		dependency: "1",
		from: today + 0 * day,
		to: today + 3 * day,
		assignees: [
			{
				name: "Manh",
			},
		],
	},
	{
		id: "4",
		name: "Task 4",
		current: 0,
		dependency: "",
		from: today - 1 * day,
		to: today + 1 * day,
		assignees: [
			{
				name: "Huy",
			},
		],
	},
	{
		id: "5",
		name: "Task 5",
		current: 0,
		dependency: "4",
		from: today - 50 * day,
		to: today - 48 * day,
		assignees: [
			{
				name: "Trung",
			},
		],
	},
	{
		id: "6",
		name: "Task 6",
		current: 0,
		from: today - 4 * day,
		to: today + 2 * day,
		dependency: "",
		assignees: [
			{
				name: "Dat",
			},
		],
	},
	{
		id: "7",
		name: "Task 7",
		current: 0,
		dependency: "1",
		from: today - 5 * day,
		to: today - 3 * day,
		assignees: [
			{
				name: "Quy",
			},
		],
	},
	{
		id: "8",
		name: "Task 8 này có cái name dài lắm đấy thử xem nên display thế nào",
		current: 0,
		dependency: "6",
		from: today - 10 * day,
		to: today + 0 * day,
		assignees: [
			{
				name: "Mona Ricci",
			},
		],
	},
	{
		id: "9",
		name: "Task 9",
		current: 0,
		dependency: "",
		from: today - 1 * day,
		to: today + 1 * day,
		assignees: [
			{
				name: "Hailie Marshall",
			},
		],
	},
	{
		id: "10",
		name: "Task 10",
		current: 0,
		dependency: "4",
		from: today - 50 * day,
		to: today - 48 * day,
		assignees: [
			{
				name: "Harry Peterson",
			},
		],
	},
];
