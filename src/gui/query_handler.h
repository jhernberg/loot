/*  LOOT

    A load order optimisation tool for Oblivion, Skyrim, Fallout 3 and
    Fallout: New Vegas.

    Copyright (C) 2014-2016    WrinklyNinja

    This file is part of LOOT.

    LOOT is free software: you can redistribute
    it and/or modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation, either version 3 of
    the License, or (at your option) any later version.

    LOOT is distributed in the hope that it will
    be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with LOOT.  If not, see
    <https://www.gnu.org/licenses/>.
    */

#ifndef LOOT_GUI_QUERY_HANDLER
#define LOOT_GUI_QUERY_HANDLER

#include <include/wrapper/cef_message_router.h>
#include <yaml-cpp/yaml.h>

#include "backend/app/loot_state.h"
#include "backend/plugin/plugin.h"
#include "backend/metadata/plugin_metadata.h"
#include "gui/editor_message.h"
#include "gui/query/query.h"

namespace loot {
class QueryHandler : public CefMessageRouterBrowserSide::Handler {
public:
  QueryHandler(LootState& lootState);

  // Called due to cefQuery execution in binding.html.
  virtual bool OnQuery(CefRefPtr<CefBrowser> browser,
                       CefRefPtr<CefFrame> frame,
                       int64 query_id,
                       const CefString& request,
                       bool persistent,
                       CefRefPtr<Callback> callback) OVERRIDE;

  virtual void OnQueryCanceled(CefRefPtr<CefBrowser> browser,
                               CefRefPtr<CefFrame> frame,
                               int64 query_id) OVERRIDE;
private:
  CefRefPtr<Query> createQuery(CefRefPtr<CefBrowser> browser,
                               CefRefPtr<CefFrame> frame,
                               const YAML::Node& request);

  bool IsCancelled(int64 queryId) const;

  LootState& lootState_;
  std::unordered_set<int64> cancelledQueryIds;
};
}

#endif
