
# Hakulomakkeen hallinnan angular-käyttöliittymä.


TODO: Mavenin tomcat7-plugarin konffit ei ole kunnossa tällä hetkellä, korjataan jos joku vielä käyttää tätä oikeasti.
Parempi tapa on ajaa HakulomakkeenhallintaUiTomcat.java -luokkaa suoraan IDEA:sta käsin. 

## Käynnistys lokaalissa kehitysympäristössä staattisilla json tiedostoilla

cd hakulomakkeenhallinta-ui

mvn clean install -P dev_static; mvn tomcat7:run-war-only -P dev_static

jonka jälkeen avaa selaimessa allaoleva urli:

http://localhost:8090/hakulomakkeenhallinta-ui/app/index.html

## Käynnistys lokaalissa kehitysympäristössä lokaali haku-api vasten

lokaali haku-app käynnistettu, sekä lokaali mongoDB
cd hakulomakkeenhallinta-ui

mvn clean install -P dev; mvn tomcat7:run-war-only -P dev

jonka jälkeen avaa selaimessa allaoleva urli:

http://localhost/hakulomakkeenhallinta-ui/app/index.html