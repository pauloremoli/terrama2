define([
  "TerraMA2WebApp/common/loader",
  "TerraMA2WebApp/common/app",
  "TerraMA2WebApp/countries/app",
  "TerraMA2WebApp/alert-box/app",
  "TerraMA2WebApp/services/app",
  "TerraMA2WebApp/projects/app",
  "TerraMA2WebApp/status/status",
  "TerraMA2WebApp/data-provider/app",
  "TerraMA2WebApp/data-series/app",
  "TerraMA2WebApp/views/app",
  "TerraMA2WebApp/analysis/app",
  "TerraMA2WebApp/users/app"
], function(moduleLoader, commonModule, countriesModule, alertBoxModule, serviceModule, projectModule, 
            statusModule, dataProviderModule, dataSeriesModule, viewsModule, analysisModule, userModule) {
  var moduleName = "terrama2";

  var deps = [commonModule, countriesModule];

  moduleLoader(alertBoxModule, deps);
  moduleLoader(serviceModule, deps);
  moduleLoader(projectModule, deps);
  moduleLoader(statusModule, deps);
  moduleLoader(dataProviderModule, deps);
  moduleLoader(dataSeriesModule, deps);
  moduleLoader(viewsModule, deps);
  moduleLoader(analysisModule, deps);
  moduleLoader(userModule, deps);

  var terrama2Module = angular.module(moduleName, deps);

  terrama2Module.init = function() {
    angular.bootstrap(document, [moduleName]);
  };

  return terrama2Module;
});