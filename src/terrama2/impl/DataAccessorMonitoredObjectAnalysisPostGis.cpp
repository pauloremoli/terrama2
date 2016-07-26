/*
 Copyright (C) 2007 National Institute For Space Research (INPE) - Brazil.

 This file is part of TerraMA2 - a free and open source computational
 platform for analysis, monitoring, and alert of geo-environmental extremes.

 TerraMA2 is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License as published by
 the Free Software Foundation, either version 3 of the License,
 or (at your option) any later version.

 TerraMA2 is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public License
 along with TerraMA2. See LICENSE. If not, write to
 TerraMA2 Team at <terrama2-team@dpi.inpe.br>.
 */

/*!
  \file terrama2/core/data-access/DataAccessorMonitoredObjectAnalysisPostGis.cpp

  \brief Data accessor for an monitored object analysis result.

  \author Paulo R. M. Oliveira
 */

#include "DataAccessorMonitoredObjectAnalysisPostGis.hpp"
#include "../core/utility/Raii.hpp"

//TerraLib
#include <terralib/dataaccess/datasource/DataSource.h>
#include <terralib/dataaccess/datasource/DataSourceFactory.h>
#include <terralib/dataaccess/datasource/DataSourceTransactor.h>

//QT
#include <QUrl>
#include <QObject>

terrama2::core::DataAccessorMonitoredObjectAnalysisPostGis::DataAccessorMonitoredObjectAnalysisPostGis(DataProviderPtr dataProvider, DataSeriesPtr dataSeries, const Filter& filter)
 : DataAccessor(dataProvider, dataSeries, filter),
   DataAccessorPostGis(dataProvider, dataSeries, filter)
{
  if(dataSeries->semantics.code != "ANALYSIS_MONITORED_OBJECT-postgis")
  {
    QString errMsg = QObject::tr("Wrong DataSeries semantics.");
    TERRAMA2_LOG_ERROR() << errMsg;
    throw WrongDataSeriesSemanticsException()  << ErrorDescription(errMsg);
  }
}

std::string terrama2::core::DataAccessorMonitoredObjectAnalysisPostGis::getTimestampPropertyName(DataSetPtr dataSet) const
{
  return "execution_date";
}

std::string terrama2::core::DataAccessorMonitoredObjectAnalysisPostGis::getGeometryPropertyName(DataSetPtr dataSet) const
{
  //TODO: Read the geom property from the monitored objet.
  QString errMsg = QObject::tr("NOT IMPLEMENTED YET.");
  TERRAMA2_LOG_ERROR() << errMsg;
  throw Exception() << ErrorDescription(errMsg);
}

std::string terrama2::core::DataAccessorMonitoredObjectAnalysisPostGis::dataSourceType() const
{
  return "POSTGIS";
}
