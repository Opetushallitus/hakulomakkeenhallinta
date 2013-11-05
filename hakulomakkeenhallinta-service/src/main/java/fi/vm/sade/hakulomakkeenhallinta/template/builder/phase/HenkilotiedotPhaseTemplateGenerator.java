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
import fi.vm.sade.hakulomakkeenhallinta.domain.TextQuestion;
import fi.vm.sade.hakulomakkeenhallinta.domain.Theme;
import fi.vm.sade.hakulomakkeenhallinta.template.builder.util.TemplateUtil;
import org.springframework.stereotype.Service;

/**
 * @author Mikko Majapuro
 */
@Service
public class HenkilotiedotPhaseTemplateGenerator {



    public Phase create() {
        Phase phase = new Phase("henkilotiedot", TemplateUtil.createI18NForm("form.henkilotiedot.otsikko"));
        Theme henkilotiedotRyhma = new Theme("henkilotiedotGrp", TemplateUtil.createI18NForm("form.henkilotiedot.otsikko"));

        TextQuestion sukunimi = new TextQuestion("Sukunimi", TemplateUtil.createI18NForm("form.henkilotiedot.sukunimi"),
                "Sukunimi", 30);
        henkilotiedotRyhma.getChildren().add(sukunimi);

        TextQuestion etunimet = new TextQuestion("Etunimet", TemplateUtil.createI18NForm("form.henkilotiedot.etunimet"),
                "Etunimet", 30);
        henkilotiedotRyhma.getChildren().add(etunimet);

        phase.getChildren().add(henkilotiedotRyhma);
        return phase;
    }
}
