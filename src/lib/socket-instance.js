// --- file: socket-instance.js --- //
import io from 'socket.io-client';

//const socket = io('https://floating-reef-32259.herokuapp.com', {transports: ['websocket'], origins: "*"})
const socket = io('http://localhost:3000')
export default socket // <-- use your socket server here and configuration