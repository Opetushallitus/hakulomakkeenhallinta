function ApplicationSystemFormPage() {
  var applicationSystemFormPage = openPage("/app/index.html#/applicationSystemForm", visible)

  var api = {
    openPage: applicationSystemFormPage,

    applicationTestiHakuTestiKohteeseen: function() {
      return domUtil.applicationFormRows().eq(89)
    },

    openAddRestrictionPopup: function() {
      return function() {
        var testRow = api.applicationTestiHakuTestiKohteeseen()
        domUtil.openDropdown(testRow)
        domUtil.selectLomakePohjanAsetukset(testRow)

        var deferred = Q.defer()
        var settingsRow = []
        wait.until(function () {
          settingsRow = domUtil.applicationRulesRajaavatHakukohderyhmat()
          return settingsRow.length == 1
        })().then(function () {
          domUtil.openHakukohderyhmat(settingsRow)

          var limitingRow = []
          wait.until(function() {
            limitingRow = domUtil.applicationFormSettingsRowByName("Vaasan yliopisto, maisterihaku, hallintotieteet")
            return limitingRow.length == 1
          })().then(function() {
            domUtil.openDropdown(limitingRow)
            domUtil.selectAsetaRajaus(limitingRow)
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