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

import fi.vm.sade.hakulomakkeenhallinta.domain.Code;
import fi.vm.sade.hakulomakkeenhallinta.domain.PostOffice;
import org.springframework.core.convert.converter.Converter;

/**
 * @author Mikko Majapuro
 */
public class CodeToPostOffice implements Converter<Code, PostOffice> {


    @Override
    public PostOffice convert(Code code) {
        if (code != null) {
            PostOffice postOffice = new PostOffice(code.getValue(), code.getName());
            return postOffice;
        } else {
            return null;
        }
    }
}
