(ns oph.hh.war
  (:use ring.util.servlet)
  (:require [oph.hh.api :as api])
  (:gen-class :extends javax.servlet.http.HttpServlet))

(defservice api/all-routes)
