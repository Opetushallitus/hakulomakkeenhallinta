(function () {
  describe('applicationSystemFormConfigurations-priorisoivatHakukohdeRyhmat', function () {
    var page = PriorisoivatHakukohdeRyhmatPage()

    describe("priorisoivat hakukohderyhmät popup avautuu ja sulkeutuu", function() {
      before(page.openPriorisoivatHakukohderyhmatPopup)

      it('popupissa kaksi vaihtoehtoa', function() {
        var menuItems = domUtil.dropDownRows(domUtil.applicationRulesPriorisoivatHakukohderyhmat())
        expect(menuItems.length).to.equal(2)
      })
    })

    describe("rajaavat hakukohderyhmät avautuu ja popup avautuu ja sulkeutuu", function() {
      before(page.openPriorisoivatHakukohderyhmatRyhmaPopup)

      it('popupissa neljä vaihtoehtoa', function() {
        var menuItems = domUtil.dropDownRows(domUtil.applicationRulesPriorisoivatHakukohderyhmat().find('li.hh-hakukohde:visible').eq(4))
        expect(menuItems.length).to.equal(4)
      })
    })
  })
})()