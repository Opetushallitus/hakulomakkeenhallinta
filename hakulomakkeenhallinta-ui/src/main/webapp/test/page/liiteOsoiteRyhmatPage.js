function LiiteosoiteRyhmatPage() {
  var applicationSystemFormPage = openPage("/app/index.html#/applicationSystemForm", visible)

  var api = {
    openPage: applicationSystemFormPage,

    openLiiteOsoiteRyhmat: function() {
      var row = domUtil.applicationRulesLiiteOsoiteRyhmat()
      domUtil.openDropdown(row)
    },

    openLiiteOsoiteRyhmaPopup: function() {
      var row = domUtil.applicationRulesLiiteOsoiteRyhmat()
      domUtil.openHakukohderyhmat(row)
      var subGroup = row.find('li.hh-hakukohde:visible')

      var deferred = Q.defer()
      wait.until(function () {
        return $(subGroup.get(0)).find(".dropdown.pull-right i").length > 0
      })().then(function () {
        util.clickElement($(subGroup.get(0)).find(".dropdown.pull-right i").get(0))
        deferred.resolve()
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