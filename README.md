# RigidPlugins
> This is a very simple library that makes managing files and reloadable modules for your project much easier. Plugins follow a different format than modules, and are higher level. Some quirks are still being sorted out and more features will be added in the future, but for now it's pretty useful as it is.

## Example
```js
const plugins = require('rigidplugins');
const $ = plugins();

$.console = 'rigidplugins/builtin/logger';
plugins.all($, './my/custom/plugins');

$.console.info('Successfully included the logger plugin!');
```

## Documentation

### Plugin Manager
> The plugin manager is the main part of this module. You create one by instantiating the module itself.  

#### Plugin Files
> You can include plugins by assigning the path to a property on the manager, and exclude them by assigning the property a value of undefined.  

#### Enabling & Disabling
> Assigning a null value will reload a plugin. False disables plugins, and true enables them.  

#### Plugin Objects
> If you assign an object to a property on the plugin manager, it will become a plugin itself, with the enable and disable functions as it's foundation, the state value for it's initial state flag, and it's plugin attribute corresponding to the plugin's data.  

#### Plugin Usage
> The plugin itself, and it's enable and disable functions, are bound to the plugin's data object. You can access this object by using `this`.

### Plugin Utilities
`rigidplugins.all(manager, directory)` Includes all files in the directory into the plugin manager.  