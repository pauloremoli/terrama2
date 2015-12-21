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
  \file terrama2/gui/config/ConfigApp.hpp

  \brief The base class for tab handling.

  \author Raphael Willian da Costa
*/

#ifndef __TERRAMA2_GUI_CONFIG_CONFIGTAB_HPP__
#define __TERRAMA2_GUI_CONFIG_CONFIGTAB_HPP__

// QT
#include <QString>
#include <QObject>

// Boost
#include <boost/noncopyable.hpp>

class ConfigApp;
namespace Ui
{
  class ConfigAppForm;
}

namespace terrama2
{
  namespace core
  {
    class DataSet;
  }
}

class ConfigAppTab : public QObject, private boost::noncopyable
{
  Q_OBJECT

  public:
    //! Constructor
    ConfigAppTab(ConfigApp* app = nullptr, Ui::ConfigAppForm* ui = nullptr);

    //! Destructor
    virtual ~ConfigAppTab();

    /*!
      \brief Loads the read data to interface.
    */
    virtual void load() = 0;

    virtual void load(const terrama2::core::DataSet&);

    /*!
     \brief It shows if data were changed by user
    */
    virtual bool dataChanged();

    /*!
     \brief Check if current data are valids and it may be saved.
            This function is called by validateAndSaveChanges to validate display fields.
    */
    virtual bool validate() = 0;

    /*!
      \brief It tries to save the current data.
    */
    virtual void save() = 0;

    /*!
      \brief Cancel the editions made at current data
    */
    virtual void discardChanges(bool restore_data) = 0;

    /*!
      \brief It calls the save method inside a try/catch block and check if there are any exception has found
    */
    virtual void validateAndSaveChanges();

    /*!
      \brief It asks to change tab, giving the index as parameter
    */
    virtual void askForChangeTab(const int& index);

    /*!
      \brief It checks if is active to lock tab
    */
    virtual bool isActive() const;

    /*!
      \brief It defines the tab state
    */
    virtual void setActive(bool state);

    /*!
      \brief It defines if there any modification in tab
    */
    virtual void setChanged(bool state);

    /*!
      \brief It sets the current selected data. It is used when one Item from WeatherTree has been clicked
    */
    virtual void setSelectedData(const QString selectedData);

    /*!
      \brief It displays a messagebox showing whether would like to remove
    */
    virtual bool removeDataSet(const terrama2::core::DataSet&);

    virtual void checkMask(const QString mask);

  public slots:

    /*!
      \brief Slot triggered on save button. It checks if there any change has made and then call "validateAndSaveChanges"
    */
    virtual void onSaveRequested();

    /*!
      \brief Slot triggered on cancel button to check if the user wish cancel and save.
    */
    virtual void onCancelRequested();

    /*!
      \brief Slot triggered on filter button in tabs to show filter dialog
    */
    virtual void onFilterClicked();

    /*!
      \brief Slot triggered on projection button in tabs to show projection dialog
    */
    virtual void onProjectionClicked();

    /*!
      \brief Slot triggered whenever any widget is changed
    */
    virtual void onSubTabEdited();

  protected:
    ConfigApp* app_;  //!< Main Window
    Ui::ConfigAppForm* ui_; //!< UI from ConfigApp
    QString selectedData_; //!< It defines if there any selected name before to update;
    bool active_; //!< It defines if the tab is active
    bool changed_; //!< it defines if there any field changed
};

#endif
