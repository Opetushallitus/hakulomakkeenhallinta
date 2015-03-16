(function () {
  describe('applicationSystemFormConfigurations-liiteOsoiteRyhmat', function () {
    var page = LiiteosoiteRyhmatPage()

    describe("liiteosoiteryhmä popup avautuu ja sulkeutuu", function() {
      before(page.openLiiteOsoiteRyhmat)

      it('popupissa kaksi vaihtoehtoa', function() {
        var menuItems = domUtil.dropDownRows(domUtil.applicationRulesLiiteOsoiteRyhmat())
        expect(menuItems.length).to.equal(2)
      })
    })

    describe("rajaavat hakukohderyhmät avautuu ja popup avautuu ja sulkeutuu", function() {
      before(page.openLiiteOsoiteRyhmaPopup)

      it('popupissa kolme vaihtoehtoa', function() {
        var menuItems = domUtil.dropDownRows(domUtil.applicationRulesLiiteOsoiteRyhmat().find('li.hh-hakukohde:visible').eq(0))
        expect(menuItems.length).to.equal(3)
      })
    })
  })
})()