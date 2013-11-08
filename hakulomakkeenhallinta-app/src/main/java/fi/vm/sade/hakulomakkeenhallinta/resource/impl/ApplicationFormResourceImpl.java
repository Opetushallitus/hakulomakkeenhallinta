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

import com.google.common.base.Function;
import com.google.common.collect.Lists;
import fi.vm.sade.hakulomakkeenhallinta.api.dto.ApplicationFormCreateParameters;
import fi.vm.sade.hakulomakkeenhallinta.api.dto.ApplicationFormDTO;
import fi.vm.sade.hakulomakkeenhallinta.api.resource.ApplicationFormResource;
import fi.vm.sade.hakulomakkeenhallinta.domain.ApplicationForm;
import fi.vm.sade.hakulomakkeenhallinta.domain.ApplicationSystem;
import fi.vm.sade.hakulomakkeenhallinta.service.ApplicationFormService;
import fi.vm.sade.hakulomakkeenhallinta.service.ApplicationFormTemplateService;
import fi.vm.sade.hakulomakkeenhallinta.service.TarjontaService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author Mikko Majapuro
 */
@Component
public class ApplicationFormResourceImpl implements ApplicationFormResource {

    private ApplicationFormService applicationFormService;
    private ApplicationFormTemplateService applicationFormTemplateService;
    private TarjontaService tarjontaService;
    private ModelMapper modelMapper;

    @Autowired
    public ApplicationFormResourceImpl(ApplicationFormService applicationFormService,
                                       ApplicationFormTemplateService applicationFormTemplateService,
                                       TarjontaService tarjontaService, ModelMapper modelMapper) {
        this.applicationFormService = applicationFormService;
        this.applicationFormTemplateService = applicationFormTemplateService;
        this.tarjontaService = tarjontaService;
        this.modelMapper = modelMapper;
    }

    @Override
    public void createApplicationForm(ApplicationFormCreateParameters params) {
        ApplicationSystem as = tarjontaService.getApplicationSystem(params.getApplicationSystemId());
        ApplicationForm af = applicationFormTemplateService.createApplicationFormUsingTemplate(as, params.getApplicationFormTemplateId());
        applicationFormService.save(af);
    }

    @Override
    public List<ApplicationFormDTO> getApplicationForms() {
        return Lists.transform(applicationFormService.find(), new Function<ApplicationForm, ApplicationFormDTO>() {
            @Override
            public ApplicationFormDTO apply(ApplicationForm applicationForm) {
                return modelMapper.map(applicationForm, ApplicationFormDTO.class);
            }
        });
    }
}
