(function () {
  describe('applicationSystemForm-page', function () {
    var page = ApplicationSystemFormPage();

    before(
      page.openPage
    )

    describe("hakulomake latautuu oikein", function() {
      it('Testihaku testipisteeseen löytyy lomakkeelta', function () {
        expect(page.applicationFormRowByName("Testihaku testipisteeseen").length).to.equal(1)
      })
    })

    describe("rajaavan hakukohderyhmän lisääminen", function() {
      it('Testihaku testipisteeseen rajaavan hakukohderyhmän lisäys', function () {
        var formRow = page.applicationFormRowByName("Testihaku testipisteeseen")
        page.openDropdown(formRow)
        page.selectNthFromDropdown(formRow, 1) // Lomakepohjan asetukset

        var settingsRow = []
        wait.until(function() {
          settingsRow = page.applicationFormSettingsRowByName("Rajaavat hakukohderyhmät")
          return settingsRow.length == 1
        })().then(function() {
          page.openRow(settingsRow)
          var limitingRow = []
          wait.until(function() {
            limitingRow = page.applicationFormSettingsRowByName("Vaasan yliopisto, maisterihaku, hallintotieteet")
            return limitingRow.length == 1
          })().then(function() {
            page.openDropdown(limitingRow)
            page.selectNthFromDropdown(formRow, 1) // Aseta rajaus
          })

        })

      })
    })
  })
})()