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
  \file terrama2/core/DataManager.hpp

  \brief Manages metadata about data providers and its datasets.

  \author Gilberto Ribeiro de Queiroz
  \author Jano Simas
  \author Paulo R. M. Oliveira
  \author Vinicius Campanha
*/

#include "DataManager.hpp"
#include "ApplicationController.hpp"
#include "DataProvider.hpp"
#include "DataProviderDAO.hpp"
#include "DataSet.hpp"
#include "DataSetDAO.hpp"



terrama2::core::DataManager::DataManager()
{

}

terrama2::core::DataManager::~DataManager()
{

}

terrama2::core::DataManager::DataManager(const terrama2::core::DataManager & rhs)
{

}

terrama2::core::DataManager& terrama2::core::DataManager::operator=(const terrama2::core::DataManager & rhs)
{

}

void terrama2::core::DataManager::load()
{

}

void terrama2::core::DataManager::unload()
{

}

void terrama2::core::DataManager::add(terrama2::core::DataProviderPtr provider)
{
  try
  {
    DataProviderDAO dataProviderDAO(ApplicationController::getInstance().getTransactor());
    dataProviderDAO.save(provider);
  }
  catch(...)
  {

  }
}

void terrama2::core::DataManager::add(terrama2::core::DataSetPtr dataset)
{

  try
  {
    DataSetDAO datasetDAO(ApplicationController::getInstance().getTransactor());
    datasetDAO.save(dataset);
  }
  catch(...)
  {

  }
}

void terrama2::core::DataManager::update(terrama2::core::DataProviderPtr dataProvider)
{

}

void terrama2::core::DataManager::update(terrama2::core::DataSetPtr dataset)
{

}

void terrama2::core::DataManager::removeDataProvider(u_int64_t id)
{

}

void terrama2::core::DataManager::removeDataSet(u_int64_t id)
{

}

terrama2::core::DataProviderPtr terrama2::core::DataManager::findDataProvider(u_int64_t id) const
{

}

terrama2::core::DataSetPtr terrama2::core::DataManager::findDataSet(u_int64_t id) const
{

}

terrama2::core::DataManager &terrama2::core::DataManager::instance()
{

}