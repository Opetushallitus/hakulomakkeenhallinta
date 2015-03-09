function ApplicationSystemFormPage() {
  var applicationSystemFormPage = openPage("/app/index.html#/applicationSystemForm", visible)

  var api = {
    openPage: applicationSystemFormPage,

    applicationFormRows: function() {
      return S("table tr")
    },

    applicationTestiHakuTestiKohteeseen: function() {
      return api.applicationFormRows().eq(89)
    },

    openDropdown: function(row) {
      util.clickElement(row.find(".hh-icon-menu").get(0))
    },

    selectLomakePohjanAsetukset: function(row) {
      util.clickElement(row.find("li:nth(1) a").get(0))
    },

    applicationRulesRajaavatHakukohderyhmat: function() {
      return api.applicationFormSettingsRowByName("Rajaavat hakukohderyhmät")
    },

    openRajaavatHakukohderyhmat: function(row) {
      util.clickElement(row.find(".hh-list-h3 > i").get(0))
    },

    applicationFormRowByName: function(name) {
      return $(_.find(S("td.ng-binding"), function(e) { return $(e).text() == name })).parent()
    },

    applicationFormSettingsRowByName: function(name) {
      return $(_.find(S("a.ng-binding"), function(e) { return $(e).text().trim() == name })).parent().parent()
    },

    selectAsetaRajaus: function(row) {
      util.clickElement(row.find("li:nth(0) a").get(0))
    },

    openAddRestrictionPopup: function() {
      return function() {
        var testRow = api.applicationTestiHakuTestiKohteeseen()
        api.openDropdown(testRow)
        api.selectLomakePohjanAsetukset(testRow)

        var deferred = Q.defer()
        var settingsRow = []
        wait.until(function () {
          settingsRow = api.applicationRulesRajaavatHakukohderyhmat()
          return settingsRow.length == 1
        })().then(function () {
          api.openRajaavatHakukohderyhmat(settingsRow)

          var limitingRow = []
          wait.until(function() {
            limitingRow = api.applicationFormSettingsRowByName("Vaasan yliopisto, maisterihaku, hallintotieteet")
            return limitingRow.length == 1
          })().then(function() {
            api.openDropdown(limitingRow)
            api.selectAsetaRajaus(limitingRow)
            wait.until(function() {
              return S('h1.ng-binding').toArray().length > 1
            })().then(function() {
              takeScreenshot()
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