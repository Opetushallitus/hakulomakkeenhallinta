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
import fi.vm.sade.hakulomakkeenhallinta.domain.*;
import fi.vm.sade.hakulomakkeenhallinta.service.tarjonta.ApplicationFormTemplateService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Mikko Majapuro
 */
@Service
public class ApplicationFormTemplateServiceImpl implements ApplicationFormTemplateService {

    @Override
    public ApplicationForm createApplicationFormUsingTemplate(ApplicationSystem applicationSystem, String templateId) {
        ApplicationForm af = new ApplicationForm();
        af.setId(applicationSystem.getId());
        af.setName(applicationSystem.getName());

        Phase phase1 = new Phase("phase1", new I18nText());
        Phase phase2 = new Phase("phase2", new I18nText());
        List<Element> children = Lists.newArrayList((Element)phase1, (Element)phase2);
        af.setChildren(children);
        return af;
    }
}
