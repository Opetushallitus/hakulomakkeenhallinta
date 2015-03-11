# Hakulomakkeen hallinnan angular-käyttöliittymä.

# Default mochatesti server

osittain mock data & muuten lokaalit palvelut

## Mocha testit

Ajetaan junit testien mukana mvn:n buildissä.

### Ajo selaimessa

Käynnistä embedded tomcat IDEstä:

    fi.vm.sade.hakulomakkeenhallinta.HakulomakkeenhallintaUiTomcat

Aja testit:

    http://localhost:9092/test/runner.html

# Server ilman lokaaleja muita palveluita

eli myös haku-app ja authentication-service mockattu

vaihda test/resources/test-web.xml:ssä

    <init-param>
        <param-name>confPath</param-name>
        <param-value>urlrewrite_mock_backend.xml</param-value>
    </init-param>

# Server, joka käyttää lokaalia haku-appia ja muuten luokkaa

eli käytetään lokaali haku-app, mutta muuten luokan palveluita

vaihda test/resources/test-web.xml:ssä

    <init-param>
        <param-name>confPath</param-name>
        <param-value>urlrewrite_no_mock.xml</param-value>
    </init-param>

Käynnistä embedded tomcat IDEstä:

    fi.vm.sade.hakulomakkeenhallinta.HakulomakkeenhallintaUiTomcat

Mene

    http://localhost:9092/hakulomakkeenhallinta-ui/app/index.html


## lokaali haku-app

pitää olla käynnistettu, sekä lokaali mongoDB

## apache

Tarvitaan lokaali apache proxyttämään, jotta saadaan hakulomakkeenhallinta ja haku-app näkymään samaan (80) locanhost porttiin.

*Konffi*. esim. OS X:ssä `/etc/apache2/httpd.conf`:
    ProxyRequests Off
    ProxyPreserveHost On

    # haku-app
    <Location /haku-app>
    ProxyPass http://localhost:9090/haku-app
    ProxyPassReverse http://localhost:9090/haku-app
    </Location>

    # hakulomakkeenhallinta
    <Location /hakulomakkeenhallinta-ui>
    ProxyPass http://localhost:9092/hakulomakkeenhallinta-ui
    ProxyPassReverse http://localhost:9092/hakulomakkeenhallinta-ui
    </Location>

*käynnistys*

esim. OS X:ssä: `sudo apachectl start`

### testaus

Käynnistä embedded tomcat IDEstä:

    fi.vm.sade.hakulomakkeenhallinta.HakulomakkeenhallintaUiTomcat

ja mene ensin haku-app:iin

    http://localhost/haku-app/

Kirjaudu sisään: master / master

jonka jälkeen avaa selaimessa alla oleva urli:

    http://localhost/hakulomakkeenhallinta-ui/app/index.html


