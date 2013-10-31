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

package fi.vm.sade.hakulomakkeenhallinta.resource.impl;

import com.google.common.collect.Lists;
import fi.vm.sade.hakulomakkeenhallinta.api.dto.ApplicationFormCreateParameters;
import fi.vm.sade.hakulomakkeenhallinta.api.dto.ApplicationFormDTO;
import fi.vm.sade.hakulomakkeenhallinta.api.resource.ApplicationFormResource;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author Mikko Majapuro
 */
@Component
public class ApplicationFormResourceImpl implements ApplicationFormResource {

    @Override
    public void createApplicationForm(ApplicationFormCreateParameters params) {
    }

    @Override
    public List<ApplicationFormDTO> getApplicationForms() {
        return Lists.newArrayList();
    }
}
