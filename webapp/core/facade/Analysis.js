'use strict';

/**
 * Facade Design Pattern - Analysis Registration
 *
 */
var Analysis = module.exports = { };

var DataManager = require("./../DataManager");
var PromiseClass = require("./../Promise");
var AnalysisError = require("./../Exceptions").AnalysisError;
var Utils = require("./../Utils");
var TcpService = require("../../core/facade/tcp-manager/TcpService");
// TerraMA² Analysis Simulator that generates a dummy analysis
var AnalysisBuilder = require("./builder/AnalysisBuilder");

/**
 * It handles a Analysis Registration concept.
 * 
 * @param {Object} analysisObject - An analysis object structure
 * @param {Object} storager - A storager object
 * @param {Object} scheduleObject - An schedule object structure
 * @param {number=} projectId - A current project id
 * @param {boolean} shouldRun - Flag to determines if analysis must run immediatly after saving process 
 * @return {Promise<Analysis>} a bluebird promise with Analysis instance value
 *
 * @example
 */
Analysis.save = function(analysisObject, storager, scheduleObject, projectId, shouldRun) {
  return new PromiseClass(function(resolve, reject) {
    try {
      analysisObject.type = Utils.getAnalysisType(analysisObject.type_id);

      // if does not have project_id, getting from cache
      if (!analysisObject.project_id) { analysisObject.project_id = projectId; }

      // temp code. TODO:fix
      analysisObject.script_language_id = 1;
      analysisObject.data_series_id = analysisObject.dataSeries.id;

      var dataSeries = {
        name: analysisObject.name,
        active: analysisObject.active,
        description: "Generated by analysis " + analysisObject.name,
        data_provider_id: analysisObject.data_provider_id,
        data_series_semantics_id: storager.semantics.format.id,
        dataSets: [
          {
            active: true,
            format: storager.format
          }
        ]
      };

      DataManager.orm.transaction(function(t) {
        var options = {
          transaction: t
        };

        return DataManager.addDataSeries(dataSeries, {
            data_series_id: analysisObject.data_series_id,
            type: analysisObject.type
          }, options)
          
          .then(function(dataSeriesResult) {
            return DataManager.addSchedule(scheduleObject, options).then(function(scheduleResult) {
              // adding analysis
              analysisObject.dataset_output = dataSeriesResult.dataSets[0].id;
              analysisObject.schedule_id = scheduleResult.id;

              return DataManager.addAnalysis(analysisObject, options).then(function(analysisResult) {
                analysisResult.setSchedule(scheduleResult);
                analysisResult.setDataSeries(dataSeriesResult);

                // async call. We should not wait for execution
                TcpService.send({
                  "DataSeries": [analysisResult.dataSeries.toObject()],
                  "Analysis": [analysisResult.toObject()]
                })
                  .then(function() {
                    if (shouldRun) {
                      return TcpService.run({
                        "ids": [analysisResult.id],
                        "service_instance": analysisResult.instance_id
                      });
                    }
                    return null;
                  });
                // throwing promise chain
                return analysisResult;
              });
            });
        });
      })

      .then(function(analysis) {
        return resolve(analysis);        
      })

      .catch(function(err) {
        return reject(err);
      });
    } catch (err) {
      return reject(err);
    }
  });
};

/**
 * It represents a common facade for retrieving analysis list
 * 
 * @param {Object} restriction - A query restriction
 * @return {Promise<Array<Analysis>>} a bluebird promise with Analysis instances
 */
Analysis.list = function(restriction) {
  return new PromiseClass(function(resolve, reject) {
    DataManager.listAnalysis(restriction).then(function(analysisList) {
      var output = [];
      analysisList.forEach(function(analysis) {
        output.push(analysis.rawObject());
      });
      return resolve(output);
    }).catch(function(err) {
      return reject(err);
    });
  });
};

