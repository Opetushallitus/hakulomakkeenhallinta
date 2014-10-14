
# Hakulomakkeen hallinnan angular-käyttöliittymä.


## Käynnistys lokaalissa kehitysympäristössä

cd hakulomakkeenhallinta-ui

mvn clean install -P dev; mvn tomcat7:run-war-only -P dev

jonka jälkeen avaa selaimessa allaoleva urli:

http://localhost:8090/hakulomakkeenhallinta-ui/app/index.html