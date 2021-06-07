const messageHandler = require("../../helpers/message-handler.js");
import {messageMock} from '../mocks/message-mock';


//MAIN FUNCTIONS -------------------------------------------------------------------------------------------------------


describe("Message Handler NEW", () => {
    
    it("should call a message handler", () => {
        messageHandler.handleMessage(messageMock);
    })
})

