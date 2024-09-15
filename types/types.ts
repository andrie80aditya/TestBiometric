type SocketMessage = {
  type: "guidance" | "work" | "error";
  message: string;
};

type ImageMessage = {
  type: "image";
  data: string;
};

export type WebSocketData = SocketMessage | ImageMessage;

export type User = {
  accountNo: string;
  accountHolderName: string;
};

export type DeleteResponse = {
  message: string;
};

export type UpdateResponse = {
    message: string;
  };
  
