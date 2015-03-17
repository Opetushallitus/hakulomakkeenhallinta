function RajaavatHakukohdeRyhmatBackend() {
  var applicationSystemFormPage = openPage("/app/index.html#/applicationSystemForm", visible)

  var api = {
    openPage: applicationSystemFormPage,

    openAddRestrictionPopup: function() {
      var deferred = Q.defer()
      wait.until(function () {
        return domUtil.applicationRulesRajaavatHakukohderyhmat().length == 1
      })().then(function () {
        domUtil.openHakukohderyhmat(domUtil.applicationRulesRajaavatHakukohderyhmat())
        wait.until(function() {
          return domUtil.applicationFormSettingsRowByName("Jyrin rajaava ryhmä").length == 1
        })().then(function() {
          wait.until(function () {
            return domUtil.applicationFormSettingsRowByName("Jyrin rajaava ryhmä").find(".hh-icon-menu").length > 0
          })().then(function() {
            var limitingRow = domUtil.applicationFormSettingsRowByName("Jyrin rajaava ryhmä")
            domUtil.openDropdown(limitingRow)
            domUtil.selectAsetaRajaus(limitingRow)
            wait.until(function () {
              return S('h1.ng-binding').toArray().length > 1
            })().then(function () {
              S('button.btn-primary:visible').click()
              wait.until(function () {
                return S('.alert-error').length == 1
              })().then(function () {
                deferred.resolve()
              })
            })
          })
        })
      })
      return deferred.promise
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