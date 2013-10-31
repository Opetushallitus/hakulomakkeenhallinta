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

package fi.vm.sade.hakulomakkeenhallinta.converter;

import fi.vm.sade.hakulomakkeenhallinta.domain.ApplicationSystem;
import fi.vm.sade.hakulomakkeenhallinta.domain.I18nText;
import fi.vm.sade.tarjonta.service.resources.dto.HakuDTO;
import org.springframework.core.convert.converter.Converter;

/**
 * @author Mikko Majapuro
 */
public class HakuDTOToApplicationSystem implements Converter<HakuDTO, ApplicationSystem> {

    @Override
    public ApplicationSystem convert(HakuDTO hakuDTO) {
        if (hakuDTO != null) {
            ApplicationSystem as = new ApplicationSystem();
            as.setId(hakuDTO.getOid());
            as.setName(new I18nText(hakuDTO.getNimi()));
            return as;
        } else {
            return null;
        }
    }
}
