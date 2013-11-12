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

import com.google.common.base.Function;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import fi.vm.sade.hakulomakkeenhallinta.domain.*;
import fi.vm.sade.hakulomakkeenhallinta.domain.rule.RelatedQuestionRule;
import fi.vm.sade.hakulomakkeenhallinta.domain.validator.RegexFieldValidator;
import fi.vm.sade.hakulomakkeenhallinta.domain.validator.RequiredFieldValidator;
import fi.vm.sade.hakulomakkeenhallinta.service.KoodistoService;
import fi.vm.sade.hakulomakkeenhallinta.template.builder.util.TemplateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * @author Mikko Majapuro
 */
@Service
public class KoulutustaustaPhaseTemplateGenerator {

    private static final String PERUSKOULU = "1";
    private static final String YLIOPPILAS = "9";
    private static final String OSITTAIN_YKSILOLLISTETTY = "2";
    private static final String ERITYISOPETUKSEN_YKSILOLLISTETTY = "3";
    private static final String YKSILOLLISTETTY = "6";
    private static final String KESKEYTYNYT = "7";
    private static final String ULKOMAINEN_TUTKINTO = "0";
    private static final String PAATTOTODISTUSVUOSI_PATTERN = "^(19[0-9][0-9]|200[0-9]|201[0-3])$";

    private KoodistoService koodistoService;

    @Autowired
    public KoulutustaustaPhaseTemplateGenerator(KoodistoService koodistoService) {
        this.koodistoService = koodistoService;
    }


    public Phase create() {
        Phase phase = new Phase("koulutustausta", TemplateUtil.createI18NForm("form.koulutustausta.otsikko"));
        Theme koulutustaustaRyhma = new Theme("koulutustaustaGrp", TemplateUtil.createI18NForm("form.koulutustausta.otsikko"));
        koulutustaustaRyhma.setHelp(TemplateUtil.createI18NForm("form.koulutustausta.help"));
        koulutustaustaRyhma.getChildren().add(createKoulutustaustaRadio());
        phase.getChildren().add(koulutustaustaRyhma);
        return phase;
    }

