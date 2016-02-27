/** Created by ge on 2/26/16. */
"use strict";
var mongoose = require('mongoose');
var each = require('lodash/each');
var capitalize = require('lodash/capitalize');

function SchemaBuilder(schema, title) {
    var ModelSchema, methods, virtuals, options, indexConfig, pluginConfig;
    if (schema.__methods__) {
        methods = schema.__methods__;
        delete schema.__methods__;
    }
    if (schema.__virtuals__) {
        virtuals = schema.__virtuals__;
        delete schema.__virtuals__;
    }
    if (schema.__options__) {
        options = schema.__options__;
        delete schema.__options__;
    }
    if (schema.__index__) {
        indexConfig = [].concat(schema.__index__);
        delete schema.__index__;
    }
    if (schema.__insureIndex__) {
        delete schema.__insureIndex__;
    }
    if (schema.__plugin__) {
        pluginConfig = [].concat(schema.__plugin__);
        delete schema.__plugin__;
    }

    var settings;
    if (options) {
        settings = {collection: title};
        if (options._id === false) {
            settings._id = false;
        }
        if (options.autoIndexId === false) {
            settings.autoIndexId = false;
        }
        ModelSchema = new mongoose.Schema(schema, settings);
    } else {
        ModelSchema = new mongoose.Schema(schema, {collection: title});
    }

    if (pluginConfig) {
        each(pluginConfig, function (pluginConf) {
            ModelSchema.plugin(pluginConf);
        });
    }
    if (methods) {
        each(methods, function (method, methodKey) {
            ModelSchema.methods[methodKey] = method;
        });
    }
    if (virtuals) {
        each(virtuals, function (virtual, virtualKey) {
            if (virtualKey.slice(-3) == 'Set') {
                ModelSchema.virtual(virtualKey.slice(0, -3)).set(virtual);
            } else if (virtualKey.slice(-3) == 'Get') {
                ModelSchema.virtual(virtualKey.slice(0, -3)).get(virtual);
            } else if (virtualKey.slice(-3) == 'Pre') {
                ModelSchema.pre('save', virtual);
            }
        });
    }
    if (options) {
        each(options, function (option, optionKey) {
            ModelSchema.set(optionKey, option);
        });
    }
    if (indexConfig) {
        /** allow creation of multiple multifield indexes */
        each(indexConfig, function (indConf) {
            var indexOptions;
            if (indConf.__options__) {
                indexOptions = indConf.__options__;
                delete indConf.__options__;
            }
            ModelSchema.index(indConf, indexOptions);
        });
    }
    return ModelSchema;
}

function ModelBuilder(schema, title) {
    var ModelSchema, Model, ensureIndexes;
    if (schema.__insureIndex__) ensureIndexes = true;
    ModelSchema = SchemaBuilder(schema, title);
    Model = mongoose.model(capitalize(title), ModelSchema);
    if (ensureIndexes) {
        Model.ensureIndexes();
        Model.on('index', function (err) {
            if (err) return console.log('ensureIndex error:', err)
        })
    }
    return Model;
}

ModelBuilder.SchemaBuilder = SchemaBuilder;
module.exports =  ModelBuilder;
