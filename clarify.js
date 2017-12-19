'use strict';

const chain = require('stack-chain');
const sep = require('path').sep;
const customExcludes = [];

chain.filter.attach(function (error, frames) {
  return frames.filter(function (callSite) {
    const name = callSite && callSite.getFileName();
    return (name && name.includes(sep) && !name.startsWith('internal') && !isExcluded(name));
  });
});

function isExcluded(name){
	var i;
	for (i = customExcludes.length - 1; i >= 0; i--) {
		if (name.indexOf(customExcludes[i]) !== -1) {
			return true;
		}
	}
	return false;
}

function addExcludes(targets){
	targets.forEach(function (target){
		if (typeof target !== 'string' || customExcludes.includes(target)) return;
		if (!target.includes('node_modules')) {
			target = 'node_modules'+sep+target;
		}
		customExcludes.push(target);
	});
}

exports.filter = addExcludes