    public Radio createKoulutustaustaRadio() {
        Radio millatutkinnolla = new Radio(TemplateUtil.ELEMENT_ID_BASE_EDUCATION,
                TemplateUtil.createI18NForm("form.koulutustausta.millaTutkinnolla"), TemplateUtil.ELEMENT_ID_BASE_EDUCATION);
        addOptionsToMillatutkinnollaQuestion(millatutkinnolla);

        millatutkinnolla.setVerboseHelp(TemplateUtil.createI18NText("form.koulutustausta.millaTutkinnolla.verboseHelp", "form_verboseHelp"));
        millatutkinnolla.getValidators().add(new RequiredFieldValidator(millatutkinnolla.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));

        Notification tutkintoUlkomaillaNotification = new Notification("tutkinto7-notification",
                TemplateUtil.createI18NForm("form.koulutustausta.ulkomailla.huom"),
                Notification.NotificationType.INFO);

        Notification tutkintoKeskeytynytNotification = new Notification("tutkinto5-notification",
                TemplateUtil.createI18NForm("form.koulutustausta.keskeytynyt.huom"),
                Notification.NotificationType.INFO);

        RelatedQuestionRule keskeytynytRule = new RelatedQuestionRule("tutkinto_7_rule");
        keskeytynytRule.getRelatedElementId().add(millatutkinnolla.getId());
        keskeytynytRule.setExpression(KESKEYTYNYT);
        keskeytynytRule.setShowImmediately(false);

        RelatedQuestionRule ulkomaillaSuoritettuTutkintoRule = new RelatedQuestionRule("tutkinto_0_rule");
        ulkomaillaSuoritettuTutkintoRule.getRelatedElementId().add(millatutkinnolla.getId());
        ulkomaillaSuoritettuTutkintoRule.setExpression(ULKOMAINEN_TUTKINTO);
        ulkomaillaSuoritettuTutkintoRule.setShowImmediately(false);

        ulkomaillaSuoritettuTutkintoRule.getChildren().add(tutkintoUlkomaillaNotification);
        keskeytynytRule.getChildren().add(tutkintoKeskeytynytNotification);
        millatutkinnolla.getChildren().add(ulkomaillaSuoritettuTutkintoRule);
        millatutkinnolla.getChildren().add(keskeytynytRule);

        TextQuestion paattotodistusvuosiPeruskoulu = paattotodistusPeruskoulu();
        TitledGroup suorittanutGroup = suorittanutGroup();

        RelatedQuestionRule pkKysymyksetRule = new RelatedQuestionRule("rule3");
        pkKysymyksetRule.getRelatedElementId().add(millatutkinnolla.getId());
        pkKysymyksetRule.setExpression("(" + PERUSKOULU + "|" + OSITTAIN_YKSILOLLISTETTY + "|"
                + ERITYISOPETUKSEN_YKSILOLLISTETTY + "|" + YKSILOLLISTETTY + ")");
        pkKysymyksetRule.setShowImmediately(false);

        RelatedQuestionRule paattotodistusvuosiPeruskouluRule = new RelatedQuestionRule("rule8");
        paattotodistusvuosiPeruskouluRule.getRelatedElementId().add(paattotodistusvuosiPeruskoulu.getId());
        paattotodistusvuosiPeruskouluRule.setExpression("^(19[0-9][0-9]|200[0-9]|201[0-1])$");
        paattotodistusvuosiPeruskouluRule.setShowImmediately(false);

        Radio koulutuspaikkaAmmatillisenTutkintoon = koulutuspaikkaAmmatilliseenTutkintoon();

        pkKysymyksetRule.getChildren().add(paattotodistusvuosiPeruskoulu);
        pkKysymyksetRule.getChildren().add(suorittanutGroup);
        pkKysymyksetRule.getChildren().add(koulutuspaikkaAmmatillisenTutkintoon);
        pkKysymyksetRule.getChildren().add(paattotodistusvuosiPeruskouluRule);

        TextQuestion lukioPaattotodistusVuosi = luokionPaattotodistusVuosi();
        DropdownSelect ylioppilastutkinto = ylioppilastutkinto();

        TitledGroup lukioGroup = new TitledGroup("lukioGroup", TemplateUtil.createI18NForm("form.koulutustausta.lukio.suoritus"));
        lukioGroup.getChildren().add(lukioPaattotodistusVuosi);
        lukioGroup.getChildren().add(ylioppilastutkinto);

        RelatedQuestionRule lukioRule = new RelatedQuestionRule("rule7");
        lukioRule.getRelatedElementId().add(millatutkinnolla.getId());
        lukioRule.setExpression(YLIOPPILAS);
        lukioRule.setShowImmediately(false);
        lukioRule.getChildren().add(lukioGroup);

        millatutkinnolla.getChildren().add(lukioRule);
        millatutkinnolla.getChildren().add(pkKysymyksetRule);
        /*
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
                               */
        return millatutkinnolla;
    }

