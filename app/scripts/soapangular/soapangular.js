(function() {

    'use strict';

    angular.module('untangled.soapangular', [])
        .constant('SOAPConstants', {
            NAMESPACE_QUALIFIER: 'namespaceQualifier',
            NAMESPACE_URL: 'namespaceURL',
            NO_PREFIX: 'noPrefix',
            ELEMENT_NAME: 'elementName',
            XMLNS: 'xmlns'
        })

        .factory("soapangular", ['$q', 'SOAPConstants', function ($q, SOAPConstants) {

            var service = {
                setUrl: setUrl,
                setSoap12: setSoap12,
                resetSoapVersion: resetSoapVersion,
                setContext: setContext,                          // Used to set this in beforeSend, success, error and data callback functions
                setName: setName,
                addNamespace: addNamespace,
                addEnvelopeAttribute: addEnvelopeAttribute,
                setMethod: setMethod,
                setSoapAction: setSoapAction,
                addHttpHeader: addHttpHeader,
                addDataAsXMLString: addDataAsXMLString,
                addDataAsJson: addDataAsJson,
                addDataAsSoapObject: addDataAsSoapObject,
                addSoapHeaderAsJson: addSoapHeaderAsJson,
                enableLogging: enableLogging,
                disableLogging: disableLogging,
                post: post, // to enable the local log function set to true, defaults to false (optional)
                _options: {}
            };


            // Defaults
            service._options = {
                url: '',
                soap12: false,                                  // use SOAP 1.2 namespace and HTTP headers - default to false
                appendMethodToURL: false,
                context: document.body,
                envAttributes: {},
                HTTPHeaders: {}
            };
            
            return service;

            function setName(newName){
                service._options.elementName = newName;
            }

            function setUrl(url){
                service._options.url = url;
                return service;
            }
            
            function setSoap12(){
                service._options.soap12 = true;
                return service;
            }
            
            function resetSoapVersion(){
                service._options.soap12 = false;
                return service;
            }
            
            function setContext(context){
                service._options.context = context;
                return service;
            }

            function addNamespace(namespaceId, namespaceUrl){
                return addEnvelopeAttribute(SOAPConstants.XMLNS + ':' + namespaceId, namespaceUrl);
            }

            function addEnvelopeAttribute(name, value){
                service._options.envAttributes[name] = value;
                return service;
            }

            function setMethod(methodName, setMethodToUrl){
                service._options.method = methodName;
                service._options.appendMethodToURL = setMethodToUrl;
                return service;
            }

            function setSoapAction(soapAction){
                service._options.SOAPAction = soapAction;
                return service;
            }

            function addHttpHeader(headerName, headerValue) {
                service._options.HTTPHeaders[headerName] = headerValue;
                return service;
            }

            /**
             * Must be a well-formed XML string in its entirety. Else, it won't work
             * @param xmlStringData
             * @returns {*}
             */
            function addDataAsXMLString(xmlStringData){
                return _addDataToOptions(xmlStringData);
            }



            //namespaceQualifier: 'myns',                     // used as namespace prefix for all elements in request (optional)
            //namespaceURL: 'urn://service.my.server.com',    // namespace url added to parent request element (optional)
            //noPrefix: false,                                // set to true if you don't want the namespaceQualifier to be the prefix for the nodes in params. defaults to false (optional)
            //elementName: 'requestElementName',              // override 'method' as outer element (optional)

            function addDataAsJson(jsonData, jsonDataOptions){

                var allowableOptions = {};

                allowableOptions[SOAPConstants.NAMESPACE_QUALIFIER]
                = allowableOptions[SOAPConstants.NAMESPACE_URL]
                = allowableOptions[SOAPConstants.NO_PREFIX]
                = allowableOptions[SOAPConstants.ELEMENT_NAME]
                = true;

                for(var prop in jsonDataOptions){

                    if(jsonDataOptions.hasOwnProperty(prop) && !allowableOptions[prop]){
                        throw "Invalid Data Option:" + prop;
                    }

                    service._options[prop] = jsonDataOptions[prop];
                }
                return _addDataToOptions(jsonData);
            }

            function addDataAsSoapObject(soapObjectData){
                return _addDataToOptions(soapObjectData);
            }
            
            // Include namespace in headerData
            function addSoapHeaderAsJson(headerData){
                service._options.SOAPHeader = headerData;
                return service;
            }

            function enableLogging(){
                service._options.enableLogging = true;
                return service;
            }

            function disableLogging(){
                service._options.enableLogging = false;
                return service;
            }

            function _addDataToOptions(data){
                service._options.data = data;
                return service;
            }

            //function _addEnvAttributesToData(data){
            //    if (config.envAttributes) {
            //        for (var i in config.envAttributes) {
            //            soapEnvelope.addAttribute(i, config.envAttributes[i]);
            //        }
            //    }
            //}

            function post(newOptions) {

                var deferred = $q.defer();

                var opts = newOptions || service._options;
                opts.success = function (SOAPResponse) {
                    deferred.resolve(SOAPResponse);
                };
                opts.error = function (SOAPResponse) {
                    deferred.reject(SOAPResponse);
                };

                $.soap(opts);
                return deferred.promise;
            }

        }]);
})();