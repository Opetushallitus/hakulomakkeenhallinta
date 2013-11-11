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

package fi.vm.sade.hakulomakkeenhallinta.service.impl;

import com.google.common.base.Function;
import com.google.common.collect.Lists;
import fi.vm.sade.hakulomakkeenhallinta.domain.Code;
import fi.vm.sade.hakulomakkeenhallinta.domain.Option;
import fi.vm.sade.hakulomakkeenhallinta.service.KoodistoService;
import fi.vm.sade.koodisto.service.types.common.KoodiType;
import fi.vm.sade.koodisto.util.KoodistoClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Mikko Majapuro
 */
@Service
public class KoodistoServiceImpl implements KoodistoService {

    private final KoodistoClient koodiService;
    private ConversionService conversionService;

    @Autowired
    public KoodistoServiceImpl(final KoodistoClient koodiService, final ConversionService conversionService) {
        this.koodiService = koodiService;
        this.conversionService = conversionService;
    }

    @Override
    public List<Code> searchCodesByKoodisto(String koodistoUri, Integer version) {
        List<KoodiType> codes = koodiService.getKoodisForKoodisto(koodistoUri, version);
        return Lists.transform(codes, new Function<KoodiType, Code>() {
            @Override
            public Code apply(KoodiType koodiType) {
                return conversionService.convert(koodiType, Code.class);
            }
        });
    }

    @Override
    public List<Option> searchOptionsByKoodisto(String koodistoUri, Integer version) {
        List<Code> codes = searchCodesByKoodisto(koodistoUri, version);
        return Lists.transform(codes, new Function<Code, Option>() {
            @Override
            public Option apply(Code code) {
                return conversionService.convert(code, Option.class);
            }
        });
    }
}
