import { Expo } from "expo-server-sdk";

export const sendNotification = async () => {
  const expo = new Expo({ accessToken: process.env.EXPO_TOKEN });
  const chunks = expo.chunkPushNotifications([
    {
      to: "ExponentPushToken[MsRtoCIYw5EE9fjItWXp98]",
      title: "Hi ffff",
      body: "eee sdfjfd",
      sound: "default",
    },
    {
      to: "ExponentPushToken[MsRtoCIYw5EE9fjItWXp98]",
      title: "Hi ffff----------",
      body: "eee sdfjfd",
      sound: "default",
    },
  ]);
  const tickets = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error(error);
    }
  }

  let response = "";

  for (const ticket of tickets) {
    if (ticket.status === "error") {
      if (ticket.details && ticket.details.error === "DeviceNotRegistered") {
        response = "DeviceNotRegistered";
      }
    }

    if (ticket.status === "ok") {
      response = ticket.id;
    }
  }

  return response;
};
