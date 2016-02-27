/** Created by ge on 2/26/16. */
var ModelBuilder = require('./ModelBuilder');
var SchemaBuilder = ModelBuilder.SchemaBuilder;
var should = require('should');

/* Then you can iterate through the object and generate a list of mongoose schema */
var map = require('lodash/each');

describe("MongooseModelBuilder", function () {

    var subSchema;

    describe("SchemaBuilder", function () {
        it("should be able to make schema", function () {
            /* First define an object that contains multiple schema */
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

            subSchema = map(subSchemaConfig, SchemaBuilder);
            should.exist(subSchema.resourcePrototype);
            should.exist(subSchema.resourcePrototype.path);
            should.exist(subSchema.resourcePrototype.content);
            should.exist(subSchema.resourcePrototype.url);
            should.not.exist(subSchema.resourcePrototype.__options__);
        });
    });
    describe("ModelBuilder", function () {
        var schemaConfig, Models;
        it("should be able to build mongoose models", function(){
            schemaConfig = {
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

            should.exist(Models.HashStore);
            should.exist(Models.HashStore.key);
            should.exist(Models.HashStore.v);
            should.exist(Models.HashStore.resources);
            should.not.exist(Models.HashStore.__index__);
            should.not.exist(Models.HashStore.__options__);

        });
        //it.skip("Model should be usable", function(done){
        //    var newStore = new schemaConfig.HashStore({
        //        key: 'randome-string',
        //        v: 0
        //        // resources: []
        //    })
        //});
    });
});

