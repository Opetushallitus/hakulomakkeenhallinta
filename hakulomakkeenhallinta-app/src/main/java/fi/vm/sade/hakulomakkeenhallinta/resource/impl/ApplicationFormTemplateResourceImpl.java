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
import com.google.common.collect.Maps;
import fi.vm.sade.hakulomakkeenhallinta.api.dto.ApplicationFormTemplateDTO;
import fi.vm.sade.hakulomakkeenhallinta.api.dto.I18nTextDTO;
import fi.vm.sade.hakulomakkeenhallinta.api.resource.ApplicationFormTemplateResource;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * @author Mikko Majapuro
 */
@Component
public class ApplicationFormTemplateResourceImpl implements ApplicationFormTemplateResource {

    @Override
    public List<ApplicationFormTemplateDTO> getApplicationFormTemplates() {
        //TODO implement this!
        Map<String, String> yhteishaku = Maps.newHashMap();
        yhteishaku.put("fi", "Yhteishaku");
        yhteishaku.put("sv", "Yhteishaku_sv");
        Map<String, String> lisahaku = Maps.newHashMap();
        lisahaku.put("fi", "Lisähaku");
        lisahaku.put("sv", "Lisähaku_sv");
        return Lists.newArrayList(new ApplicationFormTemplateDTO("hakutyyppi_01", new I18nTextDTO(yhteishaku)),
                new ApplicationFormTemplateDTO("hakutyyppi_03", new I18nTextDTO(lisahaku)));
    }
}
