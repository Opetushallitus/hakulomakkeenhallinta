/*
 * Copyright (c) 2013 The Finnish Board of Education - Opetushallitus
 *
 * This program is free software:  Licensed under the EUPL, Version 1.1 or - as
 * soon as they will be approved by the European Commission - subsequent versions
 * of the EUPL (the "Licence");
 *
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at: http://www.osor.eu/eupl/
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * European Union Public Licence for more details.
 */

package fi.vm.sade.hakulomakkeenhallinta.template.builder.phase;

import fi.vm.sade.hakulomakkeenhallinta.domain.Phase;
import fi.vm.sade.hakulomakkeenhallinta.domain.Theme;
import fi.vm.sade.hakulomakkeenhallinta.template.builder.util.TemplateUtil;
import org.springframework.stereotype.Service;

/**
 * @author Mikko Majapuro
 */
@Service
public class KoulutustaustaPhaseTemplateGenerator {

    public Phase create() {
        Phase phase = new Phase("koulutustausta", TemplateUtil.createI18NForm("form.koulutustausta.otsikko"));
        Theme koulutustaustaRyhma = new Theme("koulutustaustaGrp", TemplateUtil.createI18NForm("form.koulutustausta.otsikko"));
        koulutustaustaRyhma.setHelp(TemplateUtil.createI18NForm("form.koulutustausta.help"));
        phase.getChildren().add(koulutustaustaRyhma);
        return phase;
    }

