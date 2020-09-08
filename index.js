module.exports = () => {

	let fs = require('fs-extra');

	function evaluate(text, scope) {
		return function() {
			with(this) {
				return eval(text);
			};
		}.call(scope);
	}

	const defaults = () => {
		return {
			enable: () => {},
			disable: () => {},
			plugin: {},
			state: false
		};
	};

	const plugins = {};
	const files = {};

	const proxy = new Proxy(fetch, {
		get: (target, name) => {
			const item = resolve(name);
			if (item === null) {
				throw new Error(`There is no plugin named ${name}.`);
			}
			return item.plugin;
		},
		set: (target, name, action) => {
			const plugin = resolve(name);
			if (action === undefined) {
				if (plugin === null) {
					throw new Error(`There is no plugin named ${name}.`);
				}
				disable(name);
				if (typeof plugin == 'string') delete files[plugin];
				delete plugins[name];
			} else if (action === false) {
				if (plugin === null) {
					throw new Error(`There is no plugin named ${name}.`);
				}
				disable(name);
			} else if (action === true) {
				if (plugin === null) {
					throw new Error(`There is no plugin named ${name}.`);
				}
				enable(name);
			} else if (action === null) {
				if (plugin === null) {
					throw new Error(`There is no plugin named ${name}.`);
				}
				const state = plugin.state;
				if (state) {
					disable(name);
					enable(name);
				}
			} else if (typeof action == 'string') {
				if (plugin !== null) {
					throw new Error(`There is already a plugin named ${name}.`);
				}
				disable(name);
				const loc = require.resolve(action);
				files[loc] = fetch(loc);
				plugins[name] = loc;
				enable(name);
			} else if (typeof action == 'object') {
				if (plugin !== null) {
					throw new Error(`There is already a plugin named ${name}.`);
				}
				disable(name);
				plugins[name] = fetch(action);
				enable(name);
			}
		}
	});

	let terminated = false;

	function handler() {
		for (const name of Object.keys(plugins)) {
			disable(name);
		}
	}

	function terminate() {
		if (terminated) return;
		terminated = true;
		handler();
		process.exit();
	}

	process.on('exit', terminate);
	process.on('SIGINT', terminate);
	process.on('SIGUSR1', terminate);
	process.on('SIGUSR2', terminate);
	process.on('uncaughtException', error => {
		console.error(error);
		terminate();
	});

	function enable(name) {
		const plugin = resolve(name);
		if (plugin !== null && !plugin.state) {
			plugin.enable();
			plugin.state = true;
		}
	}
	function disable(name) {
		const plugin = resolve(name);
		if (plugin !== null && plugin.state) {
			plugin.disable();
			plugin.state = false;
		}
	}
	function fetch(path) {
		if (typeof path == 'object') return {...defaults(), ...path};
		let plugin = {};
		const res = evaluate(`
			function enable() {};
			function disable() {};
			${fs.readFileSync(path, 'utf-8')};
			({enable, disable})
		`, plugin);
		return {
			plugin, state: false,
			enable: res.enable,
			disable: res.disable
		};
	}
	function resolve(name) {
		if (name in plugins) {
			const res = plugins[name];
			if (typeof res == 'string') {
				if (res in files) {
					return files[res];
				} else return null;
			} else return res;
		} else return null;
	}

	return proxy;

};