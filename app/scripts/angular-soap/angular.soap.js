angular.module('angularSoap', [])

    .factory("soap",['$q',function($q){

        var options = {
            url: 'https://lite.realtime.nationalrail.co.uk/OpenLDBWS/ldb6.asmx',      //endpoint address for the service
            //method: 'helloWorld',                           // service operation name
            // 1) will be appended to url if appendMethodToURL=true
            // 2) will be used for request element name when building xml from JSON 'params' (unless 'elementName' is provided)
            // 3) will be used to set SOAPAction request header if no SOAPAction is specified
            appendMethodToURL: false,                        // method name will be appended to URL defaults to true
            //SOAPAction: 'action',                           // manually set the Request Header 'SOAPAction', defaults to the method specified above (optional)
            soap12: false,                                  // use SOAP 1.2 namespace and HTTP headers - default to false
            context: document.body,                          // Used to set this in beforeSend, success, error and data callback functions

            // addional headers and namespaces
            envAttributes: {                                // additional attributes (like namespaces) for the Envelope:
                'xmlns:ns2': "http://thalesgroup.com/RTTI/2010-11-01/ldb/commontypes",
                'xmlns:ns1':"http://thalesgroup.com/RTTI/2014-02-20/ldb/"
            },
            HTTPHeaders: {                                  // additional http headers send with the $.ajax call, will be given to $.ajax({ headers: })
                'Content-type': 'text/xml; charset=utf-8'
            },

            data: '<?xml version="1.0"?>' +
            '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://thalesgroup.com/RTTI/2014-02-20/ldb/" xmlns:ns2="http://thalesgroup.com/RTTI/2010-11-01/ldb/commontypes">' +
            //'    <SOAP-ENV:Header>' +
            //'        <ns2:AccessToken>' +
            //'            <ns2:TokenValue>7e230971-9e3e-48dc-83e6-1a631baeba78</ns2:TokenValue>' +
            //'        </ns2:AccessToken>' +
            //'    </SOAP-ENV:Header>' +
            '    <SOAP-ENV:Body>' +
            '    <ns1:GetDepartureBoardRequest>' +
            '        <ns1:numRows>10</ns1:numRows>' +
            '        <ns1:crs>MAN</ns1:crs>' +
            '    </ns1:GetDepartureBoardRequest>' +
            '    </SOAP-ENV:Body>' +
            '</SOAP-ENV:Envelope>',
            // XML String for request (alternative to internal build of XML from JSON 'params')
            //data: {                                         // JSON structure used to build request XML - SHOULD be coupled with ('namespaceQualifier' AND 'namespaceURL') AND ('method' OR 'elementName')
            //    name: 'Remy Blom',
            //    msg: 'Hi!'
            //},
            //data: function(SOAPObject) {                    // function returning an instance of the SOAPObject class
            //    return new SOAPObject('soap:Envelope')
            //        .addNamespace('soap', 'http://schemas.xmlsoap.org/soap/envelope/')
            //        .newChild('soap:Body')
            //        ... etc, etc
            //        .end()
            //},

            ////these options ONLY apply when the request XML is going to be built from JSON 'params'
            //namespaceQualifier: 'myns',                     // used as namespace prefix for all elements in request (optional)
            //namespaceURL: 'urn://service.my.server.com',    // namespace url added to parent request element (optional)
            //noPrefix: false,                                // set to true if you don't want the namespaceQualifier to be the prefix for the nodes in params. defaults to false (optional)
            //elementName: 'requestElementName',              // override 'method' as outer element (optional)

            ////callback functions
            //beforeSend: function (SOAPEnvelope)  {},        // callback function - SOAPEnvelope object is passed back prior to ajax call (optional)
            statusCode: {                                   // callback functions based on statusCode
                404: function() {
                    console.log('404 Not Found')
                },
                200: function() {
                    console.log('200 OK')
                }
            },

            // debugging
            enableLogging: true                            // to enable the local log function set to true, defaults to false (optional)
        };

        var service = {
            post: post,
            options: options
        };

        return service;

        //////

        function post(options){

            var deferred = $q.defer();

            var opts = options || service.options;
            opts.SOAPHeader = {
                'ns2:AccessToken': {
                    'ns2:TokenValue': '7e230971-9e3e-48dc-83e6-1a631baeba78'
                }
            };

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
