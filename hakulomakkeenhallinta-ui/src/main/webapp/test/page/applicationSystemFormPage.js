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
        wait.until(function () {
          return domUtil.applicationRulesRajaavatHakukohderyhmat().length == 1
        })().then(function () {
          domUtil.openHakukohderyhmat(domUtil.applicationRulesRajaavatHakukohderyhmat())
          wait.until(function() {
            return domUtil.applicationFormSettingsRowByName("Vaasan yliopisto, maisterihaku, hallintotieteet").length == 1
          })().then(function() {
            wait.until(function () {
              return domUtil.applicationFormSettingsRowByName("Vaasan yliopisto, maisterihaku, hallintotieteet").find(".hh-icon-menu").length > 0
            })().then(function() {
              var limitingRow = domUtil.applicationFormSettingsRowByName("Vaasan yliopisto, maisterihaku, hallintotieteet")
              domUtil.openDropdown(limitingRow)
              domUtil.selectAsetaRajaus(limitingRow)
              wait.until(function () {
                return S('h1.ng-binding').toArray().length > 1
              })().then(function () {
                deferred.resolve()
              })
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