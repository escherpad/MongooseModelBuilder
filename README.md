## Mongoose Model Builder

Have you ever wished that there is a way to write Mongoose schemas like a config object, instead of calling the `mongoose.schema` methods? This Schema Builder is the short script that I wrote for my own project.

### How to use?

#### To Build A Mongoose Schema
say we want to build a new mongoose schema:

```javascript
var mongoose = require('mongoose');
var map = require('lodash/map'); // require lodash 4.0.0<5.0.0. For <4.0.0 you need `require('lodash/collection/map');
var subSchemaConfig = {
    resourcePrototype: {
        path: {type: String},
        content: {type: String},
        url: {type: String},
        __options__: {
            _id: false,
            autoIndexId: false
        }
    }
};

var subSchema = map(subSchemaConfig, SchemaBuilder);

// if this is in a test, then we can expect: 
should.exist(subSchema.resourcePrototype);
should.exist(subSchema.resourcePrototype.path);
should.exist(subSchema.resourcePrototype.content);
should.exist(subSchema.resourcePrototype.url);
should.not.exist(subSchema.resourcePrototype.__options__);

```

#### To Build A Mongoose Model

```javascript
var mongoose = require('mongoose');
var map = require('lodash/map'); // require lodash 4.0.0<5.0.0. For <4.0.0 you need `require('lodash/collection/map');

var schemaConfig = {
    HashStore: {
        key: String,
        v: Number,
        resources: [subSchema.resourcePrototype],// include a sub schema
        __index__: [
            {
                key: -1,
                __options__: {unique: true}
            }
        ],
        __options__: {
            minimize: false,
            __ensureIndexes__: true
        }
    }
};

Models = map(schemaConfig, ModelBuilder);

// and now you can use the model:

var hashItem = new Models.HashStore({
    key: 'randome-string',
    v: 0,
    // resources
})

```

### To Develop and Test

run 

```shell
npm test
```

This calls `mocha ./ModelBuilder.spec.js` which executes the mocha spec for the model builder.
