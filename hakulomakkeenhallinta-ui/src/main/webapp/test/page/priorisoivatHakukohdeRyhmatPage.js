function PriorisoivatHakukohdeRyhmatPage() {
  var applicationSystemFormPage = openPage("/app/index.html#/applicationSystemForm", visible)

  var api = {
    openPage: applicationSystemFormPage,

    openPriorisoivatHakukohderyhmatPopup: function() {
      var row = domUtil.applicationRulesPriorisoivatHakukohderyhmat()
      domUtil.openDropdown(row)
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