
const messageHandler = require("../../helpers/message-handler.js");
import {messageMock} from '../mocks/message-mock';

describe("Message Handler NEW", () => {
    
    it("should call a message handler", () => {
        messageHandler.handleMessage(messageMock);
    })
})

//toHaveBeenCalled(1)  