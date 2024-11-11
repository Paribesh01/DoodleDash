const WebSocket = require('ws');

function waitForAndPopLatestMessage(messageArray) {
  return new Promise(resolve => {
    if (messageArray.length > 0) {
      resolve(messageArray.shift());  
    } else {
      let interval = setInterval(() => {
        if (messageArray.length > 0) {
          resolve(messageArray.shift()); 
          clearInterval(interval);  
        }
      }, 100); 
    }
  });
}
let user1Ws;
let user2Ws;
let user3Ws;
let user4Ws
let user1message = [];
let user2message = [];
let user3message  = [];
let user4message = []
let roomid;

describe('WebSocket Room Creation and Joining Tests', () => {
  // let user1Ws;
  // let user2Ws;
  // let user3Ws;
  // let user4Ws
  // let user1message = [];
  // let user2message = [];
  // let user3message  = [];
  // let user4message = []
  // let roomid;

  async function wsready() {
    user1Ws = new WebSocket('ws://localhost:8081');
    user2Ws = new WebSocket('ws://localhost:8081');
    user3Ws = new WebSocket('ws://localhost:8081');
    user4Ws = new WebSocket('ws://localhost:8081');
    
    user1Ws.onmessage = function (event) {
      user1message.push(JSON.parse(event.data));
    };
    user2Ws.onmessage = function (event) {
      user2message.push(JSON.parse(event.data));
    };
    user3Ws.onmessage = function (event) {
      user3message.push(JSON.parse(event.data));
    };
    user4Ws.onmessage = function (event) {
      user4message.push(JSON.parse(event.data));
    };

    await new Promise(r => {
      user1Ws.onopen = r;
    });
    await new Promise(r => {
      user3Ws.onopen = r;
    });
    await new Promise(r => {
      user4Ws.onopen = r;
    });
    await new Promise(r => {
      user2Ws.onopen = r;
    });
  }




  jest.setTimeout(10000); 

  beforeEach(async () => {
    await wsready();
  });

  it('should allow user to create a room and join room', async () => {
    user1Ws.send(JSON.stringify({ action: 'createRoom' }));

    const message1 = await waitForAndPopLatestMessage(user1message);
    const message2 = await waitForAndPopLatestMessage(user1message);
    

    expect(message1.status).toBe('ID');
    expect(message2.status).toBe('roomCreated');
    roomid = message2.roomid
    user2Ws.send(JSON.stringify({ action: 'joinRoom', roomid: message2.roomid }));
    
    const message5 = await waitForAndPopLatestMessage(user2message);
    expect(message5.status).toBe('ID');
    const message4 = await waitForAndPopLatestMessage(user2message);
    expect(message4.status).toBe('playerJoined');
    user2Ws.send(JSON.stringify({ action: 'joinRoom', roomid: message1.roomid }));


  });


 





  afterEach(() => {
    if (user1Ws) {
      user1Ws.close();
    }
    if (user2Ws) {
      user2Ws.close();
    }
  });
});
