import { Schema, model } from 'mongoose';

interface IBroadcaster {
    username: string;
    sessionId: string;
    sessionLifeTime: number;
}

const broadcasterSchema = new Schema<IBroadcaster>({
    username: { type: String, unique: true, required: true },
    sessionId: { type: String, required: true },
    sessionLifeTime: { type: Number, default: null },
});

const Broadcaster = model<IBroadcaster>('broadcaster', broadcasterSchema);

export default Broadcaster;
