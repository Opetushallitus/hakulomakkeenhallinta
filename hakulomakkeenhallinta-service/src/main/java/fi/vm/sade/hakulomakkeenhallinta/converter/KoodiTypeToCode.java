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

import com.google.common.collect.Maps;
import fi.vm.sade.hakulomakkeenhallinta.domain.Code;
import fi.vm.sade.hakulomakkeenhallinta.domain.I18nText;
import fi.vm.sade.koodisto.service.types.common.KoodiMetadataType;
import fi.vm.sade.koodisto.service.types.common.KoodiType;
import org.springframework.core.convert.converter.Converter;

import java.util.List;
import java.util.Map;

/**
 * @author Mikko Majapuro
 */
public class KoodiTypeToCode implements Converter<KoodiType, Code> {

    @Override
    public Code convert(KoodiType koodiType) {
        if (koodiType != null) {
            List<KoodiMetadataType> metadata = koodiType.getMetadata();
            Map<String, String> name = Maps.newHashMap();
            Map<String, String> description = Maps.newHashMap();
            for (KoodiMetadataType koodiMetadataType : metadata) {
                String lang = koodiMetadataType.getKieli().value().toLowerCase();
                name.put(lang, koodiMetadataType.getNimi());
                description.put(lang, koodiMetadataType.getKuvaus());
            }
            return new Code(koodiType.getKoodiArvo(), new I18nText(name), new I18nText(description));
        } else {
            return null;
        }
    }
}
