(function () {
  describe('applicationSystemFormConfigurations-priorisoivatHakukohdeRyhmat', function () {
    var page = PriorisoivatHakukohdeRyhmatPage()
    before(
        page.openPage,
        domUtil.openKorkeakoulujenYhteishakuKevat2015LomakePohja
    )

    describe("priorisoivat hakukohderyhmät popup avautuu ja sulkeutuu", function() {
      before(page.openPriorisoivatHakukohderyhmatPopup)

      it('popupissa kaksi vaihtoehtoa', function() {
        var menuItems = domUtil.dropDownRows(domUtil.applicationRulesPriorisoivatHakukohderyhmat())
        expect(menuItems.length).to.equal(2)
      })

      describe("rajaavat hakukohderyhmät avautuu ja popup avautuu ja sulkeutuu", function() {
        before(page.openPriorisoivatHakukohderyhmatRyhmaPopup)

        it('popupissa neljä vaihtoehtoa', function() {
            var menuItems = domUtil.dropDownRows(domUtil.applicationRulesPriorisoivatHakukohderyhmat().find('li.hh-hakukohde:visible').eq(4))
            expect(menuItems.length).to.equal(4)
        })

        describe("priorisoiva hakukohderyhmä avautuu oikein", function() {
          before(page.openPriorisoivaRyhma1HhKehitys)

          it('ryhmässä neljä hakukohdetta', function() {
              var group = S('div[ryhmat=priorisointiRyhmat]').find('.hh-hakukohde').eq(4)
              expect(group.find("li.hh-hakukohde").length).to.equal(4)
          })

          it('kullekin hakukohteelle on poistonappi', function() {
              var group = S('div[ryhmat=priorisointiRyhmat]').find('.hh-hakukohde').eq(4)
              expect(group.find("li.hh-hakukohde a").length).to.equal(4)
          })
        })
      })
    })
  })
})()