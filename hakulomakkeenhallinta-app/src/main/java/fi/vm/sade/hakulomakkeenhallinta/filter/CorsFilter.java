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

package fi.vm.sade.hakulomakkeenhallinta.filter;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import java.io.IOException;

/**
 * @author Mikko Majapuro
 */
public class CorsFilter implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext containerRequest, ContainerResponseContext containerResponse) throws IOException {
        if (containerRequest.getHeaders().containsKey("access-control-request-method")) {
            for (String value : containerRequest.getHeaders().get("access-control-request-method")) {
                containerResponse.getHeaders().add("Access-Control-Allow-Methods", value);
            }
        }
        if (containerRequest.getHeaders().containsKey("access-control-request-headers")) {
            for (String value : containerRequest.getHeaders().get("access-control-request-headers")) {
                containerResponse.getHeaders().add("Access-Control-Allow-Headers", value);
            }
        }
        containerResponse.getHeaders().add("Access-Control-Allow-Origin", "*");
    }
}
