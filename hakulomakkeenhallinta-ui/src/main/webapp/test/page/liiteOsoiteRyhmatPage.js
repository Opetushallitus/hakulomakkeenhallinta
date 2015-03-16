function LiiteosoiteRyhmatPage() {
  var applicationSystemFormPage = openPage("/app/index.html#/applicationSystemForm", visible)

  var api = {
    openPage: applicationSystemFormPage,

    openLiiteOsoiteRyhmat: function() {
      var row = domUtil.applicationRulesLiiteOsoiteRyhmat()
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