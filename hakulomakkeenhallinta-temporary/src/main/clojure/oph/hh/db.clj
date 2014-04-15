(ns oph.hh.db
  (:require
    [monger.core :as mg :only [insert find-map-by-id]]
    [monger.collection :as mc :only [connect! set-db!]]
    [clojure.zip :as zip]
    [monger.json]
    [propertea.core :as prop])
  (:use validateur.validation))

(def database "hakulomake")
(def application-system-collection "applicationSystem")


(def props (prop/read-properties 
             (str (System/getProperty "user.home") "/oph-configuration/common.properties") 
             :default [:mongodb.virkailija.url "mongodb://localhost:27017/hakulomake?maxpoolsize=50"]))

(defn connect-to-db
  []
  (mg/connect-via-uri! (props :mongodb.virkailija.url))
  (mg/set-db! (mg/get-db database)))

(connect-to-db)

(defn application-systems
  ([]  (mc/find-maps application-system-collection {} [:_id :name :_class]))
  ([query]  (mc/find-maps application-system-collection query [:_id :name]))
  ([query fields]  (mc/find-maps application-system-collection query fields)))

(defn application-system [id]
  (mc/find-map-by-id application-system-collection id))

(defn update-application-system
  [application-system]
  (mc/save application-system-collection application-system))

(defn list-application-systems
  []
  (connect-to-db)
  (mc/find-maps "testiii"))


(defn as-validator []
  (validation-set
    (presence-of :name)
    (presence-of :id)
    (presence-of :type)))

(defn validate-form
  "validate form"
  [form]
  (valid? (as-validator) form))
