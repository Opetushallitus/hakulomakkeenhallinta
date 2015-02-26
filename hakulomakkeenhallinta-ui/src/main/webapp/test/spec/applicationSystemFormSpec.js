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
  })
})()