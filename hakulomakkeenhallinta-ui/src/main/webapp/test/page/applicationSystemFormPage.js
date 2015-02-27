function ApplicationSystemFormPage() {
  var applicationSystemFormPage = openPage("/app/index.html#/applicationSystemForm", visible)

  var api = {
    openPage: applicationSystemFormPage,

    applicationFormRowByName: function(name) {
      return $(_.find(S("td.ng-binding"), function(e) { return $(e).text() == name })).parent()
    },

    applicationFormSettingsRowByName: function(name) {
      return $(_.find(S("a.ng-binding"), function(e) { console.log($(e).text().trim()); return $(e).text().trim() == name })).parent().parent()
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
