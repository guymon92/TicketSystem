import mongoose, { mongo } from 'mongoose';


const TicketSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
    creationTime:{
        // type: Date,
        // default: Date.now,
        // required: true,
        type: Number,
        required: true
    },
    userEmail: {
        type: String,
        required: true,
    },
    labels: {
        type: [String],
        required : false
    },
    hide: {
        type: Boolean,
        required: false
    },
    showLess: {
        type: Boolean,
        required : false
    }
});

module.exports = mongoose.model('Ticket', TicketSchema);