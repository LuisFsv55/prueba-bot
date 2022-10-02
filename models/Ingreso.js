const { Schema, model, default: mongoose } = require('mongoose');

const IngresoSchema = Schema({
    prospecto: {
        type: mongoose.Types.ObjectId,
        ref: 'Prospecto'
    },
    entrada: {
        type: Date,
        defaultValue: Date.now()
    }
}, {
    timestamps: true
});

module.exports = model( 'Ingreso', IngresoSchema );