/**
 * It represents a common facade for updating analysis instance
 * 
 * @param {number} analysisId - An analysis identifier to update
 * @param {number} projectId - A current project identifier
 * @param {Analysis | Object} analysisObject - An analysis object values to update
 * @param {Schedule | Object} scheduleObject - A schedule object values to update
 * @param {Object} storagerObject - A storager object values to update (dataseries)
 * @param {boolean} shouldRun - Flag to determines if analysis must run immediatly after saving process 
 * @return {Promise<Analysis>} A bluebird promise with analysis instance
 */
Analysis.update = function(analysisId, projectId, analysisObject, scheduleObject, storagerObject, shouldRun) {
  return new PromiseClass(function(resolve, reject) {
    DataManager.orm.transaction(function(t) {
      var options = {
        transaction: t
      };

      return DataManager.updateAnalysis(analysisId, analysisObject, scheduleObject, storagerObject, options)
        .then(function() {
          return DataManager.getAnalysis({id: analysisId, project_id: projectId}, options);
        })

        .then(function(analysisInstance) {
          TcpService.send({
            "DataSeries": [analysisInstance.dataSeries.toObject()],
            "Analysis": [analysisInstance.toObject()]
          })
            .then(function() {
              if (shouldRun) {
                return TcpService.run({
                  ids: [analysisInstance.id],
                  service_instance: [analysisInstance.instance_id]
                })
              }
            });

          return analysisInstance;        
        });
    })
    // on commit
    .then(function(analysis) {
      return resolve(analysis);
    })
    // on rollback
    .catch(function(err) {
      return reject(err);
    });
  });
};

/**
 * It represents a common facade for analysis remove performs.
 * 
 * @param {number} analysisId - An analysis identifier
 * @param {number} projectId - A current project identifier
 * @return {Promise<Analysis>} A bluebird promise result
 */
Analysis.delete = function(analysisId, projectId) {
  return new PromiseClass(function(resolve, reject) {
    DataManager.getAnalysis({id: analysisId, project_id: projectId}).then(function(analysis) {
      DataManager.removeAnalysis({id: analysisId}, null).then(function() {
        var objectToSend = {
          "Analysis": [analysis.id],
          "DataSeries": [analysis.dataSeries.id]
        };

        TcpService.remove(objectToSend, analysisId);

        return resolve(analysis);
      }).catch(function(err) {
        return reject(err);
      });
    }).catch(function(err) {
      return reject(err);
    });
  });
};

/**
 * It handles a Analysis Validation. It emits a dummy analysis to C++ services in order to check if 
 * it will able to generate a result 
 * 
 * @param {Object} analysisObject - An analysis object structure
 * @param {Object} storager - A storager object
 * @param {Object} scheduleObject - An schedule object structure
 * @param {number} projectId - A current project id 
 * @return {Promise<Analysis>} A promise with analysis sent
 */
Analysis.validate = function(analysisObject, storagerObject, scheduleObject, projectId) {
  return new PromiseClass(function(resolve, reject) {
    analysisObject.schedule = scheduleObject;
    analysisObject.project_id = projectId;
    // Todo: remove it
    analysisObject.script_language_id = 1;

    var promiseWKT = null;
    if (analysisObject.grid && analysisObject.grid.area_of_interest_box) {
      promiseWKT = DataManager.getWKT(analysisObject.grid.area_of_interest_box);
    }

    return PromiseClass.all([
        analysisObject,
        storagerObject,
        DataManager.getScriptLanguage({id: analysisObject.script_language_id}),
        promiseWKT
      ])
      .spread(function(analysis, storager, scriptLanguage, areaOfInterestWKT) {
        if (areaOfInterestWKT) {
          analysis.grid.interest_box = areaOfInterestWKT;
        }
        var dummyAnalysis = AnalysisBuilder(analysis, storager, scriptLanguage, {
          historical: analysis.historicalData || {}
        });

        return resolve(dummyAnalysis);
      })
      
      .catch(function(err) {
        return reject(err);
      });
  });
};