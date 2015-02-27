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
        openDropdown(formRow)
        selectNthFromDropdown(formRow, 1) // Lomakepohjan asetukset

        var settingsRow = []
        wait.until(function() {
          settingsRow = page.applicationFormSettingsRowByName("Rajaavat hakukohderyhmät")
          return settingsRow.length == 1
        })().then(function() {
          openDropdown(settingsRow)
          selectNthFromDropdown(settingsRow, 0) // Lisää ryhmä asetuksiin
        })

      })
    })

    function openDropdown(row) {
      row.find("i.hh-icon-menu").click()
    }

    function selectNthFromDropdown(row, nth) {
      row.find("li:nth(" + nth + ") a")[0].click()
    }
  })
})()