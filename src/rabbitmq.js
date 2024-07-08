import amqp from 'amqplib';

let channel = null;

export async function connectRabbitMQ(broadcast) {
  try {
    const connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('notifications', { durable: true });
    console.log('Connected to RabbitMQ');

    channel.consume('notifications', (msg) => {
      if (msg !== null) {
        const notification = JSON.parse(msg.content.toString());
        console.log('Received notification:', notification);

        // Broadcast notification via WebSocket
        broadcast(notification);

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
  }
}

export async function sendMessageToQueue(message) {
  if (!channel) {
    console.error('RabbitMQ channel is not initialized');
    return;
  }
  try {
    channel.sendToQueue('notifications', Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log('Message sent to queue:', message);
  } catch (error) {
    console.error('Error sending message to queue:', error);
  }
}
