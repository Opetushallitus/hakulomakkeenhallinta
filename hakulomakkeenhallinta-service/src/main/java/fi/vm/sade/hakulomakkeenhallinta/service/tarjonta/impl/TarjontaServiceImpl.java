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

import fi.vm.sade.hakulomakkeenhallinta.service.tarjonta.TarjontaService;
import fi.vm.sade.tarjonta.service.resources.HakuResource;
import org.glassfish.jersey.client.proxy.WebResourceFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;

/**
 * @author Mikko Majapuro
 */
@Service
public class TarjontaServiceImpl implements TarjontaService {

    private HakuResource hakuResource;

    @Autowired
    public TarjontaServiceImpl(@Value("${tarjonta.resource.url}") final String tarjontaResourceUrl) {
        WebTarget t = ClientBuilder.newClient().target(tarjontaResourceUrl);
        hakuResource = WebResourceFactory.newResource(HakuResource.class, t);
    }
}
