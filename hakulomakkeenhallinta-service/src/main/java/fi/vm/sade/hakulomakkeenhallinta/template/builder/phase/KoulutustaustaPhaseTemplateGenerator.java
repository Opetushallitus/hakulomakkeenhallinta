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
        /*
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
}
