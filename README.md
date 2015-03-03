# Hakulomakkeen hallinnan angular-käyttöliittymä.

## Käynnistys lokaalissa kehitysympäristössä staattisilla json tiedostoilla

  cd hakulomakkeenhallinta-ui
  mvn clean install -P dev_static; mvn tomcat7:run-war-only -P dev_static

jonka jälkeen avaa selaimessa allaoleva urli:

http://localhost:8090/hakulomakkeenhallinta-ui/app/index.html

## Käynnistys lokaalissa kehitysympäristössä lokaali haku-api vasten

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
  ProxyPass http://localhost:8090/hakulomakkeenhallinta-ui
  ProxyPassReverse http://localhost:8090/hakulomakkeenhallinta-ui
  </Location>

*cas/myroles*

Lisää apache tarjoilemaan `cas/myroles` tiedosto, jonka saat joltain muulta kehittäjältä.
Eli kopioi se esim. OS X:ssä tänne:
  /Library/WebServer/Documents/cas/

*käynnistys*

esim. OS X:ssä: `sudo apachectl start`

### testaus

  cd hakulomakkeenhallinta-ui
  mvn clean install -P dev; mvn tomcat7:run-war-only -P dev

ja mene ensin haku-app:iin
http://localhost/haku-app/

Kirjaudu sisään: master / master

jonka jälkeen avaa selaimessa alla oleva urli:

http://localhost/hakulomakkeenhallinta-ui/app/index.html

## Mocha testit

Ajetaan junit testien mukana mvn:n buildissä.

### Ajo selaimessa

Käynnistä embedded tomcat IDEstä:
    fi.vm.sade.hakulomakkeenhallinta.HakulomakkeenhallintaUiTomcat

Aja testit:
    http://localhost:9092/test/runner.html
