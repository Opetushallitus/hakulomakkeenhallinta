## Käynnistys
    mvn jetty:run

    tai

    mvn clojure:nepl --> system/boot

## History | grep hakulomakkeenhallinta

    wget http://localhost:8080/hakulomakkeenhallinta-temporary/application-system-form/haku4
    curl -v -X PUT -T haku4 -H "Content-Type: application/json" http://localhost:8080/hakulomakkeenhallinta-temporary/application-system-form/haku4

## build hakulomakkeen hallinnasta dev tai prod version paketointi
## dev paketointi sisältää javascritit paketoimattomina
## prod paketointi sisältää javascriptit paketoituna.
cd hakulomakkeenhallinta-ui
 mvn clean package/install -Pdev/prod