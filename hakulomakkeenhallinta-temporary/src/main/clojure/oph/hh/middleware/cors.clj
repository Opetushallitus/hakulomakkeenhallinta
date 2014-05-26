(ns oph.hh.middleware.cors)

(defn wrap-cors-origin
  [handler]
  (fn [request]
    (let [response (handler request)]
      (update-in response
                 [:headers "Access-Control-Allow-Origin"]
                 (fn [_] "*")))))

(defn wrap-cors-methods
  [handler]
  (fn [request]
    (let [response (handler request)]
      (update-in response
                 [:headers "Access-Control-Allow-Methods"]
                 (fn [_] "GET, PUT, POST, DELETE, OPTIONS")))))

(defn wrap-cors-headers
  [handler]
  (fn [request]
    (let [response (handler request)]
      (update-in response
                 [:headers "Access-Control-Allow-Headers"]
                 (fn [_] "Origin, X-Requested-With, Content-Type, Accept")))))
