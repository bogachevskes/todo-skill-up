import ProducerInterface from "./ProducerInterface";
import RedisConnection from "../../app/Services/RedisConnection";

export default class RedisProducer implements ProducerInterface
{
    public async send(topic, msg: any): Promise<void> {
        if (typeof msg === "object") {
            msg = JSON.stringify(msg);
        }

        await RedisConnection.getClient()
            .publish(topic, msg);
    }

}