(ns oph.hh.db
  (:require
    [monger.core :as mg :only [insert find-map-by-id]]
    [monger.collection :as mc :only [connect! set-db!]]
    [clojure.zip :as zip]
    [monger.json])
  (:use validateur.validation))

(def database "hakulomake")
(def application-system-collection "applicationSystem")


(defn connect! [url]
  "Connect to db"
  (mg/connect-via-uri! url)
  (mg/set-db! (mg/get-db database)))

(defn disconnect! []
  "Close db connection"
  mg/disconnect!)

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