    private void addOptionsToMillatutkinnollaQuestion(final Radio millatutkinnolla) {
        List<Code> baseEducationCodes = koodistoService.searchCodesByKoodisto("pohjakoulutustoinenaste", 1);

        Map<String, Code> educationMap = Maps.uniqueIndex(baseEducationCodes, new Function<Code, String>() {
            @Override
            public String apply(Code code) {
                return code.getValue(); //NOSONAR
            }
        });

        Option optPeruskoulu = new Option(TemplateUtil.createI18NForm("form.koulutustausta.peruskoulu"),
                educationMap.get(PERUSKOULU).getValue());
        optPeruskoulu.setHelp(TemplateUtil.createI18NForm("form.koulutustausta.peruskoulu.help"));
        millatutkinnolla.setOptions(Lists.newArrayList(optPeruskoulu));

        Option optOsittainYksilollistetty = new Option(TemplateUtil.createI18NForm("form.koulutustausta.osittainYksilollistetty"),
                educationMap.get(OSITTAIN_YKSILOLLISTETTY).getValue());
        optOsittainYksilollistetty.setHelp(TemplateUtil.createI18NForm("form.koulutustausta.osittainYksilollistetty.help"));
        millatutkinnolla.getOptions().add(optOsittainYksilollistetty);

        Option optErityisopetuksenYksilollistetty = new Option(TemplateUtil.createI18NForm("form.koulutustausta.erityisopetuksenYksilollistetty"),
                educationMap.get(ERITYISOPETUKSEN_YKSILOLLISTETTY).getValue());
        optErityisopetuksenYksilollistetty.setHelp(TemplateUtil.createI18NForm("form.koulutustausta.erityisopetuksenYksilollistetty.help"));
        millatutkinnolla.getOptions().add(optErityisopetuksenYksilollistetty);

        Option optYksilollistetty = new Option(TemplateUtil.createI18NForm("form.koulutustausta.yksilollistetty"),
                educationMap.get(YKSILOLLISTETTY).getValue());
        optYksilollistetty.setHelp(TemplateUtil.createI18NForm("form.koulutustausta.yksilollistetty.help"));
        millatutkinnolla.getOptions().add(optYksilollistetty);

        Option optKeskeytynyt = new Option(TemplateUtil.createI18NForm("form.koulutustausta.keskeytynyt"),
                educationMap.get(KESKEYTYNYT).getValue());
        optKeskeytynyt.setHelp(TemplateUtil.createI18NForm("form.koulutustausta.keskeytynyt.help"));
        millatutkinnolla.getOptions().add(optKeskeytynyt);

        Option optYlioppilas = new Option(TemplateUtil.createI18NForm("form.koulutustausta.lukio"),
                educationMap.get(YLIOPPILAS).getValue());
        optYlioppilas.setHelp(TemplateUtil.createI18NForm("form.koulutustausta.lukio.help"));
        millatutkinnolla.getOptions().add(optYlioppilas);

        Option optUlkomainenTutkinto = new Option(TemplateUtil.createI18NForm("form.koulutustausta.ulkomailla"),
                educationMap.get(ULKOMAINEN_TUTKINTO).getValue());
        optUlkomainenTutkinto.setHelp(TemplateUtil.createI18NForm("form.koulutustausta.ulkomailla.help"));
        millatutkinnolla.getOptions().add(optUlkomainenTutkinto);
    }

