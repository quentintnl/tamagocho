import mongoose from 'mongoose'

const { Schema } = mongoose

const walletSchema = new Schema({
    ownerId: {
        type: String,
        required: true,
        unique: true
    },
    coin: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
})

const Wallet = mongoose.models.Wallet || mongoose.model('Wallet', walletSchema)

export default Wallet
