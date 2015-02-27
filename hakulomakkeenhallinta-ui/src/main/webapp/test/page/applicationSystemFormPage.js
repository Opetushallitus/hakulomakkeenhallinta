function ApplicationSystemFormPage() {
  var applicationSystemFormPage = openPage("/app/index.html#/applicationSystemForm", visible)

  var api = {
    openPage: applicationSystemFormPage,

    applicationFormRowByName: function(name) {
      return $(_.find(S("td.ng-binding"), function(e) { return $(e).text() == name })).parent()
    },

    applicationFormSettingsRowByName: function(name) {
      return $(_.find(S("a.ng-binding"), function(e) { return $(e).text().trim() == name })).parent().parent()
    },

    openDropdown: function(row) { row.find("i.hh-icon-menu").click() },

    openRow: function(row) { row.find(".hh-list-h3 > i").click() },

    selectNthFromDropdown: function(row, nth) { row.find("li:nth(" + nth + ") a")[0].click() },

    openAddRestrictionPopup: function() {
      return function() {
        var deferred = Q.defer()
        var formRow = api.applicationFormRowByName("Testihaku testipisteeseen")
        api.openDropdown(formRow)
        api.selectNthFromDropdown(formRow, 1) // Lomakepohjan asetukset

        var settingsRow = []
        wait.until(function() {
          settingsRow = api.applicationFormSettingsRowByName("Rajaavat hakukohderyhmät")
          return settingsRow.length == 1
        })().then(function() {
          api.openRow(settingsRow)
          var limitingRow = []
          wait.until(function() {
            limitingRow = api.applicationFormSettingsRowByName("Vaasan yliopisto, maisterihaku, hallintotieteet")
            return limitingRow.length == 1
          })().then(function() {
            api.openDropdown(limitingRow)
            api.selectNthFromDropdown(limitingRow, 0) // Aseta rajaus
            wait.until(function() {
              return S('h1.ng-binding').toArray().length > 1
            })().then(function() {
              deferred.resolve()
            })
          })
        })
        return deferred.promise
      }
  },

  loaded: function() {
      return S("td.ng-binding").toArray().length > 0
    }
  }
  return api

  function visible() {
    return api.loaded()
  }
}
