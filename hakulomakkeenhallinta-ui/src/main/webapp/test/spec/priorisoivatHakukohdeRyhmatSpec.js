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

  })
})()