    private TextQuestion paattotodistusPeruskoulu() {
        TextQuestion paattotodistusvuosiPeruskoulu = new TextQuestion("PK_PAATTOTODISTUSVUOSI",
                TemplateUtil.createI18NForm("form.koulutustausta.paattotodistusvuosi"), "PK_PAATTOTODISTUSVUOSI", 4);
        paattotodistusvuosiPeruskoulu.getValidators().add(new RequiredFieldValidator(paattotodistusvuosiPeruskoulu.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        paattotodistusvuosiPeruskoulu.getValidators().add(new RegexFieldValidator(paattotodistusvuosiPeruskoulu.getName(),
                TemplateUtil.createI18NTextError("yleinen.virheellinenArvo"),
                PAATTOTODISTUSVUOSI_PATTERN));
        paattotodistusvuosiPeruskoulu.setPlaceHolder("vvvv");
        return paattotodistusvuosiPeruskoulu;
    }

    private TitledGroup suorittanutGroup() {
        TitledGroup suorittanutGroup = new TitledGroup("suorittanutgroup",
                TemplateUtil.createI18NForm("form.koulutustausta.suorittanut"));
        suorittanutGroup.getChildren().add(new CheckBox("LISAKOULUTUS_KYMPPI", TemplateUtil.createI18NForm("form.koulutustausta.kymppiluokka"),
                "LISAKOULUTUS_KYMPPI"));
        suorittanutGroup.getChildren().add(new CheckBox("LISAKOULUTUS_VAMMAISTEN", TemplateUtil.createI18NForm("form.koulutustausta.vammaistenValmentava"),
                "LISAKOULUTUS_VAMMAISTEN"));
        suorittanutGroup.getChildren().add(new CheckBox("LISAKOULUTUS_TALOUS", TemplateUtil.createI18NForm("form.koulutustausta.talouskoulu"),
                "LISAKOULUTUS_TALOUS"));
        suorittanutGroup.getChildren().add(new CheckBox("LISAKOULUTUS_AMMATTISTARTTI", TemplateUtil.createI18NForm("form.koulutustausta.ammattistartti"),
                "LISAKOULUTUS_AMMATTISTARTTI"));
        suorittanutGroup.getChildren().add(new CheckBox("LISAKOULUTUS_KANSANOPISTO", TemplateUtil.createI18NForm("form.koulutustausta.kansanopisto"),
                "LISAKOULUTUS_KANSANOPISTO"));
        suorittanutGroup.getChildren().add(new CheckBox("LISAKOULUTUS_MAAHANMUUTTO", TemplateUtil.createI18NForm("form.koulutustausta.maahanmuuttajienValmistava"),
                "LISAKOULUTUS_MAAHANMUUTTO"));
        return suorittanutGroup;
    }

    private Radio koulutuspaikkaAmmatilliseenTutkintoon() {
        Radio koulutuspaikkaAmmatillisenTutkintoon = new Radio("KOULUTUSPAIKKA_AMMATILLISEEN_TUTKINTOON",
                TemplateUtil.createI18NForm("form.koulutustausta.ammatillinenKoulutuspaikka"),
                "KOULUTUSPAIKKA_AMMATILLISEEN_TUTKINTOON");
        koulutuspaikkaAmmatillisenTutkintoon.getOptions().add(new Option(TemplateUtil.createI18NForm("form.yleinen.kylla"),
                TemplateUtil.KYLLA));
        koulutuspaikkaAmmatillisenTutkintoon.getOptions().add(new Option(TemplateUtil.createI18NForm("form.yleinen.en"),
                TemplateUtil.EI));
        koulutuspaikkaAmmatillisenTutkintoon.getValidators().add(new RequiredFieldValidator(koulutuspaikkaAmmatillisenTutkintoon.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        return koulutuspaikkaAmmatillisenTutkintoon;
    }

    private TextQuestion luokionPaattotodistusVuosi() {
        TextQuestion lukioPaattotodistusVuosi = new TextQuestion("lukioPaattotodistusVuosi",
                TemplateUtil.createI18NForm("form.koulutustausta.lukio.paattotodistusvuosi"), "lukioPaattotodistusVuosi", 4);
        lukioPaattotodistusVuosi.setPlaceHolder("vvvv");
        lukioPaattotodistusVuosi.getValidators().add(new RequiredFieldValidator(lukioPaattotodistusVuosi.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        lukioPaattotodistusVuosi.getValidators().add(new RegexFieldValidator(lukioPaattotodistusVuosi.getName(),
                TemplateUtil.createI18NTextError("yleinen.virheellinenArvo"),
                PAATTOTODISTUSVUOSI_PATTERN));
        return lukioPaattotodistusVuosi;
    }

    private DropdownSelect ylioppilastutkinto() {
        DropdownSelect ylioppilastutkinto = new DropdownSelect("ylioppilastutkinto",
                TemplateUtil.createI18NForm("form.koulutustausta.lukio.yotutkinto"), "ylioppilastutkinto");
        Option optFi = new Option(TemplateUtil.createI18NForm("form.koulutustausta.lukio.yotutkinto.fi"), "fi");
        optFi.setDefaultOption(true);
        ylioppilastutkinto.getOptions().add(optFi);
        ylioppilastutkinto.getOptions().add(new Option(TemplateUtil.createI18NForm("form.koulutustausta.lukio.yotutkinto.ib"), "ib"));
        ylioppilastutkinto.getOptions().add(new Option(TemplateUtil.createI18NForm("form.koulutustausta.lukio.yotutkinto.eb"), "eb"));
        ylioppilastutkinto.getOptions().add(new Option(TemplateUtil.createI18NForm("form.koulutustausta.lukio.yotutkinto.rp"), "rp"));
        ylioppilastutkinto.getValidators().add(new RequiredFieldValidator(ylioppilastutkinto.getName(),
                TemplateUtil.createI18NTextError("yleinen.pakollinen")));
        return ylioppilastutkinto;
    }
}
