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
      before(page.openAddRestrictionPopup())

      it('Testihaku testipisteeseen rajaavan hakukohderyhmän lisäys', function() {
        expect(S('h1.ng-binding:nth(1)').text().trim()).to.equal("Testihaku testipisteeseen")
      })
    })
  })
})()