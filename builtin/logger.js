const fs = require('fs-extra');
const path = require('path');

this.outConsole = () => this.outHandle = text => process.stdout.write(text);
this.outConsole();
this.errConsole = () => this.errHandle = text => process.stderr.write(text);
this.errConsole();
this.outPath = './log.txt';
this.outFile = file => {
	if (file !== undefined) this.outPath = file;
	fs.mkdirsSync(path.dirname(this.outPath));
	fs.ensureFileSync(this.outPath);
	this.outHandle = text => fs.appendFileSync(this.outPath, text, 'utf-8');
};
this.errPath = null;
this.errFile = file => {
	if (file !== undefined) this.errPath = file;
	fs.mkdirsSync(path.dirname(this.errPath));
	fs.ensureFileSync(this.errPath);
	this.errHandle = text => fs.appendFileSync(this.errPath, text, 'utf-8');
};
this.console = () => {
	this.outConsole();
	this.errConsole();
};
this.file = (out, err = out) => {
	this.outFile(out);
	this.errFile(err);
};
this.out = (text, handle) => (handle || this.outHandle)(text);
this.err = (text, handle) => (handle || this.errHandle)(text);
this.outln = (text, handle) => (handle || this.outHandle)(text + '\n');
this.errln = (text, handle) => (handle || this.errHandle)(text + '\n');
this.formatLog = text => `[Log]: ${text}`;
this.formatInfo = text => `[Info]: ${text}`;
this.formatWarn = text => `[Warn]: ${text}`;
this.formatError = text => `[Error]: ${text}`;
this.log = (text, handle) => this.outln(this.formatLog(text), handle);
this.info = (text, handle) => this.outln(this.formatInfo(text), handle);
this.warn = (text, handle) => this.errln(this.formatWarn(text), handle);
this.error = (text, handle) => this.errln(this.formatError(text), handle);