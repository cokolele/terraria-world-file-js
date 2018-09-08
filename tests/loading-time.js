const terrariaWorldParser = require("../terraria-world-parser.js");

const worlds = ["Canvas", "Doge", "Doge2"];

/**
 * control settings
 * @property {number}  parses    - How many times is each map parsed
 * @property {string}  units     - Set time units ( ms or s )
 * @property {boolean} showTimes - Print parse time after every parse
 */
const settings = {
	parses: 3,
	units: "s", // ms or s
	showTimes: false,
}

class Stopwatch
{
	constructor()
	{
		this.start = new Date().getTime();
	}

	Stop()
	{
		this.stop = new Date().getTime();
		return this.stop - this.start;
	}
}

function formatTime(time, showUnits = true)
{
	const units = showUnits ? settings.units : "";

	if (settings.units === "ms")
		return time + units;
	else if (settings.units === "s")
		return (time / 1000) + units;
}

function roundUp(time)
{
	return Number.parseFloat(time).toPrecision(4);
}

try
{
	if (!settings.showTimes)
		console.log("");

	let parsesCount = 0;
	let totalSum = 0;

	worlds.forEach( map => {
		let sum = 0;

		if (settings.showTimes)
			process.stdout.write("\n [ ");

		for (let i = 1; i <= settings.parses; i++)
		{
			let stopwatch = new Stopwatch();
			let world = new terrariaWorldParser("./worlds/" + map + ".wld").Load();
			const time = stopwatch.Stop();

			sum += time;
			totalSum += time;
			parsesCount++;

			if (settings.showTimes)
				process.stdout.write( formatTime(time, false) + (i == settings.parses ? " " : ", " ));
		}

		if (settings.showTimes)
			process.stdout.write("]");

		const avg = roundUp(sum / settings.parses);

		if (settings.showTimes)
			console.log("");
		console.log(`${map} average of ${settings.parses} parses - ${formatTime(avg)}`);
	});
	
	totalAvg = roundUp(totalSum / parsesCount);

	console.log(`\nTotal average - ${formatTime(totalAvg)}`)
}
catch (e)
{
	console.log(e.message);
}