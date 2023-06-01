ENDO=yarn --silent endo
ST=$(shell yarn --silent endo where state)
PN=$(ST)/pet-name

start: $(PN)/echoSvc.json $(PN)/wss8.json
	$(ENDO) eval echoWorker 'E(echoSvc).startOn(wss8)' echoSvc wss8

$(PN)/wss8.json: $(PN)/socketDev.json
	$(ENDO) eval -n wss8 socketWorker 'E(socketDev).makeServer(8080)' socketDev

$(PN)/echoSvc.json: $(PN)/echoWorker.json $(PN)/echoBundle.json
	$(ENDO) import-bundle0 echoWorker echoBundle -n echoSvc

$(PN)/echoBundle.json:
	$(ENDO) bundle src/echo.js -n echoBundle

$(PN)/echoWorker.json:
	$(ENDO) spawn echoWorker

$(PN)/socketDev.json: $(PN)/socketWorker.json src/dev/webSocket.js
	$(ENDO) import-unsafe0 socketWorker src/dev/webSocket.js -n socketDev

$(PN)/socketWorker.json:
	$(ENDO) spawn socketWorker

clean:
	$(ENDO) reset
