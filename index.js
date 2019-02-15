const child_process = require('child_process');
const sub = require('subtitle')
const fs = require('fs');

var filterInt = function(value) {
  if (/^(-|\+)?(\d+)$/.test(value))
    return Number(value);
  return NaN;
}

if (process.argv[2] !== undefined) {
	var maxGap = filterInt(process.argv[2])
	if (isNaN(maxGap)){
		console.log('Maximum gap size is not recognized, using default (1000 ms)');
		maxGap = 1000;
	}
} else {
	var maxGap = 1000;
}

var files = [];
var subFiles = [];
var commands = [];

fs.readdirSync('./input/').forEach(file => {
  files.push(file);
});

fs.readdirSync('./subs/').forEach(subFile => {
  subFiles.push(subFile);
});


if (files.length != subFiles.length) {
	console.log('different amount of files in /input and /subs!');
	process.exit(1);
}

for(var i = 0; i < files.length; i++){
	const result = sub.parse(fs.readFileSync('./subs/' + subFiles[i], 'utf8'));
	var command = 'sox -r 44100 -b 320 -c 2 -t mp3 input/' + files[i] + ' -r 44100 -C 320 -c 2 -t mp3 output/' + files[i] + ' trim ';
	var trims = ['=0.0'];
	if (result[0].start > maxGap){
		trims.push('=' + String((maxGap/2)/1000));
		trims.push('=' + String((result[0].start - maxGap/2)/1000));
	}
	for (var j = 0; j < result.length - 1; j++) {
		if (result[j + 1].start - result[j].end > maxGap) {
			trims.push('=' + String((result[j].end + maxGap/2)/1000));
			trims.push('=' + String((result[j + 1].start - maxGap/2)/1000));
		}
	}
	command = command + trims.join(' ');
	commands.push(command);
}

for (var i = 0; i < commands.length; i++){
	child_process.spawn(commands[i], {
		detached: true,
		shell: true
	});
}