(ns oph.hh.system
  (:require [org.lpetit.ring.servlet.util :as util]
            [oph.hh.db :as db]
            [oph.hh.api :as api]
            [propertea.core :as prop]
            [ring.adapter.jetty :as jetty]))


(defn start-up [ctx]
  (def props (prop/read-properties
             (str (System/getProperty "user.home") "/oph-configuration/common.properties")
             :default [:mongodb.virkailija.uri "mongodb://localhost:27017/hakulomake?maxpoolsize=50"]))
  (db/connect (props :mongodb.virkailija.uri))
  (println "Starting app with params: " (util/context-params ctx)))

(defn shutdown [ctx]
  (println "Stopping app with params: " (util/context-params ctx)))

(defn boot []
  (jetty/run-jetty #'api/all-routes {:port 8080 :join? false}))