    //public Radio createKoulutustaustaRadio() {
        //TODO! koodisto integration
        /*List<Code> baseEducationCodes = koodistoService.getCodes("pohjakoulutustoinenaste", 1);

        Map<String, Code> educationMap = Maps.uniqueIndex(baseEducationCodes, new Function<Code, String>() {
            @Override
            public String apply(fi.vm.sade.oppija.common.koodisto.domain.Code code) {
                return code.getValue(); //NOSONAR
            }
        });*/
        /*
        Radio millatutkinnolla = new Radio(TemplateUtil.ELEMENT_ID_BASE_EDUCATION,
                TemplateUtil.createI18NForm("form.koulutustausta.millaTutkinnolla"), "TemplateUtil.ELEMENT_ID_BASE_EDUCATION");
        millatutkinnolla.addOption(createI18NForm("form.koulutustausta.peruskoulu"),
                educationMap.get(PERUSKOULU).getValue(),
                createI18NForm("form.koulutustausta.peruskoulu.help"));
        millatutkinnolla
                .addOption(createI18NForm("form.koulutustausta.osittainYksilollistetty"),
                        educationMap.get(OSITTAIN_YKSILOLLISTETTY).getValue(),
                        createI18NForm("form.koulutustausta.osittainYksilollistetty.help"));
        millatutkinnolla
                .addOption(
                        createI18NForm("form.koulutustausta.erityisopetuksenYksilollistetty"),
                        ERITYISOPETUKSEN_YKSILOLLISTETTY,
                        createI18NForm("form.koulutustausta.erityisopetuksenYksilollistetty.help"));
        millatutkinnolla
                .addOption(
                        createI18NForm("form.koulutustausta.yksilollistetty"),
                        educationMap.get(YKSILOLLISTETTY).getValue(),
                        createI18NForm("form.koulutustausta.yksilollistetty.help"));
        millatutkinnolla.addOption(createI18NForm("form.koulutustausta.keskeytynyt"),
                educationMap.get(KESKEYTYNYT).getValue(),
                createI18NForm("form.koulutustausta.keskeytynyt"));
        millatutkinnolla
                .addOption(
                        createI18NForm("form.koulutustausta.lukio"),
                        educationMap.get(YLIOPPILAS).getValue(),
                        createI18NForm("form.koulutustausta.lukio.help"));
        millatutkinnolla.addOption(createI18NForm("form.koulutustausta.ulkomailla"),
                educationMap.get(ULKOMAINEN_TUTKINTO).getValue(),
                createI18NForm("form.koulutustausta.ulkomailla.help"));
        ElementUtil.setVerboseHelp(millatutkinnolla, "form.koulutustausta.millaTutkinnolla.verboseHelp");
        addRequiredValidator(millatutkinnolla);

        Notification tutkintoUlkomaillaNotification = new Notification(TUTKINTO_ULKOMAILLA_NOTIFICATION_ID,
                createI18NForm("form.koulutustausta.ulkomailla.huom"),
                Notification.NotificationType.INFO);

        Notification tutkintoKeskeytynytNotification = new Notification(TUTKINTO_KESKEYTNYT_NOTIFICATION_ID,
                createI18NForm("form.koulutustausta.keskeytynyt.huom"),
                Notification.NotificationType.INFO);

        RelatedQuestionRule keskeytynytRule = new RelatedQuestionRule(TUTKINTO_KESKEYTYNYT_RULE,
                millatutkinnolla.getId(), KESKEYTYNYT, false);

        RelatedQuestionRule ulkomaillaSuoritettuTutkintoRule = new RelatedQuestionRule(TUTKINTO_ULKOMAILLA_RULE,
                millatutkinnolla.getId(), ULKOMAINEN_TUTKINTO, false);

        ulkomaillaSuoritettuTutkintoRule.addChild(tutkintoUlkomaillaNotification);
        keskeytynytRule.addChild(tutkintoKeskeytynytNotification);
        millatutkinnolla.addChild(ulkomaillaSuoritettuTutkintoRule);
        millatutkinnolla.addChild(keskeytynytRule);

        TextQuestion paattotodistusvuosiPeruskoulu = new TextQuestion("PK_PAATTOTODISTUSVUOSI",
                createI18NForm("form.koulutustausta.paattotodistusvuosi"));
        paattotodistusvuosiPeruskoulu.addAttribute("placeholder", "vvvv");
        addRequiredValidator(paattotodistusvuosiPeruskoulu);
        paattotodistusvuosiPeruskoulu.setValidator(
                createRegexValidator(paattotodistusvuosiPeruskoulu.getId(), PAATTOTODISTUSVUOSI_PATTERN));
        paattotodistusvuosiPeruskoulu.addAttribute("size", "4");
        paattotodistusvuosiPeruskoulu.addAttribute("maxlength", "4");

        TitledGroup suorittanutGroup = new TitledGroup("suorittanutgroup",
                createI18NForm("form.koulutustausta.suorittanut"));
        suorittanutGroup.addChild(
                new CheckBox("LISAKOULUTUS_KYMPPI", createI18NForm("form.koulutustausta.kymppiluokka")),
                new CheckBox("LISAKOULUTUS_VAMMAISTEN", createI18NForm("form.koulutustausta.vammaistenValmentava")),
                new CheckBox("LISAKOULUTUS_TALOUS", createI18NForm("form.koulutustausta.talouskoulu")),
                new CheckBox("LISAKOULUTUS_AMMATTISTARTTI", createI18NForm("form.koulutustausta.ammattistartti")),
                new CheckBox("LISAKOULUTUS_KANSANOPISTO", createI18NForm("form.koulutustausta.kansanopisto")),
                new CheckBox("LISAKOULUTUS_MAAHANMUUTTO", createI18NForm("form.koulutustausta.maahanmuuttajienValmistava"))
        );

        RelatedQuestionRule pkKysymyksetRule = new RelatedQuestionRule("rule3", millatutkinnolla.getId(), "("
                + PERUSKOULU + "|"
                + OSITTAIN_YKSILOLLISTETTY + "|"
                + ERITYISOPETUKSEN_YKSILOLLISTETTY + "|"
                + YKSILOLLISTETTY + ")", false);

        RelatedQuestionRule paattotodistusvuosiPeruskouluRule = new RelatedQuestionRule("rule8",
                paattotodistusvuosiPeruskoulu.getId(), "^(19[0-9][0-9]|200[0-9]|201[0-1])$", false);

        Radio koulutuspaikkaAmmatillisenTutkintoon = new Radio(
                "KOULUTUSPAIKKA_AMMATILLISEEN_TUTKINTOON",
                createI18NForm("form.koulutustausta.ammatillinenKoulutuspaikka"));
        addYesAndIDontOptions(koulutuspaikkaAmmatillisenTutkintoon);
        addRequiredValidator(koulutuspaikkaAmmatillisenTutkintoon);

        pkKysymyksetRule.addChild(paattotodistusvuosiPeruskoulu);
        pkKysymyksetRule.addChild(suorittanutGroup);
        pkKysymyksetRule.addChild(koulutuspaikkaAmmatillisenTutkintoon);
        pkKysymyksetRule.addChild(paattotodistusvuosiPeruskouluRule);

        TextQuestion lukioPaattotodistusVuosi = new TextQuestion("lukioPaattotodistusVuosi",
                createI18NForm("form.koulutustausta.lukio.paattotodistusvuosi"));
        lukioPaattotodistusVuosi.addAttribute("placeholder", "vvvv");
        addRequiredValidator(lukioPaattotodistusVuosi);
        lukioPaattotodistusVuosi.setValidator(createRegexValidator(lukioPaattotodistusVuosi.getId(), PAATTOTODISTUSVUOSI_PATTERN));
        lukioPaattotodistusVuosi.addAttribute("size", "4");
        lukioPaattotodistusVuosi.addAttribute("maxlength", "4");
        lukioPaattotodistusVuosi.setInline(true);

        DropdownSelect ylioppilastutkinto = new DropdownSelect("ylioppilastutkinto",
                createI18NForm("form.koulutustausta.lukio.yotutkinto"), null);
        ylioppilastutkinto.addOption(createI18NForm("form.koulutustausta.lukio.yotutkinto.fi"), "fi");
        ylioppilastutkinto.addOption(createI18NForm("form.koulutustausta.lukio.yotutkinto.ib"), "ib");
        ylioppilastutkinto.addOption(createI18NForm("form.koulutustausta.lukio.yotutkinto.eb"), "eb");
        ylioppilastutkinto.addOption(createI18NForm("form.koulutustausta.lukio.yotutkinto.rp"), "rp");
        addRequiredValidator(ylioppilastutkinto);
        ylioppilastutkinto.setInline(true);
        setDefaultOption("fi", ylioppilastutkinto.getOptions());

        TitledGroup lukioGroup = new TitledGroup("lukioGroup", createI18NForm("form.koulutustausta.lukio.suoritus"));
        lukioGroup.addChild(lukioPaattotodistusVuosi);
        lukioGroup.addChild(ylioppilastutkinto);

        RelatedQuestionRule lukioRule = new RelatedQuestionRule("rule7", millatutkinnolla.getId(), YLIOPPILAS, false);
        lukioRule.addChild(lukioGroup);

        millatutkinnolla.addChild(lukioRule);
        millatutkinnolla.addChild(pkKysymyksetRule);

        Radio suorittanutAmmatillisenTutkinnon = new Radio(
                "ammatillinenTutkintoSuoritettu",
                createI18NForm("form.koulutustausta.ammatillinenSuoritettu"));
        addYesAndIDontOptions(suorittanutAmmatillisenTutkinnon);
        addRequiredValidator(suorittanutAmmatillisenTutkinnon);

        lukioRule.addChild(suorittanutAmmatillisenTutkinnon);
        paattotodistusvuosiPeruskouluRule.addChild(suorittanutAmmatillisenTutkinnon);

        RelatedQuestionRule suorittanutTutkinnonRule = new RelatedQuestionRule(ElementUtil.randomId(),
                suorittanutAmmatillisenTutkinnon.getId(), "^true", false);
        Notification warning = new Notification(
                ElementUtil.randomId(),
                createI18NForm("form.koulutustausta.ammatillinenSuoritettu.huom"),
                Notification.NotificationType.WARNING);
        suorittanutTutkinnonRule.addChild(warning);
        warning.setValidator(new AlwaysFailsValidator(warning.getId(), createI18NTextError("form.koulutustausta.ammatillinenSuoritettu.huom")));

        suorittanutAmmatillisenTutkinnon.addChild(suorittanutTutkinnonRule);

        DropdownSelect perusopetuksenKieli = new DropdownSelect("perusopetuksen_kieli",
                createI18NForm("form.koulutustausta.perusopetuksenKieli"), null);
        perusopetuksenKieli.addOption(ElementUtil.createI18NAsIs(""), "");
        perusopetuksenKieli.addOptions(koodistoService.getLanguages());
        addRequiredValidator(perusopetuksenKieli);
        setVerboseHelp(perusopetuksenKieli, "form.koulutustausta.perusopetuksenKieli.verboseHelp");
        pkKysymyksetRule.addChild(perusopetuksenKieli);

        DropdownSelect lukionKieli = new DropdownSelect("lukion_kieli",
                createI18NForm("form.koulutustausta.lukionKieli"), null);
        lukionKieli.addOption(ElementUtil.createI18NAsIs(""), "");
        lukionKieli.addOptions(koodistoService.getLanguages());
        addRequiredValidator(lukionKieli);
        setVerboseHelp(lukionKieli, "form.koulutustausta.lukionKieli.verboseHelp");
        lukioRule.addChild(lukionKieli);

        return millatutkinnolla;
    }                               */
}
