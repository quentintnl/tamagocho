import mongoose from 'mongoose'

const {Schema} = mongoose

const monsterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: false,
        default: 1
    },
    draw: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true,
        enum: ['happy', 'sad', 'angry', 'hungry', 'neutral'],
        default: 'happy'
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
})

export default mongoose.model('Monster', monsterSchema) ?? mongoose.models.Monster
