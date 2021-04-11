import { Message } from 'discord.js';


export const messageMock = ({
    channel: {
        send: jest.fn(),
    },
    author: {
        bot: false
    },
    content: "! new test case"
} as unknown) as Message;
