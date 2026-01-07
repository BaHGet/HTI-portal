import { io } from "socket.io-client";
import axios from "axios";

const socketUrl = import.meta.env.VITE_BASE_API_SOCKET_URL;


export const socket = io(socketUrl + "/");
