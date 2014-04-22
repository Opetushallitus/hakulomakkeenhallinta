(ns oph.hh.system
  (:use [clojure.tools.logging :only (info debug)])
  (:require [org.lpetit.ring.servlet.util :as util]
            [oph.hh.db :as db]
            [oph.hh.api :as api]
            [propertea.core :as prop]
            [ring.adapter.jetty :as jetty]))

(def props-file-path (str (System/getProperty "user.home") "/oph-configuration/common.properties"))
(def default-mongo-url "mongodb://localhost:27017")
(def db-name "hakulomake")

(defn start-up [ctx]
  (info "Starting app")
  (let [props (prop/read-properties
               props-file-path :default [:mongodb.virkailija.uri default-mongo-url])
        mongo-url (props :mongodb.virkailija.uri)]
    (debug "mongodb.virkailija.uri" mongo-url)
    (db/connect! (str mongo-url "/" db-name))))

(defn shutdown [ctx]
  (info "Stopping app")
  (db/disconnect!))

(defn boot []
  (jetty/run-jetty #'api/all-routes {:port 8080 :join? false}))


