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

package fi.vm.sade.hakulomakkeenhallinta.service.tarjonta.impl;

import com.google.common.collect.Lists;
import fi.vm.sade.hakulomakkeenhallinta.domain.ApplicationForm;
import fi.vm.sade.hakulomakkeenhallinta.domain.ApplicationSystem;
import fi.vm.sade.hakulomakkeenhallinta.domain.Element;
import fi.vm.sade.hakulomakkeenhallinta.service.tarjonta.ApplicationFormTemplateService;
import fi.vm.sade.hakulomakkeenhallinta.template.builder.phase.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Mikko Majapuro
 */
@Service
public class ApplicationFormTemplateServiceImpl implements ApplicationFormTemplateService {

    private HenkilotiedotPhaseTemplateGenerator henkilotiedotPhaseTemplateGenerator;
    private KoulutustaustaPhaseTemplateGenerator koulutustaustaPhaseTemplateGenerator;
    private HakutoiveetPhaseTemplateGenerator hakutoiveetPhaseTemplateGenerator;
    private OsaaminenPhaseTemplateGenerator osaaminenPhaseTemplateGenerator;
    private LisatiedotPhaseTemplateGenerator lisatiedotPhaseTemplateGenerator;

    @Autowired
    public ApplicationFormTemplateServiceImpl(HenkilotiedotPhaseTemplateGenerator henkilotiedotPhaseTemplateGenerator,
                                              KoulutustaustaPhaseTemplateGenerator koulutustaustaPhaseTemplateGenerator,
                                              HakutoiveetPhaseTemplateGenerator hakutoiveetPhaseTemplateGenerator,
                                              OsaaminenPhaseTemplateGenerator osaaminenPhaseTemplateGenerator,
                                              LisatiedotPhaseTemplateGenerator lisatiedotPhaseTemplateGenerator) {
        this.henkilotiedotPhaseTemplateGenerator = henkilotiedotPhaseTemplateGenerator;
        this.koulutustaustaPhaseTemplateGenerator = koulutustaustaPhaseTemplateGenerator;
        this.hakutoiveetPhaseTemplateGenerator = hakutoiveetPhaseTemplateGenerator;
        this.osaaminenPhaseTemplateGenerator = osaaminenPhaseTemplateGenerator;
        this.lisatiedotPhaseTemplateGenerator = lisatiedotPhaseTemplateGenerator;
    }

    @Override
    public ApplicationForm createApplicationFormUsingTemplate(ApplicationSystem applicationSystem, String templateId) {
        ApplicationForm af = new ApplicationForm();
        af.setId(applicationSystem.getId());
        af.setName(applicationSystem.getName());
        List<Element> children = Lists.newArrayList((Element)henkilotiedotPhaseTemplateGenerator.create(templateId),
                koulutustaustaPhaseTemplateGenerator.create(), hakutoiveetPhaseTemplateGenerator.create(),
                osaaminenPhaseTemplateGenerator.create(), lisatiedotPhaseTemplateGenerator.create());
        af.setChildren(children);
        return af;
    }
}
