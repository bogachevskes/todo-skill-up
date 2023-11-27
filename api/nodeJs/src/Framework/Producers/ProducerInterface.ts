export default interface ProducerInterface
{
    send(topic: string, msg:any);
}